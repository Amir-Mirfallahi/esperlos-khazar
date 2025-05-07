"use client";
import { ArrowLeft, FileSearch } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/common/ProductCard";
import { mockProducts } from "@/lib/mock-data";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const Products = () => {
  return (
    <>
      <Header />
      <main className="min-h-screen py-16">
        <div className="section-container">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold">محصولات ما</h1>
            <div className="relative">
              <input
                type="search"
                placeholder="جستجو در محصولات..."
                className="w-64 pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
              <FileSearch
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={20}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {mockProducts.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>

          {/* Empty state */}
          {mockProducts.length === 0 && (
            <div className="text-center py-16">
              <p className="text-gray-500 mb-4">محصولی یافت نشد</p>
              <Button variant="outline" size="lg">
                بازگشت به صفحه اصلی
                <ArrowLeft size={16} />
              </Button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Products;
