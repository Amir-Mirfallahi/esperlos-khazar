import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getProductById, updateProduct, deleteProduct } from "@/utils/product";
import prisma from "@/lib/prisma";
import { DeleteObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { s3 } from "@/lib/s3";
import React from "react";

// GET /api/protected/products/[id] - Get a single product
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    // Check if user is authenticated and has appropriate role
    if (
      !session?.user ||
      !["SUPERADMIN", "PRODUCTMANAGER"].includes(session.user.role)
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const id = params.id;

    // Check if id is a valid number
    if (isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: "Invalid product ID" },
        { status: 400 }
      );
    }

    const product = await getProductById(id);

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PATCH /api/protected/products/[id] - Update a product
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const uploadedKeys: string[] = [];
  const uploadedImagesDetails: { imageUrl: string; s3key: string }[] = [];

  try {
    const session = await getServerSession(authOptions);

    if (
      !session?.user ||
      !["SUPERADMIN", "PRODUCTMANAGER"].includes(session.user.role)
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    if (isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: "Invalid product ID" },
        { status: 400 }
      );
    }

    const formData = await request.formData();
    const productDataFields: { [key: string]: any } = {};
    const imageFiles: File[] = [];

    for (const [key, value] of formData.entries()) {
      if (
        typeof value === "object" &&
        typeof value.arrayBuffer === "function" &&
        typeof value.name === "string"
      ) {
        imageFiles.push(value);
      } else {
        productDataFields[key] = value;
      }
    }

    if (productDataFields.price !== undefined) {
      productDataFields.price = parseInt(productDataFields.price);
    }

    if (productDataFields.categoryId !== undefined) {
      productDataFields.categoryId = parseInt(productDataFields.categoryId);
    }

    if (productDataFields.isFeatured !== undefined) {
      productDataFields.isFeatured =
        productDataFields.isFeatured === "true" ||
        productDataFields.isFeatured === true;
    }

    if (productDataFields.slug) {
      const existingProduct = await prisma.product.findFirst({
        where: {
          slug: productDataFields.slug,
          NOT: { id: parseInt(id) },
        },
      });

      if (existingProduct) {
        return NextResponse.json(
          { error: "A product with this slug already exists" },
          { status: 400 }
        );
      }
    }

    if (productDataFields.removedS3Keys !== undefined) {
      try {
        const keys =
          typeof productDataFields.removedS3Keys === "string"
            ? JSON.parse(productDataFields.removedS3Keys)
            : productDataFields.removedS3Keys;

        for (const key of keys) {
          const command = new DeleteObjectCommand({
            Bucket: process.env.LIARA_BUCKET_NAME,
            Key: key,
          });

          await s3.send(command);
        }
      } catch (e) {
        console.error("Error parsing removedS3Keys:", e);

        return NextResponse.json(
          { error: "Invalid format for removedS3Keys" },
          { status: 400 }
        );
      }
    }

    for (const file of imageFiles) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const filename = file.name.replace(/[^a-zA-Z0-9_.-]/g, "_");
      const key = `products/${Date.now()}_${filename}`;

      await s3.send(
        new PutObjectCommand({
          Bucket: process.env.LIARA_BUCKET_NAME!,
          Key: key,
          Body: buffer,
          ContentType: file.type,
          ACL: "public-read",
        })
      );

      const url = `https://${process.env.LIARA_BUCKET_NAME}.storage.iran.liara.space/${key}`;
      uploadedImagesDetails.push({ imageUrl: url, s3key: key });
      uploadedKeys.push(key);
    }

    const updatedProduct = await updateProduct(
      id,
      {
        ...productDataFields,
        price: productDataFields.price,
        categoryId: productDataFields.categoryId,
        isFeatured: productDataFields.isFeatured,
      },
      uploadedImagesDetails
    );

    return NextResponse.json({
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    if (uploadedKeys.length > 0) {
      for (const key of uploadedKeys) {
        const command = new DeleteObjectCommand({
          Bucket: process.env.LIARA_BUCKET_NAME,
          Key: key,
        });
        await s3.send(command);
      }
    }

    console.error("Error updating product:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to update product due to unknown error",
      },
      { status: 500 }
    );
  }
}

// DELETE /api/protected/products/[id] - Delete a product
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    // Check if user is authenticated and has appropriate role
    if (
      !session?.user ||
      !["SUPERADMIN", "PRODUCTMANAGER"].includes(session.user.role)
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const id = params.id;

    // Check if id is a valid number
    if (isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: "Invalid product ID" },
        { status: 400 }
      );
    }

    // Delete all product images first
    await prisma.productImage.deleteMany({
      where: { productId: parseInt(id) },
    });

    // Then delete the product
    await deleteProduct(id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
