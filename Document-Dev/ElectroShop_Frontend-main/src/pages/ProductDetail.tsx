import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, Truck, RefreshCw, Star } from "lucide-react";
import { products } from "@/data/products";
import { useWishlist } from "@/contexts/WishlistContext";

const ProductDetail = () => {
  const navigate = useNavigate();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  const product = products[0];
  const relatedProducts = products.slice(1, 5);

  const images = [
    product.image,
    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400",
    "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400",
    "https://images.unsplash.com/photo-1560343090-f0409e92791a?w=400",
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="text-sm text-muted-foreground mb-8">
          Trang chủ / Sản phẩm / <span className="text-foreground">{product.name}</span>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square bg-secondary rounded-lg p-12 flex items-center justify-center">
              <img
                src={images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-contain"
              />
            </div>
            <div className="grid grid-cols-4 gap-4">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`aspect-square bg-secondary rounded-lg p-4 hover:border-primary border-2 transition-colors ${
                    selectedImage === idx ? "border-primary" : "border-transparent"
                  }`}
                >
                  <img src={img} alt={`View ${idx + 1}`} className="w-full h-full object-contain" />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-semibold mb-4">{product.name}</h1>
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < Math.floor(product.rating)
                            ? "text-warning fill-warning"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    ({product.reviews} Đánh giá)
                  </span>
                </div>
                <span className="text-sm text-success">Còn hàng</span>
              </div>
              <div className="flex items-center gap-4 mb-6">
                <span className="text-3xl font-semibold">
                  {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
                </span>
                {product.originalPrice && (
                  <span className="text-xl text-muted-foreground line-through">
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.originalPrice)}
                  </span>
                )}
              </div>
            </div>

            <p className="text-muted-foreground leading-relaxed">
              {product.name} là sản phẩm laptop gaming hiệu năng cao, được thiết kế cho cả công việc và giải trí. 
              Với cấu hình mạnh mẽ và thiết kế hiện đại, đây là lựa chọn lý tưởng cho game thủ và dân văn phòng.
            </p>

            <div className="border-t pt-6 space-y-6">
              {/* Quantity & Add to Cart */}
              <div className="flex gap-4">
                <div className="flex items-center border rounded">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-2 hover:bg-primary hover:text-white transition-colors"
                  >
                    -
                  </button>
                  <span className="px-6 py-2 border-x min-w-[80px] text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-4 py-2 hover:bg-primary hover:text-white transition-colors"
                  >
                    +
                  </button>
                </div>
                <Button className="flex-1" size="lg" onClick={() => navigate("/cart")}>
                  Thêm vào giỏ
                </Button>
                <Button variant="outline" size="lg" className="px-4">
                  <Heart className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Delivery Info */}
            <div className="border rounded-lg divide-y">
              <div className="p-4 flex gap-4">
                <Truck className="w-6 h-6" />
                <div>
                  <h4 className="font-medium mb-1">Giao hàng miễn phí</h4>
                  <p className="text-sm text-muted-foreground underline">
                    Nhập mã bưu điện để kiểm tra khả năng giao hàng
                  </p>
                </div>
              </div>
              <div className="p-4 flex gap-4">
                <RefreshCw className="w-6 h-6" />
                <div>
                  <h4 className="font-medium mb-1">Chính sách đổi trả</h4>
                  <p className="text-sm text-muted-foreground">
                    Miễn phí đổi trả trong 30 ngày. Chi tiết
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <Tabs defaultValue="description" className="mb-16">
          <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent">
            <TabsTrigger 
              value="description"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-8 py-4"
            >
              Mô tả chi tiết
            </TabsTrigger>
            <TabsTrigger 
              value="specifications"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-8 py-4"
            >
              Thông số kỹ thuật
            </TabsTrigger>
            <TabsTrigger 
              value="reviews"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-8 py-4"
            >
              Đánh giá ({product.reviews})
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="description" className="py-8">
            <div className="prose max-w-none">
              <p className="text-muted-foreground leading-relaxed mb-4">
                {product.name} là laptop gaming mạnh mẽ với cấu hình vượt trội, mang đến trải nghiệm 
                chơi game và làm việc mượt mà. Máy được trang bị bộ vi xử lý Intel Core thế hệ mới nhất 
                cùng card đồ họa rời hiệu năng cao để xử lý mọi tác vụ nặng.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Thiết kế hiện đại với màn hình có độ phủ màu rộng, tần số quét cao mang lại hình ảnh 
                sắc nét và chuyển động mượt mà. Hệ thống tản nhiệt tiên tiến giúp máy hoạt động ổn định 
                ngay cả khi chơi game hoặc render video trong thời gian dài.
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Bộ vi xử lý Intel Core thế hệ mới, hiệu năng vượt trội</li>
                <li>Card đồ họa rời mạnh mẽ cho gaming và đồ họa</li>
                <li>RAM 8GB-16GB có thể nâng cấp</li>
                <li>SSD tốc độ cao, khởi động nhanh chỉ trong vài giây</li>
                <li>Bàn phím có đèn nền RGB, gõ êm ái</li>
                <li>Pin dung lượng lớn, sử dụng liên tục đến 6-8 giờ</li>
                <li>Cổng kết nối đầy đủ: USB-C, HDMI, USB 3.0</li>
              </ul>
            </div>
          </TabsContent>
          
          <TabsContent value="specifications" className="py-8">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex justify-between py-3 border-b">
                  <span className="font-medium">Thương hiệu</span>
                  <span className="text-muted-foreground">{product.brand}</span>
                </div>
                <div className="flex justify-between py-3 border-b">
                  <span className="font-medium">CPU</span>
                  <span className="text-muted-foreground">AMD Ryzen 5 5500U / Intel Core i5</span>
                </div>
                <div className="flex justify-between py-3 border-b">
                  <span className="font-medium">RAM</span>
                  <span className="text-muted-foreground">8GB DDR4</span>
                </div>
                <div className="flex justify-between py-3 border-b">
                  <span className="font-medium">Ổ cứng</span>
                  <span className="text-muted-foreground">512GB SSD NVMe</span>
                </div>
                <div className="flex justify-between py-3 border-b">
                  <span className="font-medium">Card đồ họa</span>
                  <span className="text-muted-foreground">NVIDIA GTX 1650 4GB</span>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between py-3 border-b">
                  <span className="font-medium">Màn hình</span>
                  <span className="text-muted-foreground">15.6" FHD IPS 144Hz</span>
                </div>
                <div className="flex justify-between py-3 border-b">
                  <span className="font-medium">Pin</span>
                  <span className="text-muted-foreground">48Wh, ~6-8 giờ</span>
                </div>
                <div className="flex justify-between py-3 border-b">
                  <span className="font-medium">Trọng lượng</span>
                  <span className="text-muted-foreground">2.1kg</span>
                </div>
                <div className="flex justify-between py-3 border-b">
                  <span className="font-medium">Hệ điều hành</span>
                  <span className="text-muted-foreground">Windows 11 Home</span>
                </div>
                <div className="flex justify-between py-3 border-b">
                  <span className="font-medium">Bảo hành</span>
                  <span className="text-muted-foreground">12 tháng</span>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="reviews" className="py-8">
            <div className="space-y-6">
              {[1, 2, 3].map((review) => (
                <div key={review} className="border-b pb-6 last:border-b-0">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-semibold">
                      JD
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold">Nguyễn Văn A</h4>
                        <span className="text-sm text-muted-foreground">2 ngày trước</span>
                      </div>
                      <div className="flex mb-2">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 text-warning fill-warning" />
                        ))}
                      </div>
                      <p className="text-muted-foreground">
                        Laptop rất tốt! Cấu hình mạnh, chơi game mượt mà và làm việc hiệu quả. 
                        Màn hình đẹp, bàn phím gõ êm. Rất đáng giá với mức giá này!
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Related Products */}
        <section>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-5 h-10 bg-primary rounded"></div>
            <span className="text-primary font-semibold">Sản phẩm liên quan</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((product) => (
              <ProductCard 
                key={product.id} 
                {...product} 
                isInWishlist={isInWishlist(product.id)}
                onAddToWishlist={() => toggleWishlist(product.id, product.name)}
              />
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default ProductDetail;
