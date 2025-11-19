import { Heart, Eye, ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  image: string;
  discount?: number;
  isNew?: boolean;
  onAddToCart?: () => void;
  onAddToWishlist?: () => void;
  showAddToCart?: boolean;
  isInWishlist?: boolean;
}

const ProductCard = ({
  id,
  name,
  price,
  originalPrice,
  rating,
  reviews,
  image,
  discount,
  isNew,
  onAddToCart,
  onAddToWishlist,
  showAddToCart = false,
  isInWishlist = false,
}: ProductCardProps) => {
  const navigate = useNavigate();

  return (
    <div className="group relative bg-secondary rounded overflow-hidden cursor-pointer" onClick={() => navigate(`/product/${id}`)}>
      {/* Image Container */}
      <div className="relative aspect-square bg-secondary p-8 flex items-center justify-center">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
        />

        {/* Discount Badge */}
        {discount && (
          <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground">
            -{discount}%
          </Badge>
        )}

        {/* New Badge */}
        {isNew && (
          <Badge className="absolute top-3 left-3 bg-success text-white">
            NEW
          </Badge>
        )}

        {/* Action Buttons */}
        <div className="absolute top-3 right-3 flex flex-col gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onAddToWishlist?.();
                  }}
                  className={cn(
                    "w-8 h-8 bg-white rounded-full flex items-center justify-center transition-colors",
                    isInWishlist 
                      ? "hover:bg-gray-100" 
                      : "hover:bg-primary hover:text-white"
                  )}
                >
                  <Heart 
                    className={cn(
                      "w-4 h-4",
                      isInWishlist && "fill-red-500 text-red-500"
                    )} 
                  />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{isInWishlist ? "Bỏ thích" : "Yêu thích"}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/product/${id}`);
            }}
            className="w-8 h-8 bg-white rounded-full flex items-center justify-center hover:bg-primary hover:text-white transition-colors"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>

        {/* Add to Cart Button - Shows on hover */}
        {showAddToCart && (
          <Button
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart?.();
            }}
            className="absolute bottom-0 left-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity rounded-none"
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            Thêm vào giỏ
          </Button>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4 bg-white">
        <h3 className="font-medium mb-2 line-clamp-2">{name}</h3>
        <div className="flex items-center gap-3 mb-2">
          <span className="text-primary font-semibold">
            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)}
          </span>
          {originalPrice && (
            <span className="text-muted-foreground line-through text-sm">
              {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(originalPrice)}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                className={cn(
                  "w-4 h-4",
                  i < Math.floor(rating)
                    ? "text-warning fill-warning"
                    : "text-gray-300"
                )}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <span className="text-sm text-muted-foreground">({reviews})</span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
