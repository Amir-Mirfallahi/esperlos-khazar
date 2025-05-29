"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { toast } from "react-hot-toast";
import { PulseLoader } from "react-spinners";
import axios from "axios";
import { ArrowRight, Mail, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

// Extended product interface that matches the API response
interface ProductWithRelations {
  id: number;
  slug: string;
  name: string;
  description: string;
  price: number;
  categoryId: number;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
  images: {
    id: number;
    imageUrl: string;
  }[];
  category: {
    id: number;
    name: string;
    createdAt: string;
    updatedAt: string;
  };
}

const ProductPage = () => {
  const params = useParams();
  const [product, setProduct] = useState<ProductWithRelations | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`/api/products/${params.slug}`);
        setProduct(response.data);
      } catch (error) {
        console.error("Error fetching product:", error);
        toast.error("محصولی یافت نشد");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [params.slug]);

  return (
    <div className="section-container">
      {loading ? (
        <div className="flex justify-center items-center py-10">
          <PulseLoader color="#36d7b7" size={20} loading={loading} />
        </div>
      ) : (
        <>
          <Link
            href="/products"
            className="inline-flex items-center text-primary mb-8 hover:underline"
          >
            <ArrowRight className="ml-2" size={20} />
            بازگشت به محصولات
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Product Image */}
            <div className="bg-gray-100 rounded-xl overflow-hidden">
              {product?.images && product.images.length > 0 ? (
                <img
                  src={product.images[0].imageUrl}
                  alt={product.name}
                  className="w-full h-full object-cover aspect-square"
                />
              ) : (
                <div className="w-full h-full aspect-square bg-gray-200 flex items-center justify-center">
                  <svg
                    className="w-16 h-16 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div className="space-y-4">
                <h1 className="text-3xl font-bold">{product?.name}</h1>
                {product?.category && (
                  <span className="inline-block bg-primary/10 text-primary px-4 py-1 rounded-full text-sm">
                    {product.category.name}
                  </span>
                )}
              </div>

              <p className="text-gray-600 leading-relaxed">
                {product?.description}
              </p>

              <div className="space-y-4 pt-6">
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <p className="text-sm text-gray-500">قیمت محصول</p>
                  <p className="text-2xl font-bold text-primary">
                    {product?.price?.toLocaleString()} تومان
                  </p>
                </div>
                <Button
                  href={`/contact?product=${product?.id}`}
                  variant="primary"
                  size="lg"
                  className="w-full sm:w-auto"
                >
                  <Phone size={20} />
                  درخواست مشاوره
                </Button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ProductPage;
