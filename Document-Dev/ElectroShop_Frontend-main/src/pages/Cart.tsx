import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

const Cart = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: 1,
      name: "LCD Monitor",
      price: 650,
      quantity: 1,
      image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=200",
    },
    {
      id: 2,
      name: "H1 Gamepad",
      price: 550,
      quantity: 2,
      image: "https://images.unsplash.com/photo-1605901309584-818e25960a8f?w=200",
    },
  ]);

  const updateQuantity = (id: number, delta: number) => {
    setCartItems((items) =>
      items.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    );
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="text-sm text-muted-foreground mb-8">
          Trang chủ / <span className="text-foreground">Giỏ hàng</span>
        </div>

        {/* Desktop Table Header - Hidden on mobile */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
          <div className="hidden md:grid grid-cols-4 gap-4 p-6 font-medium border-b">
            <div>Sản phẩm</div>
            <div className="text-center">Giá</div>
            <div className="text-center">Số lượng</div>
            <div className="text-right">Tổng cộng</div>
          </div>

          {cartItems.map((item) => (
            <div key={item.id}>
              {/* Desktop Layout */}
              <div className="hidden md:grid grid-cols-4 gap-4 p-6 items-center border-b last:border-b-0">
                <div className="flex items-center gap-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-contain"
                  />
                  <span>{item.name}</span>
                </div>
                <div className="text-center">${item.price}</div>
                <div className="flex items-center justify-center">
                  <div className="flex items-center border rounded">
                    <button
                      onClick={() => updateQuantity(item.id, -1)}
                      className="px-3 py-1 hover:bg-secondary"
                    >
                      -
                    </button>
                    <span className="px-4 py-1 border-x">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, 1)}
                      className="px-3 py-1 hover:bg-secondary"
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="text-right font-medium">
                  ${item.price * item.quantity}
                </div>
              </div>

              {/* Mobile Card Layout */}
              <div className="md:hidden p-4 border-b last:border-b-0">
                <div className="flex gap-4 mb-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 object-contain flex-shrink-0"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium mb-2">{item.name}</h3>
                    <p className="text-muted-foreground text-sm">Giá: ${item.price}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center border rounded">
                    <button
                      onClick={() => updateQuantity(item.id, -1)}
                      className="px-3 py-1 hover:bg-secondary"
                    >
                      -
                    </button>
                    <span className="px-4 py-1 border-x">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, 1)}
                      className="px-3 py-1 hover:bg-secondary"
                    >
                      +
                    </button>
                  </div>
                  <div className="font-medium text-lg">
                    ${item.price * item.quantity}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row justify-between gap-4 mb-12">
          <Button variant="outline" onClick={() => navigate("/")} className="w-full sm:w-auto">
            Quay lại cửa hàng
          </Button>
          <Button variant="outline" className="w-full sm:w-auto">Cập nhật giỏ hàng</Button>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <Input placeholder="Mã giảm giá" className="flex-1 sm:max-w-xs" />
            <Button className="w-full sm:w-auto">Áp dụng</Button>
          </div>

          <div className="border rounded-lg p-6">
            <h2 className="text-xl font-medium mb-6">Tổng giỏ hàng</h2>
            <div className="space-y-4">
              <div className="flex justify-between pb-4 border-b">
                <span>Tạm tính:</span>
                <span>${subtotal}</span>
              </div>
              <div className="flex justify-between pb-4 border-b">
                <span>Phí vận chuyển:</span>
                <span>Miễn phí</span>
              </div>
              <div className="flex justify-between text-lg font-medium">
                <span>Tổng cộng:</span>
                <span>${subtotal}</span>
              </div>
              <Button
                className="w-full"
                onClick={() => navigate("/checkout")}
              >
                Tiến hành thanh toán
              </Button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Cart;
