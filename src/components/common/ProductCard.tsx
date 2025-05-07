import { cn } from "@/lib/utils";
import { Button } from "../ui/button";

interface ProductCardProps {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  category?: string;
  isFeatured?: boolean;
  className?: string;
}

const ProductCard = ({
  id,
  title,
  description,
  imageUrl,
  category,
  isFeatured = false,
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
        <img src={imageUrl} alt={title} className="w-full h-48 object-cover" />
        {category && (
          <span className="absolute top-3 right-3 bg-primary/90 text-white px-3 py-1 rounded-full text-sm">
            {category}
          </span>
        )}
        {isFeatured && (
          <span className="absolute top-3 left-3 bg-secondary/90 text-secondary-foreground px-3 py-1 rounded-full text-sm">
            محصول ویژه
          </span>
        )}
      </div>

      <div className="p-5">
        <h3 className="font-bold text-lg mb-2 line-clamp-1">{title}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{description}</p>

        <div className="flex justify-between items-center">
          <Button to={`/products/${id}`} variant="outline" size="sm">
            مشاهده جزئیات
          </Button>

          <Button to={`/contact?product=${id}`} variant="ghost" size="sm">
            استعلام قیمت
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
