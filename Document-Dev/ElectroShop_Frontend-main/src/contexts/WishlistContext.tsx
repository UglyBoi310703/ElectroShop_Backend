import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { toast } from "sonner";

interface WishlistContextType {
  wishlistIds: number[];
  toggleWishlist: (productId: number, productName?: string) => void;
  isInWishlist: (productId: number) => boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider = ({ children }: { children: ReactNode }) => {
  const [wishlistIds, setWishlistIds] = useState<number[]>(() => {
    // Load from localStorage
    const saved = localStorage.getItem("wishlist");
    return saved ? JSON.parse(saved) : [];
  });

  // Save to localStorage whenever wishlist changes
  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishlistIds));
  }, [wishlistIds]);

  const toggleWishlist = (productId: number, productName?: string) => {
    setWishlistIds((prev) => {
      if (prev.includes(productId)) {
        toast.success("Đã bỏ yêu thích sản phẩm", {
          description: productName,
        });
        return prev.filter((id) => id !== productId);
      } else {
        toast.success("Đã thêm vào yêu thích", {
          description: productName,
        });
        return [...prev, productId];
      }
    });
  };

  const isInWishlist = (productId: number) => {
    return wishlistIds.includes(productId);
  };

  return (
    <WishlistContext.Provider value={{ wishlistIds, toggleWishlist, isInWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within WishlistProvider");
  }
  return context;
};
