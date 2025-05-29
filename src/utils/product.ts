import { Product } from "@prisma/client";
import prisma from "../lib/prisma";

export type paginatedProducts = {
  products: Product[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};

export const getProducts = async (
  page: number = 1,
  limit: number = 10,
  categoryId: number = -1
): Promise<paginatedProducts> => {
  const skip = (page - 1) * limit;
  const [products, total] = await Promise.all([
    categoryId !== -1
      ? prisma.product.findMany({
          skip,
          take: limit,
          orderBy: {
            id: "asc",
          },
          include: {
            images: true,
            category: true,
          },
          where: {
            categoryId: categoryId,
          },
        })
      : prisma.product.findMany({
          skip,
          take: limit,
          orderBy: {
            id: "asc",
          },
          include: {
            images: true,
            category: true,
          },
        }),
    prisma.product.count(),
  ]);

  return {
    products,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getProductCount = async () => {
  const productCount = await prisma.product.count();
  return productCount;
};

export const getProductById = async (id: string) => {
  const product = await prisma.product.findUnique({
    where: { id: parseInt(id) },
  });
  return product;
};

export const getProductBySlug = async (slug: string) => {
  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      images: true,
      category: true,
    },
  });
  return product;
};

export const getProductsByCategory = async (
  category: string,
  page: number = 1,
  limit: number = 10
): Promise<paginatedProducts> => {
  const skip = (page - 1) * limit;
  const [products, total] = await Promise.all([
    await prisma.product.findMany({
      where: { category: { name: category } },
      skip,
      take: limit,
      orderBy: {
        id: "asc",
      },
      include: {
        images: true,
      },
    }),
    prisma.product.count(),
  ]);

  return {
    products,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};
export const getFeaturedProducts = async (
  page: number = 1,
  limit: number = 10
): Promise<paginatedProducts> => {
  const skip = (page - 1) * limit;
  const [products, total] = await Promise.all([
    await prisma.product.findMany({
      where: { isFeatured: true },
      skip,
      take: limit,
      orderBy: {
        id: "asc",
      },
      include: {
        images: true,
      },
    }),
    prisma.product.count(),
  ]);

  return {
    products,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const createProduct = async (product: Product) => {
  const newProduct = await prisma.product.create({
    data: product,
  });
  return newProduct;
};

export const updateProduct = async (id: string, product: Product) => {
  const updatedProduct = await prisma.product.update({
    where: { id: parseInt(id) },
    data: product,
  });
  return updatedProduct;
};

export const deleteProduct = async (id: string) => {
  const deletedProduct = await prisma.product.delete({
    where: { id: parseInt(id) },
  });
  return deletedProduct;
};
