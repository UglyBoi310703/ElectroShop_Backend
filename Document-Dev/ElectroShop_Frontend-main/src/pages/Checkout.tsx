import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";

const Checkout = () => {
  const cartItems = [
    {
      id: 1,
      name: "LCD Monitor",
      price: 650,
      image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=100",
    },
    {
      id: 2,
      name: "H1 Gamepad",
      price: 1100,
      image: "https://images.unsplash.com/photo-1605901309584-818e25960a8f?w=100",
    },
  ];

  const subtotal = cartItems.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="text-sm text-muted-foreground mb-8">
          Tài khoản / Xem giỏ hàng /{" "}
          <span className="text-foreground">Thanh toán</span>
        </div>

        <h1 className="text-3xl font-medium mb-12">Thông tin thanh toán</h1>

        <div className="grid lg:grid-cols-2 gap-12">
          <div className="space-y-6">
            <div>
              <Label htmlFor="firstName">
                Tên<span className="text-primary">*</span>
              </Label>
              <Input id="firstName" className="mt-2" />
            </div>

            <div>
              <Label htmlFor="companyName">Tên công ty</Label>
              <Input id="companyName" className="mt-2" />
            </div>

            <div>
              <Label htmlFor="streetAddress">
                Địa chỉ<span className="text-primary">*</span>
              </Label>
              <Input id="streetAddress" className="mt-2" />
            </div>

            <div>
              <Label htmlFor="apartment">
                Số nhà, tầng (tùy chọn)
              </Label>
              <Input id="apartment" className="mt-2" />
            </div>

            <div>
              <Label htmlFor="city">
                Thành phố<span className="text-primary">*</span>
              </Label>
              <Input id="city" className="mt-2" />
            </div>

            <div>
              <Label htmlFor="phone">
                Số điện thoại<span className="text-primary">*</span>
              </Label>
              <Input id="phone" type="tel" className="mt-2" />
            </div>

            <div>
              <Label htmlFor="email">
                Email<span className="text-primary">*</span>
              </Label>
              <Input id="email" type="email" className="mt-2" />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox id="save-info" />
              <label
                htmlFor="save-info"
                className="text-sm cursor-pointer"
              >
                Lưu thông tin để thanh toán nhanh hơn lần sau
              </label>
            </div>
          </div>

          <div>
            <div className="space-y-6 mb-8">
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-contain"
                    />
                    <span>{item.name}</span>
                  </div>
                  <span className="font-medium">${item.price}</span>
                </div>
              ))}
            </div>

            <div className="space-y-4 mb-8">
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
            </div>

            <RadioGroup defaultValue="bank" className="space-y-4 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="bank" id="bank" />
                  <Label htmlFor="bank" className="cursor-pointer">
                    Chuyển khoản
                  </Label>
                </div>
                <div className="flex gap-2">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/200px-Visa_Inc._logo.svg.png" alt="Visa" className="h-6" />
                  <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/200px-Mastercard-logo.svg.png" alt="Mastercard" className="h-6" />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="cash" id="cash" />
                <Label htmlFor="cash" className="cursor-pointer">
                  Thanh toán khi nhận hàng
                </Label>
              </div>
            </RadioGroup>

            <div className="flex gap-4 mb-6">
              <Input placeholder="Mã giảm giá" />
              <Button variant="outline">Áp dụng</Button>
            </div>

            <Button className="w-full" size="lg">
              Đặt hàng
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Checkout;
