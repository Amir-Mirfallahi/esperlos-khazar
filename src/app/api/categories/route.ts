import { NextResponse } from "next/server";
import { getCategories } from "@/utils/categories";

// GET /api/protected/categories - Get all categories
export async function GET() {
  try {
    const categories = await getCategories();

    return NextResponse.json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
