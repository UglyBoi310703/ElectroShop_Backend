import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight, ChevronLeft, Smartphone, Monitor, Watch, Camera, Headphones, Gamepad2, TabletIcon } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import CategorySection from "@/components/CategorySection";
import { Button } from "@/components/ui/button";
import { products, categories } from "@/data/products";
import { useWishlist } from "@/contexts/WishlistContext";

const Index = () => {
  const navigate = useNavigate();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [timeLeft, setTimeLeft] = useState({
    days: 3,
    hours: 23,
    minutes: 19,
    seconds: 56,
  });

  const heroSlides = [
    {
      title: "iPhone 14 Series",
      subtitle: "Giảm giá đến 10%",
      image: "https://images.unsplash.com/photo-1592286927505-ffd986e3e5e3?w=600",
    },
    {
      title: "Samsung Galaxy",
      subtitle: "Sale mùa hè giảm 20%",
      image: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=600",
    },
    {
      title: "MacBook Pro",
      subtitle: "Ưu đãi tốt nhất cho laptop",
      image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600",
    },
  ];

  const categoryIcons = {
    Phones: Smartphone,
    Tablets: TabletIcon,
    Computers: Monitor,
    SmartWatch: Watch,
    Camera: Camera,
    HeadPhones: Headphones,
    Gaming: Gamepad2,
  };

  const sidebarCategories = [
    { name: "Điện thoại", icon: Smartphone },
    { name: "Tablets,Ipad", icon: TabletIcon },
    { name: "Laptop", icon: Monitor },
    { name: "Âm thanh, Mic thu âm", icon: Headphones },
    { name: "Đồng hồ, Camera", icon: Camera },
    { name: "Phụ kiện", icon: Headphones },
    { name: "Smartwatch", icon: Watch },
  ];


  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else if (prev.days > 0) {
          return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const autoSlide = setInterval(() => {
      setCurrentSlide((prev) => (prev === heroSlides.length - 1 ? 0 : prev + 1));
    }, 5000);

    return () => clearInterval(autoSlide);
  }, [heroSlides.length]);

  const flashSalesProducts = products.filter((p) => p.discount).slice(0, 4);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <div className="container mx-auto px-4 py-4 md:py-8">
          <div className="flex flex-col lg:flex-row gap-4 lg:gap-8">
            {/* Sidebar Categories - Desktop Only */}
            <aside className="hidden lg:block w-72 border-r pr-6">
              <nav className="space-y-2">
                {sidebarCategories.map((category) => {
                  const Icon = category.icon;
                  return (
                    <a
                      key={category.name}
                      href="/category"
                      className="flex items-center justify-between py-3 px-4 rounded-lg hover:bg-primary hover:text-white transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-5 h-5" />
                        <span className="text-sm">{category.name}</span>
                      </div>
                    
                    </a>
                  );
                })}
              </nav>
            </aside>

            {/* Hero Banner Slider */}
            <div className="flex-1 bg-black text-white rounded overflow-hidden relative min-h-[300px] md:min-h-[400px]">
            {heroSlides.map((slide, idx) => (
              <div
                key={idx}
                className={`absolute inset-0 flex items-center transition-opacity duration-500 ${
                  idx === currentSlide ? "opacity-100" : "opacity-0"
                }`}
              >
                <div className="container px-4 md:px-8 lg:px-12">
                  <div className="max-w-md">
                    <div className="flex items-center gap-2 md:gap-4 mb-4 md:mb-6">
                      <svg className="w-8 h-8 md:w-12 md:h-12" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                      </svg>
                      <span className="text-xs md:text-sm">{slide.title}</span>
                    </div>
                    <h1 className="text-2xl md:text-4xl lg:text-5xl font-semibold mb-4 md:mb-6 leading-tight">
                      {slide.subtitle}
                    </h1>
                    <Button variant="outline" className="text-white border-white hover:bg-white hover:text-black text-sm md:text-base">
                      Mua ngay <ChevronRight className="ml-2 w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <div className="absolute right-0 top-0 bottom-0 w-1/3 md:w-1/2 flex items-center justify-center opacity-60 md:opacity-100">
                  <img
                    src={slide.image}
                    alt={slide.title}
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
            ))}
            
            {/* Slider Controls */}
            <button
                onClick={() => setCurrentSlide((prev) => (prev === 0 ? heroSlides.length - 1 : prev - 1))}
                className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 w-8 h-8 md:w-10 md:h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
              >
              <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
            </button>
            <button
              onClick={() => setCurrentSlide((prev) => (prev === heroSlides.length - 1 ? 0 : prev + 1))}
              className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 w-8 h-8 md:w-10 md:h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
            >
              <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
            </button>

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {heroSlides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentSlide(i)}
                  className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-colors ${
                    i === currentSlide ? "bg-primary" : "bg-white/50"
                  }`}
                />
              ))}
            </div>
            </div>
          </div>
        </div>

        {/* Flash Sales */}
        <section className="container mx-auto px-4 py-8 md:py-12">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-3 h-8 md:w-5 md:h-10 bg-primary rounded"></div>
            <span className="text-primary font-semibold text-sm md:text-base">Hôm nay</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 md:mb-8 gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 md:gap-16">
              <h2 className="text-2xl md:text-3xl font-semibold">Flash Sale</h2>
              <div className="flex items-center gap-2 md:gap-4">
                <div className="text-center">
                  <div className="bg-white text-black rounded w-10 h-10 md:w-14 md:h-14 flex items-center justify-center text-sm md:text-lg font-semibold">
                    {String(timeLeft.days).padStart(2, "0")}
                  </div>
                  <span className="text-xs mt-1 block">Ngày</span>
                </div>
                <span className="text-primary text-xl md:text-3xl font-bold">:</span>
                <div className="text-center">
                  <div className="bg-white text-black rounded w-10 h-10 md:w-14 md:h-14 flex items-center justify-center text-sm md:text-lg font-semibold">
                    {String(timeLeft.hours).padStart(2, "0")}
                  </div>
                  <span className="text-xs mt-1 block">Giờ</span>
                </div>
                <span className="text-primary text-xl md:text-3xl font-bold">:</span>
                <div className="text-center">
                  <div className="bg-white text-black rounded w-10 h-10 md:w-14 md:h-14 flex items-center justify-center text-sm md:text-lg font-semibold">
                    {String(timeLeft.minutes).padStart(2, "0")}
                  </div>
                  <span className="text-xs mt-1 block">Phút</span>
                </div>
                <span className="text-primary text-xl md:text-3xl font-bold">:</span>
                <div className="text-center">
                  <div className="bg-white text-black rounded w-10 h-10 md:w-14 md:h-14 flex items-center justify-center text-sm md:text-lg font-semibold">
                    {String(timeLeft.seconds).padStart(2, "0")}
                  </div>
                  <span className="text-xs mt-1 block">Giây</span>
                </div>
              </div>
            </div>
            <Button variant="outline" onClick={() => navigate("/category")} className="hidden md:flex">
              Xem tất cả
            </Button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6 mb-8">
            {flashSalesProducts.map((product) => (
              <ProductCard 
                key={product.id} 
                {...product} 
                showAddToCart 
                isInWishlist={isInWishlist(product.id)}
                onAddToWishlist={() => toggleWishlist(product.id, product.name)}
              />
            ))}
          </div>

          <div className="text-center mt-8 md:mt-12 md:hidden">
            <Button onClick={() => navigate("/category")} className="w-full">Xem tất cả sản phẩm</Button>
          </div>
        </section>

        {/* Best Selling Products */}
        <section className="container mx-auto px-4 py-8 md:py-12 border-t">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-8 md:mb-12 gap-4">
            <div>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-3 h-8 md:w-5 md:h-10 bg-primary rounded"></div>
                <span className="text-primary font-semibold text-sm md:text-base">Tháng này</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-semibold">Sản phẩm bán chạy</h2>
            </div>
            <Button variant="outline" onClick={() => navigate("/category")} className="hidden md:flex">
              Xem tất cả
            </Button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6 mb-8">
            {products
              .sort((a, b) => b.reviews - a.reviews)
              .slice(0, 4)
              .map((product) => (
                <ProductCard 
                  key={product.id} 
                  {...product} 
                  showAddToCart 
                  isInWishlist={isInWishlist(product.id)}
                  onAddToWishlist={() => toggleWishlist(product.id, product.name)}
                />
              ))}
          </div>

          <div className="text-center mt-8 md:mt-12 md:hidden">
            <Button onClick={() => navigate("/category")} className="w-full">Xem tất cả sản phẩm</Button>
          </div>
        </section>

        {/* Categories */}
        <section className="container mx-auto px-4 py-8 md:py-12">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-3 h-8 md:w-5 md:h-10 bg-primary rounded"></div>
            <span className="text-primary font-semibold text-sm md:text-base">Danh mục</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-semibold mb-8 md:mb-12">Duyệt theo danh mục</h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-8">
            {categories.map((category) => {
              const Icon = categoryIcons[category.name as keyof typeof categoryIcons];
              return (
                <div
                  key={category.name}
                  className="group flex flex-col items-center justify-center p-4 md:p-6 border rounded-lg hover:bg-primary hover:border-primary transition-colors cursor-pointer"
                >
                  <Icon className="w-8 h-8 md:w-12 md:h-12 mb-2 md:mb-4 group-hover:text-white transition-colors" />
                  <h3 className="font-medium text-center text-sm md:text-base group-hover:text-white transition-colors">
                    {category.name}
                  </h3>
                  <span className="text-xs md:text-sm text-muted-foreground group-hover:text-white/80 transition-colors">
                    {category.count} sp
                  </span>
                </div>
              );
            })}
          </div>
        </section>

        {/* Laptop Section */}
        <CategorySection
          title="LAPTOP"
          categoryName="Laptop"
          brands={["MacBook", "ASUS", "Lenovo", "MSI", "Acer", "HP", "Dell", "LG", "Gigabyte", "Masstel"]}
          products={products.filter((p) => p.category === "Laptop")}
          mainCategories={[
            { name: "LAPTOP", path: "/category?cat=Laptop" },
            { name: "MÀN HÌNH MÁY TÍNH", path: "/category?cat=Monitor" },
            { name: "PC", path: "/category?cat=PC" },
            { name: "PHỤ KIỆN MÁY TÍNH", path: "/category?cat=Accessories" },
          ]}
          subCategories={[
            { name: "Văn phòng", icon: "laptop" },
            { name: "Gaming", icon: "gaming" },
            { name: "Mỏng nhẹ", icon: "thin" },
            { name: "Đồ họa - kỹ thuật", icon: "design" },
            { name: "Sinh viên", icon: "student" },
            { name: "Cảm ứng", icon: "touch" },
          ]}
          isInWishlist={isInWishlist}
          onToggleWishlist={toggleWishlist}
          banners={[
            { image: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=400&h=200&fit=crop", alt: "Laptop banner 1" },
            { image: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=400&h=200&fit=crop", alt: "Laptop banner 2" },
          ]}
        />

        {/* Điện Thoại Section */}
        <CategorySection
          title="ĐIỆN THOẠI"
          categoryName="Phones"
          brands={["Apple", "Samsung", "Xiaomi", "OPPO", "Vivo", "Realme", "Nokia"]}
          products={products.filter((p) => p.category === "Phones")}
          mainCategories={[
            { name: "ĐIỆN THOẠI", path: "/category?cat=Phones" },
            { name: "TABLET", path: "/category?cat=Tablet" },
            { name: "PHỤ KIỆN", path: "/category?cat=PhoneAccessories" },
          ]}
          subCategories={[
            { name: "iPhone", icon: "laptop" },
            { name: "Samsung", icon: "laptop" },
            { name: "Gaming Phone", icon: "gaming" },
            { name: "Cao cấp", icon: "design" },
          ]}
          isInWishlist={isInWishlist}
          onToggleWishlist={toggleWishlist}
          banners={[
            { image: "https://images.unsplash.com/photo-1592286927505-ffd986e3e5e3?w=400&h=200&fit=crop", alt: "Điện thoại banner 1" },
            { image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=200&fit=crop", alt: "Điện thoại banner 2" },
          ]}
        />
      </main>

      <Footer />
    </div>
  );
};

export default Index;
