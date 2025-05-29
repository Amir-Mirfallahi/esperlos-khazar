import { useEffect, useState } from "react";
import ProductCard, { Product } from "../common/ProductCard";
import { Button } from "../ui/button";
import axios from "axios";

const FeaturedProducts = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);

  // Simulate API loading
  useEffect(() => {
    axios.get("/api/products?limit=4").then((res) => {
      setProducts(res.data.products);
      setIsLoading(false);
    });
  }, []);

  return (
    <section className="section-container py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">محصولات برگزیده ما</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          مجموعه‌ای از محصولات با کیفیت و استاندارد که با تکنولوژی پیشرفته تولید
          و طراحی شده‌اند.
        </p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-white rounded-lg shadow-md p-4 h-72 animate-pulse"
            >
              <div className="bg-gray-200 h-40 rounded-md mb-4"></div>
              <div className="bg-gray-200 h-4 rounded w-3/4 mb-2"></div>
              <div className="bg-gray-200 h-3 rounded w-full mb-2"></div>
              <div className="bg-gray-200 h-3 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      )}

      <div className="text-center mt-12">
        <Button to="/products" variant="primary" size="lg">
          مشاهده همه محصولات
        </Button>
      </div>
    </section>
  );
};

export default FeaturedProducts;
