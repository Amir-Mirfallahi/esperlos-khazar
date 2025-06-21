import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getProducts, createProduct } from "@/utils/product";
import prisma from "@/lib/prisma";
import cloudinary from "@/lib/cloudinary"; // Adjust path if needed

// GET /api/protected/products - Get all products
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    // Check if user is authenticated and has appropriate role
    if (
      !session?.user ||
      !["SUPERADMIN", "PRODUCTMANAGER"].includes(session.user.role)
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page: number = parseInt(searchParams.get("page") || "1");
    const limit: number = parseInt(searchParams.get("limit") || "10");
    const response = await getProducts(page, limit);

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/protected/products - Create a new product
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (
      !session?.user ||
      !["SUPERADMIN", "PRODUCTMANAGER"].includes(session.user.role)
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const productDataFields: { [key: string]: any } = {};
    const imageFiles: File[] = [];

    for (const [key, value] of formData.entries()) {
      if (value instanceof File) {
        // Assuming files are sent with a key like 'images'
        // Or any other key that might contain file(s)
        imageFiles.push(value);
      } else {
        productDataFields[key] = value;
      }
    }

    // Validate required fields
    if (
      !productDataFields.name ||
      !productDataFields.slug ||
      !productDataFields.price ||
      !productDataFields.categoryId
    ) {
      return NextResponse.json(
        { error: "Name, slug, price, and category are required" },
        { status: 400 }
      );
    }

    // Check if slug is unique
    const existingProduct = await prisma.product.findUnique({
      where: { slug: productDataFields.slug },
    });

    if (existingProduct) {
      return NextResponse.json(
        { error: "A product with this slug already exists" },
        { status: 400 }
      );
    }

    const uploadedImagesDetails: Array<{ imageUrl: string; publicId: string }> =
      [];
    const uploadedPublicIds: string[] = [];

    try {
      for (const file of imageFiles) {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const result = await new Promise<{
          secure_url: string;
          public_id: string;
          error?: any;
        }>((resolve, reject) => {
          cloudinary.uploader
            .upload_stream({ folder: "products" }, (error, uploadResult) => {
              if (error) return reject(error);
              if (uploadResult) {
                return resolve(uploadResult);
              }
              return reject(
                new Error("Cloudinary upload failed without error object.")
              );
            })
            .end(buffer);
        });

        if (result.error) {
          throw new Error(result.error.message || "Cloudinary upload failed");
        }

        uploadedImagesDetails.push({
          imageUrl: result.secure_url,
          publicId: result.public_id,
        });
        uploadedPublicIds.push(result.public_id);
      }

      const productToCreate = {
        name: String(productDataFields.name),
        slug: String(productDataFields.slug),
        price: parseInt(String(productDataFields.price)),
        description: productDataFields.description
          ? String(productDataFields.description)
          : "",
        categoryId: parseInt(String(productDataFields.categoryId)),
        isFeatured: Boolean(productDataFields.isFeatured),
      };

      // Now call your utility function
      const newProduct = await createProduct(
        productToCreate as any, // Type assertion might be needed depending on createProduct signature
        uploadedImagesDetails
      );

      return NextResponse.json(
        { message: "Product created successfully", product: newProduct },
        { status: 201 }
      );
    } catch (uploadOrDbError) {
      // If any error occurs after some images are uploaded, try to delete them from Cloudinary
      if (uploadedPublicIds.length > 0) {
        console.log(
          "Attempting to delete uploaded images from Cloudinary due to error:",
          uploadedPublicIds
        );
        for (const publicId of uploadedPublicIds) {
          await cloudinary.uploader.destroy(publicId).catch((delError) => {
            console.error(
              "Failed to delete image from Cloudinary during cleanup:",
              publicId,
              delError
            );
          });
        }
      }
      console.error(
        "Error during product creation or image upload:",
        uploadOrDbError
      );
      const errorMessage =
        uploadOrDbError instanceof Error
          ? uploadOrDbError.message
          : "An unknown error occurred.";
      return NextResponse.json(
        { message: "Failed to create product", error: errorMessage },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error parsing form data or unexpected error:", error);
    const errorMessage =
      error instanceof Error
        ? error.message
        : "An internal server error occurred.";
    return NextResponse.json(
      { message: "Internal server error", error: errorMessage },
      { status: 500 }
    );
  }
}
