import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getProducts } from "@/utils/product";

// GET /api/protected/products - Get all products
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page: number = parseInt(searchParams.get("page") || "1");
    const categoryId: number = parseInt(searchParams.get("category") || "-1");
    const limit: number = parseInt(searchParams.get("limit") || "10");
    const response = await getProducts(page, limit, categoryId);
    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
