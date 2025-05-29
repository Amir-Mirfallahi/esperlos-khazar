import { Category } from "@prisma/client";
import prisma from "../lib/prisma";

export const getCategories = async () => {
  const categories = await prisma.category.findMany();
  return categories;
};

export const getCategoryCount = async () => {
  const categoryCount = await prisma.category.count();
  return categoryCount;
};

export const getCategoryById = async (id: string) => {
  const category = await prisma.category.findUnique({
    where: { id: parseInt(id) },
  });
  return category;
};

export const createCategory = async (category: Category) => {
  const newCategory = await prisma.category.create({
    data: category,
  });
  return newCategory;
};

export const updateCategory = async (id: string, category: Category) => {
  const updatedCategory = await prisma.category.update({
    where: { id: parseInt(id) },
    data: category,
  });
  return updatedCategory;
};

export const deleteCategory = async (id: string) => {
  const deletedCategory = await prisma.category.delete({
    where: { id: parseInt(id) },
  });
  return deletedCategory;
};
