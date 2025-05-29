"use client";
import { ArrowLeft, FileSearch } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "next/navigation";
import ProductCard from "@/components/common/ProductCard";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { PulseLoader } from "react-spinners";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

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
interface PaginatedProducts {
  products: Product[];
  meta: {
    total: number;
    page: number;
    lastPage: number;
  };
}

const Products = () => {
  const searchParams = useSearchParams();
  const queryCategory = searchParams.get("category");
  const [prodcuts, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchProducts = async (page: number = 1) => {
    setLoading(true);
    axios
      .get<PaginatedProducts>(`/api/products`, {
        params: {
          page: page,
          category: queryCategory,
        },
      })
      .then((res) => {
        setProducts(res.data.products);
        setCurrentPage(res.data.meta.page);
        setTotalPages(res.data.meta.lastPage);
        setLoading(false);
      })
      .catch((err) => {
        toast.error("محصولی یافت نشد");
        setLoading(false);
        console.log(err);
      });
  };

  useEffect(() => {
    fetchProducts(currentPage);
  }, [currentPage, queryCategory]);
  return (
    <div className="section-container">
      <div
        className="flex items-center justify-between mb-8"
        data-aos="fade-up"
      >
        <h1 className="text-3xl font-bold">محصولات ما</h1>
        <div className="relative">
          <input
            type="search"
            placeholder="جستجو در محصولات..."
            className="w-64 pl-10 pr-4 py-2 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
          <FileSearch
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={20}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {loading ? (
          <div className="flex justify-center items-center py-10">
            <PulseLoader color="#36d7b7" size={20} loading={loading} />
          </div>
        ) : (
          prodcuts.map((product, index) => (
            <div
              key={product.id}
              data-aos="fade-up"
              data-aos-delay={index * 200}
            >
              <ProductCard {...product} />
            </div>
          ))
        )}
      </div>

      {/* Empty state */}
      {prodcuts.length === 0 && !loading && (
        <div className="text-center py-16" data-aos="fade-up">
          <p className="text-gray-500 mb-4">محصولی یافت نشد</p>
          <Button variant="outline" size="lg">
            بازگشت به صفحه اصلی
            <ArrowLeft size={16} />
          </Button>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && !loading && (
        <Pagination className="mt-8">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (currentPage > 1) {
                    setCurrentPage(currentPage - 1);
                  }
                }}
                className={
                  currentPage === 1 ? "pointer-events-none opacity-50" : ""
                }
              />
            </PaginationItem>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <PaginationItem key={page}>
                <PaginationLink
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentPage(page);
                  }}
                  isActive={currentPage === page}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (currentPage < totalPages) {
                    setCurrentPage(currentPage + 1);
                  }
                }}
                className={
                  currentPage === totalPages
                    ? "pointer-events-none opacity-50"
                    : ""
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
};

export default Products;
