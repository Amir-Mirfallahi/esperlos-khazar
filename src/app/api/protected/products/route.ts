import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getProducts, createProduct } from "@/utils/product";
import prisma from "@/lib/prisma";
import { s3 } from "@/lib/s3";
import { DeleteObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";

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
    const imageFiles: any[] = [];

    for (const [key, value] of formData.entries()) {
      if (
        typeof value === "object" &&
        typeof value.arrayBuffer === "function" &&
        typeof value.name === "string"
      ) {
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
        { error: "نام، اسلاگ، قیمت و دسته بندی واجب هستند." },
        { status: 400 }
      );
    }

    // Check if slug is unique
    const existingProduct = await prisma.product.findUnique({
      where: { slug: productDataFields.slug },
    });

    if (existingProduct) {
      return NextResponse.json(
        { error: "یک محصول با این اسلاگ قبلا ساخته شده است." },
        { status: 400 }
      );
    }

    const uploadedImagesDetails: Array<{ imageUrl: string; s3key: string }> =
      [];
    const uploadedKeys: string[] = [];

    try {
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
      if (uploadedKeys.length > 0) {
        console.log(
          "Attempting to delete uploaded images from Cloudinary due to error:",
          uploadedKeys
        );

        for (const key of uploadedKeys) {
          const command = new DeleteObjectCommand({
            Bucket: process.env.LIARA_BUCKET_NAME,
            Key: key,
          });

          await s3.send(command);
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
