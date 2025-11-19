import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const Account = () => {
  const [activeSection, setActiveSection] = useState("profile");

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="text-sm text-muted-foreground">
            Trang chủ / <span className="text-foreground">Tài khoản</span>
          </div>
          <div className="text-sm">
            Xin chào! <span className="text-primary font-medium">Md Rimel</span>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          <aside className="space-y-6">
            <div>
              <h3 className="font-medium mb-3">Quản lý tài khoản</h3>
              <div className="space-y-2 ml-4">
                <button
                  onClick={() => setActiveSection("profile")}
                  className={`block text-sm ${
                    activeSection === "profile"
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Hồ sơ của tôi
                </button>
                <button className="block text-sm text-muted-foreground hover:text-foreground">
                  Sổ địa chỉ
                </button>
                <button className="block text-sm text-muted-foreground hover:text-foreground">
                  Phương thức thanh toán
                </button>
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-3">Đơn hàng của tôi</h3>
              <div className="space-y-2 ml-4">
                <button className="block text-sm text-muted-foreground hover:text-foreground">
                  Đơn trả hàng
                </button>
                <button className="block text-sm text-muted-foreground hover:text-foreground">
                  Đơn hủy
                </button>
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-3">Yêu thích</h3>
            </div>
          </aside>

          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm p-8">
              <h2 className="text-xl text-primary font-medium mb-6">
                Chỉnh sửa thông tin
              </h2>

              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="firstName">Tên</Label>
                    <Input
                      id="firstName"
                      defaultValue="Md"
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Họ</Label>
                    <Input
                      id="lastName"
                      defaultValue="Rimel"
                      className="mt-2"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      defaultValue="rimel1111@gmail.com"
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="address">Địa chỉ</Label>
                    <Input
                      id="address"
                      defaultValue="Kingston, 5236, United State"
                      className="mt-2"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <Label>Đổi mật khẩu</Label>
                  <Input
                    type="password"
                    placeholder="Mật khẩu hiện tại"
                  />
                  <Input
                    type="password"
                    placeholder="Mật khẩu mới"
                  />
                  <Input
                    type="password"
                    placeholder="Xác nhận mật khẩu mới"
                  />
                </div>

                <div className="flex justify-end gap-4">
                  <Button variant="outline">Hủy</Button>
                  <Button>Lưu thay đổi</Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Account;
