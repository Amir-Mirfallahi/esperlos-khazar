import { NextRequest, NextResponse } from "next/server";
import { getUsers, updateUser } from "@/utils/users";

export async function GET(request: NextRequest) {
  const users = await getUsers();
  return NextResponse.json(users, { status: 200 });
}
