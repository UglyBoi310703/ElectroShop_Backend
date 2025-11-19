import { Link } from "react-router-dom";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Send, Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin, CreditCard } from "lucide-react";

const Footer = () => {
  return (
    <footer className="relative mt-20 bg-gradient-to-br from-[hsl(var(--footer-start))] to-[hsl(var(--footer-end))] overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/50 rounded-full blur-3xl"></div>
      </div>
      
      <div className="container mx-auto px-4 py-12 relative z-10">
        {/* Row 1: Company Info, Policies, Contact */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {/* Cột 1: Thông tin công ty */}
          <div>
            <h3 className="text-xl font-bold text-white mb-4">ABC Electronics</h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              Cung cấp các sản phẩm điện tử chất lượng cao với giá cả cạnh tranh. 
              Cam kết mang đến trải nghiệm mua sắm tuyệt vời nhất.
            </p>
          </div>

          {/* Cột 2: Chính sách */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Chính sách</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/privacy" className="text-gray-300 hover:text-primary transition-colors">
                  Chính sách bảo mật
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-gray-300 hover:text-primary transition-colors">
                  Điều khoản sử dụng
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-gray-300 hover:text-primary transition-colors">
                  Câu hỏi thường gặp
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-primary transition-colors">
                  Chính sách đổi trả
                </Link>
              </li>
            </ul>
          </div>

          {/* Cột 3: Liên hệ */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Liên hệ</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <p className="text-gray-300">
                  111 Bijoy Sarani, Dhaka,<br />DH 1515, Bangladesh
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary flex-shrink-0" />
                <a href="mailto:exclusive@gmail.com" className="text-gray-300 hover:text-primary transition-colors">
                  exclusive@gmail.com
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-primary flex-shrink-0" />
                <a href="tel:+880158888999" className="text-gray-300 hover:text-primary transition-colors">
                  +88015-88888-9999
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Row 2: Social Media, Payment Methods, Newsletter */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-8 border-b border-white/10">
          {/* Mạng xã hội */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Mạng xã hội</h3>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-primary hover:scale-110 transition-all duration-300">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-primary hover:scale-110 transition-all duration-300">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-primary hover:scale-110 transition-all duration-300">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-primary hover:scale-110 transition-all duration-300">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Phương thức thanh toán */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Phương thức thanh toán</h3>
            <div className="flex gap-3 items-center">
              <div className="w-12 h-8 border border-white/20 rounded flex items-center justify-center bg-white/5 hover:bg-white/10 transition-colors">
                <CreditCard className="w-6 h-6 text-gray-300" />
              </div>
              <div className="w-12 h-8 border border-white/20 rounded flex items-center justify-center bg-white/5 hover:bg-white/10 transition-colors">
                <span className="text-xs font-semibold text-gray-300">VISA</span>
              </div>
              <div className="w-12 h-8 border border-white/20 rounded flex items-center justify-center bg-white/5 hover:bg-white/10 transition-colors">
                <span className="text-xs font-semibold text-gray-300">MC</span>
              </div>
              <div className="w-12 h-8 border border-white/20 rounded flex items-center justify-center bg-white/5 hover:bg-white/10 transition-colors">
                <span className="text-xs font-semibold text-gray-300">COD</span>
              </div>
            </div>
          </div>

          {/* Đăng ký nhận tin */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Đăng ký nhận tin</h3>
            <p className="text-sm text-gray-300 mb-3">
              Nhận thông tin khuyến mãi mới nhất
            </p>
            <div className="relative">
              <Input
                type="email"
                placeholder="Email của bạn"
                className="pr-10 bg-white/10 border-white/20 text-white placeholder:text-gray-400"
              />
              <Button
                size="icon"
                variant="ghost"
                className="absolute right-0 top-0 text-primary hover:bg-white/10 hover:text-primary"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Row 3: Copyright */}
        <div className="pt-6 text-center">
          <p className="text-sm text-gray-400">
            &copy; 2025 ABC Electronics. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
