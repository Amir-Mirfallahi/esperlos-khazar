import bcrypt from "bcryptjs";
import { Role } from "@prisma/client";
import prisma from "../lib/prisma";

export type PaginatedUsers = {
  users: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    role: Role;
  }[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};

export const getUsers = async (
  page: number = 1,
  limit: number = 10
): Promise<PaginatedUsers> => {
  const skip = (page - 1) * limit;
  const [users, total] = await Promise.all([
    prisma.user.findMany({
      skip,
      take: limit,
      orderBy: {
        id: "asc",
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
      },
    }),
    prisma.user.count(),
  ]);

  return {
    users,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export type NewUser = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
};
export const getUserCount = async () => {
  const userCount = await prisma.user.count();
  return userCount;
};

export const getUserById = async (id: string | number) => {
  const user = await prisma.user.findUnique({
    where: { id: typeof id === "string" ? parseInt(id) : id },
  });
  return user;
};

export const updateUser = async (id: string | number, user: NewUser) => {
  const updatedUser = await prisma.user.update({
    where: { id: typeof id === "string" ? parseInt(id) : id },
    data: {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role as Role,
    },
  });
  return updatedUser;
};

export const deleteUser = async (id: string | number) => {
  const deletedUser = await prisma.user.delete({
    where: { id: typeof id === "string" ? parseInt(id) : id },
  });
  return deletedUser;
};

export const getUserByEmail = async (email: string) => {
  const user = await prisma.user.findUnique({
    where: { email: email },
  });
  return user;
};

export const changeUserPassword = async (
  id: string | number,
  newPassword: string
) => {
  const hashedPassword = bcrypt.hash(newPassword, 12);

  const updatedUser = await prisma.user.update({
    where: { id: typeof id === "string" ? parseInt(id) : id },
    data: {
      password: await hashedPassword,
    },
  });
  return updatedUser;
};

export const createUser = async (user: NewUser) => {
  const hashedPassword = await bcrypt.hash(user.password, 12);

  const newUser = await prisma.user.create({
    data: {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      password: hashedPassword,
      role: user.role as Role,
    },
  });
  return newUser;
};
