"use client";

import React, { useState, useEffect } from "react";
import DetailsCard, { FieldConfig } from "../shared/DetailsCard";
import axios from "axios";
import { toast } from "react-hot-toast";

// Interface matching Prisma Product schema
interface Product {
  id: number;
  slug: string;
  name: string;
  description: string;
  price: number;
  categoryId: number;
  category?: {
    id: number;
    name: string;
  };
  images?: ProductImage[];
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ProductImage {
  id: number;
  imageUrl: string;
}

interface Category {
  id: number;
  name: string;
}

interface ProductDetailsCardProps {
  product: Product;
  isLoading: boolean;
}

export default function ProductDetailsCard({
  product,
  isLoading,
}: ProductDetailsCardProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("/api/protected/categories");
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
        toast.error("خطا در دریافت دسته‌بندی‌ها");
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  const getFeaturedDisplayComponent = () => {
    const isFeaturedClass = product.isFeatured
      ? "bg-green-100 text-green-800"
      : "bg-gray-100 text-gray-800";

    return (
      <span
        className={`px-3 py-1 inline-flex text-sm font-semibold rounded-full cursor-pointer ${isFeaturedClass}`}
      >
        {product.isFeatured ? "بله" : "خیر"}
      </span>
    );
  };

  const categoryOptions = categories.map((cat) => ({
    value: String(cat.id),
    label: cat.name,
  }));

  const fields: FieldConfig[] = [
    {
      name: "name",
      label: "نام محصول",
      colSpan: 2,
    },
    {
      name: "slug",
      label: "اسلاگ",
    },
    {
      name: "price",
      label: "قیمت (تومان)",
      type: "number",
    },
    {
      name: "categoryId",
      label: "دسته‌بندی",
      type: "select",
      options: categoryOptions,
      displayComponent: product.category ? (
        <p className="text-lg p-2 hover:bg-gray-50 rounded transition-colors duration-200">
          {product.category.name}
        </p>
      ) : null,
    },
    {
      name: "isFeatured",
      label: "محصول ویژه",
      type: "select",
      options: [
        { value: "true", label: "بله" },
        { value: "false", label: "خیر" },
      ],
      displayComponent: getFeaturedDisplayComponent(),
    },
    {
      name: "description",
      label: "توضیحات",
      colSpan: 2,
    },
    {
      name: "createdAt",
      label: "تاریخ افزودن",
      type: "date",
      editable: false,
    },
    {
      name: "updatedAt",
      label: "آخرین بروزرسانی",
      type: "date",
      editable: false,
    },
  ];

  return (
    <DetailsCard
      data={product}
      id={product.id}
      title="اطلاعات محصول"
      apiEndpoint="/api/protected/products"
      isLoading={isLoading || loadingCategories}
      fields={fields}
      redirectAfterDelete="/admin/products"
    />
  );
}
