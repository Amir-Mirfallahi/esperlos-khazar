import { useEffect, useState } from "react";
import ProductCard from "../common/ProductCard";
import { Button } from "../ui/button";

// Mock data - in a real app you'd fetch this from API
const mockProducts = [
  {
    id: "1",
    title: "ترانسفورماتور کم تلفات",
    description:
      "ترانسفورماتورهای قدرت با تکنولوژی کاهش تلفات حرارتی و راندمان بالا",
    imageUrl:
      "https://images.unsplash.com/photo-1620294226127-1a8923c9f652?q=80&w=500",
    category: "ترانسفورماتور",
    isFeatured: true,
  },
  {
    id: "2",
    title: "تابلو برق صنعتی",
    description: "تابلوهای توزیع برق صنعتی با قابلیت مانیتورینگ هوشمند",
    imageUrl:
      "https://images.unsplash.com/photo-1581094794329-c8112a89af12?q=80&w=500",
    category: "تابلو برق",
    isFeatured: true,
  },
  {
    id: "3",
    title: "رله حفاظتی دیجیتال",
    description: "رله‌های حفاظتی پیشرفته با قابلیت برنامه‌ریزی و اتصال به شبکه",
    imageUrl:
      "https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?q=80&w=500",
    category: "تجهیزات حفاظتی",
  },
  {
    id: "4",
    title: "سیستم ارتینگ صنعتی",
    description: "سیستم‌های ارتینگ پیشرفته با استانداردهای بین‌المللی",
    imageUrl:
      "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?q=80&w=500",
    category: "سیستم ارتینگ",
  },
];

const FeaturedProducts = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState<typeof mockProducts>([]);

  // Simulate API loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setProducts(mockProducts);
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
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
