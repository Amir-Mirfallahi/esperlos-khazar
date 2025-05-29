import { NextResponse, NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { updateUser, deleteUser, getUserById } from "@/utils/users";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: number }> }
) {
  const resolvedParams = await params;
  const id = resolvedParams.id;

  const user = await getUserById(id);
  if (!user) {
    return NextResponse.json({ message: "کاربر یافت نشد" }, { status: 404 });
  }
  return NextResponse.json({ user }, { status: 200 });
}

export async function PUT(
  request: NextRequest,
  { params: paramsPromise }: { params: Promise<{ id: number }> } // Renamed for clarity, paramsPromise is the Promise
) {
  // Await the paramsPromise to get the actual object containing the id
  const resolvedParams = await paramsPromise;
  const id = resolvedParams.id; // Now 'id' is of type number

  // You can now use the 'id' (which is a number)
  const { firstName, lastName, email, password, role } = await request.json();
  const user = await updateUser(id, {
    // Use the resolved 'id'
    firstName,
    lastName,
    email,
    password,
    role,
  });

  return NextResponse.json(
    {
      user,
    },
    { status: 200 }
  );
}

export async function DELETE(
  request: NextRequest,
  { params: paramsPromise }: { params: Promise<{ id: number }> }
) {
  const resolvedParams = await paramsPromise;
  const id = resolvedParams.id;

  const user = await deleteUser(id);
  return NextResponse.json(
    {
      user,
    },
    { status: 200 }
  );
}

export async function PATCH(
  request: NextRequest,
  { params: paramsPromise }: { params: Promise<{ id: number }> }
) {
  const resolvedParams = await paramsPromise;
  const id = resolvedParams.id;

  // Get only the fields that need to be updated
  const updatedFields = await request.json();

  // Update only the provided fields
  const user = await updateUser(id, updatedFields);

  return NextResponse.json(
    {
      user,
      message: "User updated successfully",
    },
    { status: 200 }
  );
}
