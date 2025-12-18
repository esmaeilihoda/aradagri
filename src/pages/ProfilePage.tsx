import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { PageLayout } from "@/components/layout/PageLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Mail, MapPin, Edit2, LogOut, Package, Heart, MessageSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Stats {
  orders: number;
  wishlist: number;
  reviews: number;
}

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [stats, setStats] = useState<Stats>({ orders: 0, wishlist: 0, reviews: 0 });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      // Fetch orders count
      const ordersResp = await fetch("http://localhost:3000/api/orders/my?limit=1", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (ordersResp.ok) {
        const data = await ordersResp.json();
        setStats(prev => ({ ...prev, orders: data.pagination?.total || 0 }));
      }

      // Fetch wishlist count
      const wishlistResp = await fetch("http://localhost:3000/api/wishlist", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (wishlistResp.ok) {
        const data = await wishlistResp.json();
        setStats(prev => ({ ...prev, wishlist: data.data?.length || 0 }));
      }
    } catch (err) {
      console.error("Error fetching stats:", err);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <PageLayout>
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-12" dir="rtl">
        <div className="container-arad max-w-4xl">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 text-right mb-2">
              پروفایل من
            </h1>
            <p className="text-gray-600 text-right">
              اطلاعات حساب و تنظیمات شخصی
            </p>
          </div>

          {/* Main Profile Card */}
          <Card className="mb-8 p-8 shadow-lg">
            <div className="flex flex-col md:flex-row-reverse gap-8">
              {/* Profile Avatar Section */}
              <div className="flex flex-col items-center md:items-start">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center text-white mb-4 shadow-lg">
                  <User className="w-16 h-16" />
                </div>
                <div className="text-center md:text-right">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {user?.name}
                  </h2>
                  <p className="text-gray-600 mt-1">عضو عمومی</p>
                  <p className="text-sm text-gray-500 mt-2">
                    تاریخ عضویت: {new Date().toLocaleDateString("fa-IR")}
                  </p>
                </div>
              </div>

              {/* Profile Info Section */}
              <div className="flex-1 space-y-6">
                {/* Email */}
                <div className="flex items-start gap-4">
                  <Mail className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                  <div className="text-right flex-1">
                    <p className="text-sm text-gray-600">آدرس ایمیل</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {user?.email}
                    </p>
                  </div>
                </div>

                {/* Role */}
                <div className="flex items-start gap-4">
                  <User className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                  <div className="text-right flex-1">
                    <p className="text-sm text-gray-600">نقش</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {user?.role === "ADMIN" ? "مدیر" : "کاربر عادی"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col md:flex-row-reverse gap-4 mt-8 border-t pt-8">
              <Button
                onClick={() => setIsEditingProfile(true)}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white flex-1 md:flex-initial"
              >
                <Edit2 className="w-4 h-4" />
                ویرایش پروفایل
              </Button>
              <Button
                onClick={() => navigate("/profile/addresses")}
                variant="outline"
                className="flex items-center gap-2 flex-1 md:flex-initial"
              >
                <MapPin className="w-4 h-4" />
                مدیریت آدرس‌ها
              </Button>
              <Button
                onClick={handleLogout}
                variant="destructive"
                className="flex items-center gap-2 flex-1 md:flex-initial"
              >
                <LogOut className="w-4 h-4" />
                خروج
              </Button>
            </div>
          </Card>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="p-6 text-center cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate("/orders")}>
              <Package className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <div className="text-3xl font-bold text-green-600 mb-2">{stats.orders}</div>
              <p className="text-gray-600">سفارش‌های کل</p>
            </Card>
            <Card className="p-6 text-center cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate("/wishlist")}>
              <Heart className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <div className="text-3xl font-bold text-blue-600 mb-2">{stats.wishlist}</div>
              <p className="text-gray-600">علاقه‌مندی‌ها</p>
            </Card>
            <Card className="p-6 text-center cursor-pointer hover:shadow-lg transition-shadow">
              <MessageSquare className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <div className="text-3xl font-bold text-purple-600 mb-2">{stats.reviews}</div>
              <p className="text-gray-600">بررسی‌های شما</p>
            </Card>
          </div>

          {/* Quick Links */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6 cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate("/orders")}>
              <h3 className="text-lg font-semibold text-gray-900 text-right mb-2">
                سفارش‌های من
              </h3>
              <p className="text-gray-600 text-right">
                مشاهده و دنبال کردن سفارش‌های شما
              </p>
            </Card>
            <Card className="p-6 cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate("/wishlist")}>
              <h3 className="text-lg font-semibold text-gray-900 text-right mb-2">
                لیست علاقه‌مندی‌ها
              </h3>
              <p className="text-gray-600 text-right">
                محصولات مورد علاقه‌ی شما
              </p>
            </Card>
            <Card className="p-6 cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate("/settings")}>
              <h3 className="text-lg font-semibold text-gray-900 text-right mb-2">
                تنظیمات حساب
              </h3>
              <p className="text-gray-600 text-right">
                تغییر رمز عبور و ترجیحات
              </p>
            </Card>
            {user?.role === "ADMIN" && (
              <Card className="p-6 cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate("/admin")}>
                <h3 className="text-lg font-semibold text-gray-900 text-right mb-2">
                  پنل مدیریت
                </h3>
                <p className="text-gray-600 text-right">
                  مدیریت سایت و محصولات
                </p>
              </Card>
            )}
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
