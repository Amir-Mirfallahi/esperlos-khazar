import { cn } from "@/lib/utils";
import { Button } from "../ui/button";

export interface Product {
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
  images?:
    | {
        id: number;
        imageUrl: string;
      }[]
    | [];
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ProductCardProps extends Product {
  className?: string;
}

const ProductCard = ({
  id,
  name,
  description,
  images,
  slug,
  price,
  category,
  isFeatured = false,
  createdAt,
  updatedAt,
  className,
}: ProductCardProps) => {
  return (
    <div
      className={cn(
        "bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300",
        isFeatured && "border-2 border-secondary",
        className
      )}
    >
      <div className="relative">
        {images && images.length > 0 && (
          <img
            src={images[0].imageUrl}
            alt={name}
            className="w-full h-48 object-cover"
          />
        )}
        {images && images.length === 0 && (
          <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
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
        {category && (
          <span className="absolute top-3 right-3 bg-primary/90 text-white px-3 py-1 rounded-full text-sm">
            {category.name}
          </span>
        )}
        {isFeatured && (
          <span className="absolute top-3 left-3 bg-secondary/90 text-secondary-foreground px-3 py-1 rounded-full text-sm">
            محصول ویژه
          </span>
        )}
      </div>

      <div className="p-5">
        <h3 className="font-bold text-lg mb-2 line-clamp-1">{name}</h3>
        <div className="bg-primary/10 rounded-lg p-2 mb-3 text-center">
          <span className="text-primary font-bold text-lg">
            {price.toLocaleString()}
          </span>
          <span className="text-primary text-sm mr-1">تومان</span>
        </div>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {description.slice(0, 100)}...
        </p>

        <div className="flex justify-between items-center">
          <Button to={`/products/${slug}`} variant="outline" size="sm">
            مشاهده جزئیات
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
