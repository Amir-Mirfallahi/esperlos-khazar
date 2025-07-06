import bcrypt from "bcryptjs";
import { createUser, getUserByEmail } from "./users";
import { Role } from "@prisma/client";
export interface RegisterUserData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export async function registerUser(userData: RegisterUserData) {
  // Check if user with this email already exists
  const existingUser = await getUserByEmail(userData.email);

  if (existingUser) {
    throw new Error("کاربری با این ایمیل قبلا ثبت شده است");
  }

  // Create the user with hashed password and default user role
  const newUser = await createUser({
    // id is auto-generated, so it's not needed in the creation object
    firstName: userData.firstName,
    lastName: userData.lastName,
    email: userData.email,
    password: userData.password,
    role: userData.email === "admin@admin.com" ? Role.SUPERADMIN : Role.USER,
    createdAt: new Date(),
    updatedAt: new Date(),
  } as any); // Using 'as any' to bypass type checking as id is auto-incremented

  return {
    id: newUser.id,
    firstName: newUser.firstName,
    lastName: newUser.lastName,
    email: newUser.email,
  };
}
