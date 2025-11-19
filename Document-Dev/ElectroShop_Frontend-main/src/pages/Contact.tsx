import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Phone, Mail } from "lucide-react";

const Contact = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="text-sm text-muted-foreground mb-8">
          Trang chủ / <span className="text-foreground">Liên hệ</span>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="bg-white rounded-lg shadow-sm p-8 space-y-8">
            <div>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white">
                  <Phone className="w-5 h-5" />
                </div>
                <h3 className="font-medium">Gọi cho chúng tôi</h3>
              </div>
              <p className="text-sm mb-2">Chúng tôi luôn sẵn sàng hỗ trợ 24/7.</p>
              <p className="text-sm font-medium">Điện thoại: +8801611112222</p>
            </div>

            <hr />

            <div>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white">
                  <Mail className="w-5 h-5" />
                </div>
                <h3 className="font-medium">Gửi tin nhắn</h3>
              </div>
              <p className="text-sm mb-2">
                Điền form và chúng tôi sẽ liên hệ trong vòng 24 giờ.
              </p>
              <p className="text-sm font-medium mb-1">
                Email: customer@exclusive.com
              </p>
              <p className="text-sm font-medium">Email: support@exclusive.com</p>
            </div>
          </div>

          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm p-8">
            <form className="space-y-6">
              <div className="grid md:grid-cols-3 gap-4">
                <Input placeholder="Tên của bạn *" required />
                <Input placeholder="Email của bạn *" type="email" required />
                <Input placeholder="Số điện thoại *" type="tel" required />
              </div>

              <Textarea
                placeholder="Tin nhắn của bạn"
                className="min-h-[200px]"
                required
              />

              <div className="flex justify-end">
                <Button size="lg" className="px-12">
                  Gửi tin nhắn
                </Button>
              </div>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Contact;
