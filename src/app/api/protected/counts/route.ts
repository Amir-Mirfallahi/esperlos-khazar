import { NextRequest, NextResponse } from "next/server";
import { getUserCount } from "@/utils/users";
import { getProductCount } from "@/utils/product";
import { getCategoryCount } from "@/utils/categories";

export async function GET(request: NextRequest) {
    const userCount = await getUserCount();
    const productCount = await getProductCount();
    const categoryCount = await getCategoryCount();

    const counts = {
        userCount,
        productCount,
        categoryCount
    }

    return NextResponse.json({
        counts
    }, { status: 200 })
}