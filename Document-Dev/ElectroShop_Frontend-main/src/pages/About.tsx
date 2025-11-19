import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Store, DollarSign, ShoppingBag, Banknote } from "lucide-react";

const About = () => {
  const stats = [
    {
      icon: Store,
      value: "10.5k",
      label: "Người bán hoạt động trên website",
    },
    {
      icon: DollarSign,
      value: "33k",
      label: "Sản phẩm bán ra mỗi tháng",
    },
    {
      icon: ShoppingBag,
      value: "45.5k",
      label: "Khách hàng hoạt động",
    },
    {
      icon: Banknote,
      value: "25k",
      label: "Doanh thu hàng năm",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="text-sm text-muted-foreground mb-8">
          Trang chủ / <span className="text-foreground">Giới thiệu</span>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
          <div>
            <h1 className="text-4xl font-semibold mb-6">Câu chuyện của chúng tôi</h1>
            <div className="space-y-4 text-muted-foreground">
              <p>
                Ra mắt vào năm 2015, Exclusive là thị trường mua sắm trực tuyến hàng đầu Đông Nam Á
                với sự hiện diện tích cực tại Bangladesh. Được hỗ trợ bởi nhiều
                giải pháp marketing, dữ liệu và dịch vụ phù hợp, Exclusive có
                10,500 người bán và 300 thương hiệu, phục vụ 3 triệu khách hàng trên
                toàn khu vực.
              </p>
              <p>
                Exclusive có hơn 1 triệu sản phẩm, tăng trưởng với tốc độ
                rất nhanh. Exclusive cung cấp nhiều loại sản phẩm đa dạng từ
                điện tử tiêu dùng đến thời trang và phong cách sống.
              </p>
            </div>
          </div>
          <div className="bg-primary/10 rounded-lg aspect-[4/3]">
            <img
              src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800"
              alt="Về chúng tôi"
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="border rounded-lg p-8 text-center hover:bg-primary hover:text-white transition-colors group"
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-full border-8 border-muted group-hover:border-white/30 flex items-center justify-center">
                <stat.icon className="w-8 h-8" />
              </div>
              <div className="text-3xl font-bold mb-2">{stat.value}</div>
              <div className="text-sm">{stat.label}</div>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default About;
