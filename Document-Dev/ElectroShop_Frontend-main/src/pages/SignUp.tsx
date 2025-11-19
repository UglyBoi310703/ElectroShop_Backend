import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import authIllustration from "@/assets/auth-illustration.png";

const SignUp = () => {
  const [isLogin, setIsLogin] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const DEMO_EMAIL = "demo@electroshop.com";
  const DEMO_PASSWORD = "demo123";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check demo account for login
    if (isLogin && email === DEMO_EMAIL && password === DEMO_PASSWORD) {
      login("Demo User");
      toast({
        title: "Đăng nhập thành công!",
        description: "Chào mừng Demo User",
      });
      navigate("/");
      return;
    }
    
    // Check wrong demo credentials
    if (isLogin && email === DEMO_EMAIL && password !== DEMO_PASSWORD) {
      toast({
        title: "Mật khẩu không đúng",
        description: "Vui lòng kiểm tra lại mật khẩu demo",
        variant: "destructive",
      });
      return;
    }
    
    // Regular login/signup
    const userName = isLogin ? email.split("@")[0] : name;
    login(userName);
    toast({
      title: isLogin ? "Đăng nhập thành công!" : "Đăng ký thành công!",
      description: `Chào mừng ${userName}`,
    });
    navigate("/");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1 flex">
      {/* Left Side - Illustration */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-cyan-50 to-blue-100 items-center justify-center p-12">
        <div className="max-w-lg">
          <img
            src={authIllustration}
            alt="Shopping illustration"
            className="w-full h-auto"
          />
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <h1 className="text-4xl font-semibold mb-2">
            {isLogin ? "Đăng nhập" : "Tạo tài khoản"}
          </h1>
          <p className="text-muted-foreground mb-8">
            {isLogin ? "Nhập thông tin của bạn" : "Nhập thông tin để đăng ký"}
          </p>

          {isLogin && (
            <div className="mb-6 p-4 bg-primary/10 border border-primary/20 rounded-lg">
              <p className="text-sm font-semibold mb-2 text-primary">🎯 Tài khoản Demo</p>
              <div className="space-y-1 text-sm">
                <p className="text-muted-foreground">
                  <span className="font-medium text-foreground">Email:</span> demo@electroshop.com
                </p>
                <p className="text-muted-foreground">
                  <span className="font-medium text-foreground">Password:</span> demo123
                </p>
              </div>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            {!isLogin && (
              <div>
                <Input 
                  type="text" 
                  placeholder="Tên" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required={!isLogin}
                  className="border-0 border-b border-border rounded-none px-0 focus-visible:ring-0 focus-visible:border-primary"
                />
              </div>
            )}
            <div>
              <Input 
                type="email" 
                placeholder="Email hoặc Số điện thoại" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="border-0 border-b border-border rounded-none px-0 focus-visible:ring-0 focus-visible:border-primary"
              />
            </div>
            <div>
              <Input 
                type="password" 
                placeholder="Mật khẩu" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="border-0 border-b border-border rounded-none px-0 focus-visible:ring-0 focus-visible:border-primary"
              />
            </div>

            <div className="flex items-center justify-between gap-4 pt-4">
              <Button className="px-12 rounded" size="lg" type="submit">
                {isLogin ? "Đăng nhập" : "Tạo tài khoản"}
              </Button>
              {isLogin && (
                <button
                  type="button"
                  className="text-primary text-sm hover:underline"
                >
                  Quên mật khẩu?
                </button>
              )}
            </div>

            <Button 
              variant="outline" 
              className="w-full gap-3 rounded" 
              size="lg" 
              type="button"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC04"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Đăng ký bằng Google
            </Button>

            <p className="text-center text-muted-foreground">
              {isLogin ? "Chưa có tài khoản?" : "Đã có tài khoản?"}{" "}
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-foreground font-medium underline hover:no-underline ml-2"
              >
                {isLogin ? "Đăng ký" : "Đăng nhập"}
              </button>
            </p>
          </form>
        </div>
      </div>
      </div>
      <Footer />
    </div>
  );
};

export default SignUp;
