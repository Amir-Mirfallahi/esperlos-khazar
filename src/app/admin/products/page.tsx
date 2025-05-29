"use client";

import { useState, useEffect } from "react";
import { AuthCheck } from "@/components/auth/AuthCheck";
import { PulseLoader } from "react-spinners";
import Link from "next/link";
import axios from "axios";
import { toast } from "react-hot-toast";

interface Product {
  id: number;
  name: string;
  slug: string;
  price: number;
  categoryId: number;
  category?: {
    id: number;
    name: string;
  };
  isFeatured: boolean;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get("/api/protected/products");
        setProducts(response.data.products);
      } catch (error) {
        console.error("Error fetching products:", error);
        toast.error("خطا در دریافت محصولات");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleDeleteProduct = async (id: number) => {
    if (window.confirm("آیا از حذف این محصول اطمینان دارید؟")) {
      try {
        await axios.delete(`/api/protected/products/${id}`);
        toast.success("محصول با موفقیت حذف شد");
        // Remove the product from the list
        setProducts(products.filter((product) => product.id !== id));
      } catch (error: any) {
        console.error("Error deleting product:", error);
        const errorMessage = error.response?.data?.error || "خطا در حذف محصول";
        toast.error(errorMessage);
      }
    }
  };

  return (
    <AuthCheck allowedRoles={["SUPERADMIN", "PRODUCTMANAGER"]}>
      <div>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">مدیریت محصولات</h1>
          <Link href="/admin/products/new">
            <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
              افزودن محصول جدید
            </button>
          </Link>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-10">
            <PulseLoader color="#36d7b7" size={20} loading={isLoading} />
          </div>
        ) : products.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <p className="text-gray-500">محصولی یافت نشد.</p>
            <p className="mt-2">
              برای افزودن محصول جدید، روی دکمه "افزودن محصول جدید" کلیک کنید.
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      نام محصول
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      اسلاگ
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      قیمت (تومان)
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      دسته بندی
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      ویژه
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      عملیات
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {products.map((product) => (
                    <tr key={product.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {product.name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500 font-mono">
                          {product.slug}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {product.price.toLocaleString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {product.category?.name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            product.isFeatured
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {product.isFeatured ? "بله" : "خیر"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <Link href={`/admin/products/${product.id}`}>
                          <span className="text-blue-600 hover:text-blue-900 ml-3 cursor-pointer">
                            ویرایش
                          </span>
                        </Link>
                        <button
                          onClick={() => handleDeleteProduct(product.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          حذف
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </AuthCheck>
  );
}
