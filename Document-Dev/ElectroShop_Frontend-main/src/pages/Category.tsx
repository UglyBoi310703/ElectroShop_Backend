import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { products } from "@/data/products";
import { cn } from "@/lib/utils";
import { Smartphone, Laptop, Headphones, Camera as CameraIcon, Watch, Cable, Filter } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useWishlist } from "@/contexts/WishlistContext";

interface CategoryConfig {
  name: string;
  brands: string[];
  tags: string[];
  productCategory: string;
  icon: LucideIcon;
}

const categoryConfigs: CategoryConfig[] = [
  {
    name: "Điện thoại",
    brands: ["Apple", "Samsung", "Xiaomi", "OPPO", "Vivo"],
    tags: ["Gaming", "Pin trâu", "Camera đẹp", "Sạc nhanh", "5G"],
    productCategory: "Phones",
    icon: Smartphone
  },
  {
    name: "Laptop",
    brands: ["Acer", "Asus", "HP", "MSI", "Dell", "Lenovo"],
    tags: ["Gaming", "Văn phòng", "Đồ hoạ", "Mỏng nhẹ", "Pin trâu"],
    productCategory: "Laptop",
    icon: Laptop
  },
  {
    name: "Phụ kiện",
    brands: ["Anker", "Belkin", "Ugreen", "Baseus"],
    tags: ["Sạc dự phòng", "Cáp sạc", "Tai nghe", "Ốp lưng"],
    productCategory: "Accessories",
    icon: Cable
  },
  {
    name: "Âm thanh",
    brands: ["Sony", "JBL", "Bose", "Samsung"],
    tags: ["Chống ồn", "Bluetooth", "Hi-Res", "True Wireless"],
    productCategory: "Audio",
    icon: Headphones
  },
  {
    name: "Camera",
    brands: ["Canon", "Nikon", "Sony", "Fujifilm", "GoPro"],
    tags: ["DSLR", "Mirrorless", "Action Cam", "4K", "Chống rung"],
    productCategory: "Camera",
    icon: CameraIcon
  },
  {
    name: "Smartwatch",
    brands: ["Apple", "Samsung", "Xiaomi", "Garmin", "Huawei"],
    tags: ["Theo dõi sức khoẻ", "GPS", "Chống nước", "Pin lâu", "Thể thao"],
    productCategory: "Smartwatch",
    icon: Watch
  }
];

