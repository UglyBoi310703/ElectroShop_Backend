import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Smartphone, Tablet, Laptop, Headphones, Mic, Camera, Watch, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const CategoryMenu = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const categories = [
    { name: "Điện thoại, Tablet", icon: Smartphone, path: "/category" },
    { name: "Laptop", icon: Laptop, path: "/category" },
    { name: "Âm thanh, Mic thu âm", icon: Mic, path: "/category" },
    { name: "Đồng hồ, Camera", icon: Camera, path: "/category" },
    { name: "Phụ kiện", icon: Headphones, path: "/category" },
    { name: "Smartwatch", icon: Watch, path: "/category" },
  ];

  const handleCategoryClick = (path: string) => {
    navigate(path);
    setOpen(false);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          aria-label="Menu danh mục"
        >
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[280px] sm:w-[320px] p-0">
        <div className="py-6">
          <h2 className="px-6 text-lg font-semibold mb-4">Danh mục sản phẩm</h2>
          <nav className="space-y-1">
            {categories.map((category) => (
              <button
                key={category.name}
                onClick={() => handleCategoryClick(category.path)}
                className="w-full flex items-center justify-between px-6 py-3 text-left hover:bg-primary hover:text-white transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <category.icon className="h-5 w-5" />
                  <span className="text-sm font-medium">{category.name}</span>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-white" />
              </button>
            ))}
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default CategoryMenu;
