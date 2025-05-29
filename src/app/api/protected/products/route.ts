import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getProducts, createProduct } from "@/utils/product";
import prisma from "@/lib/prisma";

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
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    // Check if user is authenticated and has appropriate role
    if (
      !session?.user ||
      !["SUPERADMIN", "PRODUCTMANAGER"].includes(session.user.role)
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, slug, price, description, categoryId, isFeatured, images } =
      await request.json();

    // Validate required fields
    if (!name || !slug || !price || !categoryId) {
      return NextResponse.json(
        { error: "Name, slug, price, and category are required" },
        { status: 400 }
      );
    }

    // Check if slug is unique
    const existingProduct = await prisma.product.findUnique({
      where: { slug },
    });

    if (existingProduct) {
      return NextResponse.json(
        { error: "A product with this slug already exists" },
        { status: 400 }
      );
    }

    // Create the product
    const product = await createProduct({
      name,
      slug,
      price: parseInt(price),
      description: description || "",
      categoryId: parseInt(categoryId),
      isFeatured: Boolean(isFeatured),
    } as any);

    // Add product images if provided
    if (images && Array.isArray(images) && images.length > 0) {
      await prisma.productImage.createMany({
        data: images.map((imageUrl: string) => ({
          productId: product.id,
          imageUrl,
        })),
      });
    }

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