const Category = () => {
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [searchParams] = useSearchParams();
  
  // Get category and brand from URL params
  const categoryParam = searchParams.get("cat");
  const brandParam = searchParams.get("brand");
  
  // Find the selected category based on URL param or default to first category
  const initialCategory = categoryConfigs.find(
    (config) => config.productCategory === categoryParam
  ) || categoryConfigs[0];
  
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [priceRange, setPriceRange] = useState([0, 50000000]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>(
    brandParam ? [brandParam] : []
  );
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Update selected category when URL params change
  useEffect(() => {
    if (categoryParam) {
      const newCategory = categoryConfigs.find(
        (config) => config.productCategory === categoryParam
      );
      if (newCategory) {
        setSelectedCategory(newCategory);
      }
    }
    
    // Set brand filter from URL
    if (brandParam) {
      setSelectedBrands([brandParam]);
    }
  }, [categoryParam, brandParam]);

  const toggleBrand = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleCategoryChange = (category: CategoryConfig) => {
    setSelectedCategory(category);
    setSelectedBrands([]);
    setSelectedTags([]);
  };

  const filteredProducts = products.filter((product) => {
    // Filter by category
    if (product.category !== selectedCategory.productCategory) return false;
    
    // Filter by selected brands
    if (selectedBrands.length > 0 && !selectedBrands.includes(product.brand)) return false;
    
    // Filter by price range
    if (product.price < priceRange[0] || product.price > priceRange[1]) return false;
    
    // Filter by tags (if product has tags property)
    // if (selectedTags.length > 0 && !selectedTags.some(tag => product.tags?.includes(tag))) return false;
    
    return true;
  });

  // Sidebar content component to reuse in both desktop and mobile
  const SidebarContent = () => (
    <div className="space-y-8">
      {/* Categories Navigation */}
      <div>
        <h3 className="font-semibold text-lg mb-4">Danh mục</h3>
        <div className="space-y-2">
          {categoryConfigs.map((category) => {
            const Icon = category.icon;
            return (
              <button
                key={category.name}
                onClick={() => {
                  handleCategoryChange(category);
                  setIsFilterOpen(false);
                }}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors",
                  selectedCategory.name === category.name
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted"
                )}
              >
                <Icon className="h-5 w-5" />
                <span>{category.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Price Range */}
      <div className="border-t pt-8">
        <h3 className="font-semibold text-lg mb-4">Khoảng giá</h3>
        <div className="space-y-4">
          <Slider
            min={0}
            max={50000000}
            step={1000000}
            value={priceRange}
            onValueChange={setPriceRange}
            className="my-6"
          />
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">{(priceRange[0] / 1000000).toFixed(0)}tr</span>
            <span className="text-muted-foreground">-</span>
            <span className="font-medium">{(priceRange[1] / 1000000).toFixed(0)}tr</span>
          </div>
        </div>
      </div>

      {/* Brands */}
      <div className="border-t pt-8">
        <h3 className="font-semibold text-lg mb-4">Hãng</h3>
        <div className="space-y-3">
          {selectedCategory.brands.map((brand) => (
            <div key={brand} className="flex items-center space-x-2">
              <Checkbox
                id={brand}
                checked={selectedBrands.includes(brand)}
                onCheckedChange={() => toggleBrand(brand)}
              />
              <Label
                htmlFor={brand}
                className="text-sm cursor-pointer hover:text-primary"
              >
                {brand}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Nhu cầu sử dụng (Tags) */}
      <div className="border-t pt-8">
        <h3 className="font-semibold text-lg mb-4">Nhu cầu sử dụng</h3>
        <div className="space-y-3">
          {selectedCategory.tags.map((tag) => (
            <div key={tag} className="flex items-center space-x-2">
              <Checkbox
                id={tag}
                checked={selectedTags.includes(tag)}
                onCheckedChange={() => toggleTag(tag)}
              />
              <Label
                htmlFor={tag}
                className="text-sm cursor-pointer hover:text-primary"
              >
                {tag}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Stock Status */}
      <div className="border-t pt-8">
        <h3 className="font-semibold text-lg mb-4">Tình trạng hàng</h3>
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Checkbox id="in-stock" defaultChecked />
            <Label htmlFor="in-stock" className="text-sm cursor-pointer">
              Còn hàng
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="out-stock" />
            <Label htmlFor="out-stock" className="text-sm cursor-pointer">
              Hết hàng
            </Label>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="text-sm text-muted-foreground mb-8">
          Trang chủ / <span className="text-foreground">{selectedCategory.name}</span>
        </div>

        {/* Mobile Filter Button */}
        <div className="lg:hidden mb-6">
          <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" className="w-full">
                <Filter className="mr-2 h-4 w-4" />
                Bộ lọc & Danh mục
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] overflow-y-auto">
              <SheetHeader>
                <SheetTitle>Bộ lọc sản phẩm</SheetTitle>
              </SheetHeader>
              <div className="mt-6">
                <SidebarContent />
              </div>
            </SheetContent>
          </Sheet>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block">
            <SidebarContent />
          </aside>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            <div className="flex items-center justify-between mb-6">
              <p className="text-muted-foreground">
                Hiển thị {filteredProducts.length} sản phẩm
              </p>
              <select className="border rounded-lg px-4 py-2 text-sm bg-background">
                <option>Mặc định</option>
                <option>Giá thấp đến cao</option>
                <option>Giá cao đến thấp</option>
                <option>Mới nhất</option>
              </select>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
              {filteredProducts.map((product) => (
                <ProductCard 
                  key={product.id} 
                  {...product} 
                  showAddToCart 
                  isInWishlist={isInWishlist(product.id)}
                  onAddToWishlist={() => toggleWishlist(product.id, product.name)}
                />
              ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center items-center gap-2 mt-12">
              <button className="px-4 py-2 border rounded hover:bg-muted">
                Trang trước
              </button>
              <button className="px-4 py-2 bg-primary text-primary-foreground rounded">
                1
              </button>
              <button className="px-4 py-2 border rounded hover:bg-muted">
                2
              </button>
              <button className="px-4 py-2 border rounded hover:bg-muted">
                3
              </button>
              <button className="px-4 py-2 border rounded hover:bg-muted">
                Trang sau
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Category;
