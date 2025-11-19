import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { products } from "@/data/products";
import { useWishlist } from "@/contexts/WishlistContext";

const Wishlist = () => {
  const { wishlistIds, toggleWishlist, isInWishlist } = useWishlist();
  const wishlistProducts = products.filter(p => wishlistIds.includes(p.id));
  const justForYou = products.slice(4, 8);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-medium">Yêu thích ({wishlistProducts.length})</h1>
          <Button variant="outline">Chuyển tất cả vào giỏ</Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {wishlistProducts.map((product) => (
            <ProductCard 
              key={product.id} 
              {...product} 
              showAddToCart 
              isInWishlist={isInWishlist(product.id)}
              onAddToWishlist={() => toggleWishlist(product.id, product.name)}
            />
          ))}
        </div>

        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-5 h-10 bg-primary rounded"></div>
            <h2 className="text-2xl font-medium">Dành cho bạn</h2>
          </div>
          <Button variant="outline">Xem tất cả</Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {justForYou.map((product) => (
            <ProductCard 
              key={product.id} 
              {...product} 
              showAddToCart 
              isInWishlist={isInWishlist(product.id)}
              onAddToWishlist={() => toggleWishlist(product.id, product.name)}
            />
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Wishlist;
