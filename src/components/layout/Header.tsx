import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, Search, ChevronDown, Leaf, Phone, LogOut, ShoppingCart, Heart, User, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

const menuItems = [
  {
    label: "محصولات",
    href: "/products",
    children: [
      { label: "نهال", href: "/products/seedlings", icon: "🌱" },
      { label: "بذر", href: "/products/seeds", icon: "🌾" },
      { label: "کود", href: "/products/fertilizers", icon: "🧪" },
      { label: "سم", href: "/products/pesticides", icon: "💧" },
      { label: "تجهیزات کشاورزی", href: "/products/equipment", icon: "🚜" },
      { label: "تجهیزات گلخانه‌ای", href: "/products/greenhouse-equipment", icon: "🏡" },
      { label: "سیستم‌های آبیاری", href: "/products/irrigation", icon: "💦" },
    ],
  },
  {
    label: "خدمات",
    href: "/services",
    children: [
      { label: "ساخت گلخانه", href: "/services/greenhouse-construction", icon: "🏗️" },
      { label: "مشاوره سازه کشاورزی", href: "/services/consulting", icon: "📋" },
      { label: "محوطه‌سازی و ویلاسازی", href: "/services/landscaping", icon: "🏡" },
      { label: "مشاوره حقوقی اراضی", href: "/services/legal", icon: "⚖️" },
      { label: "ابزارهای هوش مصنوعی", href: "/services/ai-tools", icon: "🤖" },
    ],
  },
  {
    label: "درباره ما",
    href: "/about",
    children: [
      { label: "معرفی آراد", href: "/about", icon: "🌿" },
      { label: "تجارت درخت", href: "/about/tree-trade", icon: "🌳" },
      { label: "گواهی‌ها", href: "/certificates", icon: "📜" },
    ],
  },
  {
    label: "محتوا",
    href: "/content",
    children: [
      { label: "آنالیز رفتار مشتری", href: "/content/analytics", icon: "📊" },
      { label: "پیشنهادها و مشاوره", href: "/content/suggestions", icon: "💡" },
      { label: "گالری تصاویر", href: "/gallery", icon: "🖼️" },
    ],
  },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const { user, isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-50 w-full glass-effect border-b">
      <div className="container-arad">
        {/* Top Bar */}
        <div className="hidden md:flex items-center justify-between py-2 border-b border-border/50 text-sm">
          <div className="flex items-center gap-4 text-muted-foreground">
            <span className="flex items-center gap-1">
              <Phone className="w-4 h-4" />
              ۰۲۱-۱۲۳۴۵۶۷۸
            </span>
            <span>پشتیبانی ۲۴ ساعته</span>
          </div>
          <div className="flex items-center gap-4">
            {isLoggedIn && user ? (
              <>
                <span className="text-muted-foreground">خوش آمدید، {user.name}</span>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1 hover:text-red-600 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  خروج
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:text-primary transition-colors">
                  ورود
                </Link>
                <span className="text-border">|</span>
                <Link to="/signup" className="hover:text-primary transition-colors">
                  ثبت‌نام
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Main Header */}
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-hero flex items-center justify-center shadow-arad-md">
              <Leaf className="w-7 h-7 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-primary">آراد</h1>
              <span className="text-xs text-muted-foreground">کشاورزی نوین</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {menuItems.map((item) => (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => setActiveDropdown(item.label)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <Link
                  to={item.href}
                  className={cn(
                    "flex items-center gap-1 px-4 py-2 rounded-lg font-medium transition-all duration-200",
                    "hover:bg-muted hover:text-primary",
                    activeDropdown === item.label && "bg-muted text-primary"
                  )}
                >
                  {item.label}
                  {item.children && (
                    <ChevronDown
                      className={cn(
                        "w-4 h-4 transition-transform duration-200",
                        activeDropdown === item.label && "rotate-180"
                      )}
                    />
                  )}
                </Link>

                {/* Dropdown */}
                {item.children && activeDropdown === item.label && (
                  <div className="absolute top-full right-0 mt-1 w-64 bg-card rounded-xl shadow-arad-lg border border-border overflow-hidden animate-fade-in">
                    <div className="p-2">
                      {item.children.map((child) => (
                        <Link
                          key={child.label}
                          to={child.href}
                          className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-muted transition-colors"
                        >
                          <span className="text-xl">{child.icon}</span>
                          <span className="font-medium">{child.label}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Search & Actions */}
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center relative">
              <input
                type="text"
                placeholder="جستجو..."
                className="w-48 lg:w-64 h-10 pr-10 pl-4 bg-muted rounded-lg border-none text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
              />
              <Search className="absolute right-3 w-4 h-4 text-muted-foreground" />
            </div>
            
            {/* User Action Icons */}
            <div className="hidden md:flex items-center gap-2">
              {isLoggedIn && user?.role === "ADMIN" && (
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => navigate("/admin")}
                  title="پنل مدیریت"
                >
                  <Settings className="w-5 h-5" />
                </Button>
              )}
              {isLoggedIn && (
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => navigate("/wishlist")}
                  title="لیست علاقه‌مندی‌ها"
                >
                  <Heart className="w-5 h-5" />
                </Button>
              )}
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => navigate("/cart")}
                title="سبد خرید"
              >
                <ShoppingCart className="w-5 h-5" />
              </Button>
              {isLoggedIn && (
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => navigate("/profile")}
                  title="پروفایل من"
                >
                  <User className="w-5 h-5" />
                </Button>
              )}
            </div>

            <Button variant="forest" size="sm" className="hidden md:flex">
              تماس با ما
            </Button>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-border animate-slide-in-right">
            <div className="space-y-2">
              {menuItems.map((item) => (
                <div key={item.label}>
                  <div
                    className="flex items-center justify-between px-4 py-3 rounded-lg hover:bg-muted cursor-pointer"
                    onClick={() =>
                      setActiveDropdown(activeDropdown === item.label ? null : item.label)
                    }
                  >
                    <span className="font-medium">{item.label}</span>
                    {item.children && (
                      <ChevronDown
                        className={cn(
                          "w-4 h-4 transition-transform",
                          activeDropdown === item.label && "rotate-180"
                        )}
                      />
                    )}
                  </div>
                  {item.children && activeDropdown === item.label && (
                    <div className="mr-4 mt-1 space-y-1">
                      {item.children.map((child) => (
                        <Link
                          key={child.label}
                          to={child.href}
                          className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-muted transition-colors text-sm"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <span>{child.icon}</span>
                          <span>{child.label}</span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="mt-4 px-4">
              <Button variant="forest" className="w-full">
                تماس با ما
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
