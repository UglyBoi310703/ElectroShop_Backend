import { Link, useNavigate } from "react-router-dom";
import { Input } from "./ui/input";
import { Heart, ShoppingCart, User, Search } from "lucide-react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";
import CategoryMenu from "./CategoryMenu";

const Header = () => {
  const navigate = useNavigate();
  const { isLoggedIn, userName, logout } = useAuth();

  return (
    <>
      {/* Top Banner */}
      <div className="bg-black text-white py-3 text-center text-sm">
        Giảm giá mùa hè cho tất cả đồ bơi và miễn phí vận chuyển nhanh - GIẢM 50%!{" "}
        <Link to="/" className="font-semibold underline ml-2">
          Mua ngay
        </Link>
      </div>

      {/* Main Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-8">
            {/* Logo and Category Menu */}
            <div className="flex items-center gap-2">
              <CategoryMenu />
              <Link to="/" className="text-2xl font-bold text-primary">
                ElectroShop
              </Link>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              <Link to="/" className="hover:underline">
                Trang chủ
              </Link>
              <Link to="/contact" className="hover:underline">
                Liên hệ
              </Link>
              <Link to="/about" className="hover:underline">
                Giới thiệu
              </Link>
            </nav>

            {/* Search and Icons */}
            <div className="flex items-center gap-4">
              <div className="relative hidden lg:block">
                <Input
                  type="search"
                  placeholder="Bạn đang tìm gì?"
                  className="w-64 pr-10"
                />
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              </div>

              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => navigate("/wishlist")}
                    className="relative hover:text-primary transition-colors"
                  >
                    <Heart className="w-6 h-6" />
                    <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 bg-primary text-xs">
                      4
                    </Badge>
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Yêu thích</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => navigate("/cart")}
                    className="relative hover:text-primary transition-colors"
                  >
                    <ShoppingCart className="w-6 h-6" />
                    <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 bg-primary text-xs">
                      2
                    </Badge>
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Giỏ hàng</p>
                </TooltipContent>
              </Tooltip>

              {!isLoggedIn ? (
                <Button onClick={() => navigate("/signup")} variant="default" size="sm">
                  Đăng nhập
                </Button>
              ) : (
                <DropdownMenu>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <DropdownMenuTrigger asChild>
                        <button className="hover:text-primary transition-colors">
                          <User className="w-6 h-6" />
                        </button>
                      </DropdownMenuTrigger>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{userName}</p>
                    </TooltipContent>
                  </Tooltip>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => navigate("/account")}>
                      Tài khoản
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={logout}>
                      Đăng xuất
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
