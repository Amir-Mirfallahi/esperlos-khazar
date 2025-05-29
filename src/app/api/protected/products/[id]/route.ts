import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getProductById, updateProduct, deleteProduct } from "@/utils/product";
import prisma from "@/lib/prisma";

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

    const body = await request.json();

    // Process the price if it's in the body
    if (body.price !== undefined) {
      body.price = parseInt(body.price);
    }

    // Process categoryId if it's in the body
    if (body.categoryId !== undefined) {
      body.categoryId = parseInt(body.categoryId);
    }

    // Process isFeatured if it's in the body
    if (body.isFeatured !== undefined) {
      body.isFeatured = Boolean(body.isFeatured);
    }

    // Check if slug exists and is unique
    if (body.slug) {
      const existingProduct = await prisma.product.findFirst({
        where: {
          slug: body.slug,
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

    // Update the product
    const updatedProduct = await updateProduct(id, body as any);

    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json(
      { error: "Internal server error" },
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
