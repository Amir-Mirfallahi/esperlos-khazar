import { Product } from "@prisma/client";
import prisma from "../lib/prisma";
import { DeleteObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { s3 } from "@/lib/s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

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

  for (const product of products) {
    for (const image of product.images) {
      const command = new GetObjectCommand({
        Bucket: process.env.LIARA_BUCKET_NAME,
        Key: image.s3key,
      });
      const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
      image.imageUrl = url;
    }
  }

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
    include: {
      images: true,
    },
  });
  if (product) {
    for (const image of product.images) {
      const command = new GetObjectCommand({
        Bucket: process.env.LIARA_BUCKET_NAME,
        Key: image.s3key,
      });
      const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
      image.imageUrl = url;
    }
  }

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
  if (product) {
    for (const image of product.images) {
      const command = new GetObjectCommand({
        Bucket: process.env.LIARA_BUCKET_NAME,
        Key: image.s3key,
      });
      const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
      image.imageUrl = url;
    }
  }

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
  for (const product of products) {
    for (const image of product.images) {
      const command = new GetObjectCommand({
        Bucket: process.env.LIARA_BUCKET_NAME,
        Key: image.s3key,
      });
      const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
      image.imageUrl = url;
    }
  }

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

  for (const product of products) {
    for (const image of product.images) {
      const command = new GetObjectCommand({
        Bucket: process.env.LIARA_BUCKET_NAME,
        Key: image.s3key,
      });
      const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
      image.imageUrl = url;
    }
  }

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

export const createProduct = async (
  productData: Omit<Product, "id" | "createdAt" | "updatedAt">,
  imagesData?: Array<{ imageUrl: string; s3key: string }>
) => {
  const newProduct = await prisma.product.create({
    data: {
      ...productData,
      images:
        imagesData && imagesData.length > 0
          ? {
              create: imagesData.map((img) => ({
                imageUrl: img.imageUrl,
                s3key: img.s3key,
              })),
            }
          : undefined,
    },
    include: {
      images: true,
    },
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
  const uploadedKeys: string[] = [];
  const productImages = await prisma.productImage.findMany({
    where: {
      productId: parseInt(id),
    },
  });
  for (const key of uploadedKeys) {
    const command = new DeleteObjectCommand({
      Bucket: process.env.LIARA_BUCKET_NAME,
      Key: key,
    });

    await s3.send(command);
  }
  const deletedProduct = await prisma.product.delete({
    where: { id: parseInt(id) },
  });
  return deletedProduct;
};
