import { Link } from "react-router-dom";
import ProductCard from "@/components/ProductCard";
import { Product } from "@/data/products";
import { Laptop, Gamepad2, Feather, Palette, GraduationCap, Hand, ChevronRight } from "lucide-react";

interface CategorySectionProps {
  title: string;
  brands: string[];
  products: Product[];
  categoryName: string;
  mainCategories?: { name: string; path: string }[];
  subCategories?: { name: string; icon: string }[];
  banners?: {
    image: string;
    alt: string;
  }[];
  isInWishlist?: (productId: number) => boolean;
  onToggleWishlist?: (productId: number, productName: string) => void;
}

const iconMap: Record<string, any> = {
  laptop: Laptop,
  gaming: Gamepad2,
  thin: Feather,
  design: Palette,
  student: GraduationCap,
  touch: Hand,
};

const CategorySection = ({ 
  title, 
  brands, 
  products, 
  categoryName,
  mainCategories,
  subCategories,
  banners,
  isInWishlist,
  onToggleWishlist 
}: CategorySectionProps) => {
  return (
    <section className="container mx-auto px-4 py-8 md:py-12 border-t">
      {/* Main Category Tabs */}
      {mainCategories && mainCategories.length > 0 && (
        <div className="mb-4">
          <nav className="flex items-center gap-0 overflow-x-auto border-b border-border">
            {mainCategories.map((cat, index) => (
              <Link
                key={cat.name}
                to={cat.path}
                className={`px-6 py-3 text-sm md:text-base font-semibold whitespace-nowrap transition-colors border-b-2 ${
                  cat.name === title 
                    ? 'border-primary text-primary' 
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                {cat.name}
              </Link>
            ))}
          </nav>
        </div>
      )}

      {/* Sub Categories with Icons */}
      {subCategories && subCategories.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {subCategories.map((subCat) => {
              const Icon = iconMap[subCat.icon] || Laptop;
              return (
                <Link
                  key={subCat.name}
                  to={`/category?cat=${categoryName}`}
                  className="flex items-center gap-2 px-4 py-3 rounded-lg bg-muted hover:bg-muted/80 transition-colors whitespace-nowrap"
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-sm font-medium">{subCat.name}</span>
                </Link>
              );
            })}
            <button className="flex items-center gap-1 px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Brand Pills */}
      <div className="mb-6">
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {brands.map((brand) => (
            <Link
              key={brand}
              to={`/category?cat=${categoryName}&brand=${encodeURIComponent(brand)}`}
              className="px-5 py-2 rounded-full border border-border bg-background hover:border-primary hover:text-primary transition-colors whitespace-nowrap text-sm font-medium"
            >
              {brand}
            </Link>
          ))}
          <Link
            to={`/category?cat=${categoryName}`}
            className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-primary hover:underline whitespace-nowrap"
          >
            Xem tất cả
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6 mb-8">
        {products.slice(0, 10).map((product) => (
          <ProductCard 
            key={product.id} 
            {...product} 
            showAddToCart 
            isInWishlist={isInWishlist ? isInWishlist(product.id) : false}
            onAddToWishlist={onToggleWishlist ? () => onToggleWishlist(product.id, product.name) : undefined}
          />
        ))}
      </div>

      {/* Banners */}
      {banners && banners.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mt-6 md:mt-8">
          {banners.map((banner, index) => (
            <div key={index} className="rounded-lg overflow-hidden">
              <img
                src={banner.image}
                alt={banner.alt}
                className="w-full h-auto object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default CategorySection;
