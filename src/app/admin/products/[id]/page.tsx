"use client";

import { useState, useEffect } from "react";
import { AuthCheck } from "@/components/auth/AuthCheck";
import ProductDetailsCard from "@/components/admin/products/ProductDetailsCard";
import axios from "axios";
import { toast } from "react-hot-toast";
import { PulseLoader } from "react-spinners";
import Link from "next/link";
import { useParams } from "next/navigation";

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
  images?: {
    id: number;
    imageUrl: string;
  }[];
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function ProductDetailPage() {
  const { id } = useParams();

  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProduct = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.get(`/api/protected/products/${id}`);
      setProduct(response.data);
    } catch (error: any) {
      console.error("Error fetching product:", error);
      const errorMessage =
        error.response?.data?.error || "خطا در دریافت اطلاعات محصول";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  return (
    <AuthCheck allowedRoles={["SUPERADMIN", "PRODUCTMANAGER"]}>
      <div>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">جزئیات محصول</h1>
          <Link href="/admin/products">
            <button className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300">
              بازگشت به لیست محصولات
            </button>
          </Link>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-10">
            <PulseLoader color="#36d7b7" size={20} loading={isLoading} />
          </div>
        ) : error ? (
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <h2 className="text-xl font-semibold text-red-600">خطا</h2>
            <p className="mt-2">{error}</p>
          </div>
        ) : product ? (
          <ProductDetailsCard product={product} isLoading={false} />
        ) : (
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <h2 className="text-xl font-semibold text-red-600">
              محصول یافت نشد
            </h2>
            <p className="mt-2">محصول مورد نظر در سیستم موجود نمی‌باشد.</p>
          </div>
        )}
      </div>
    </AuthCheck>
  );
}
