import { useEffect, useState } from "react";
import { PageLayout } from "@/components/layout/PageLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Trash2, ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface WishlistItem {
  id: string;
  name: string;
  price: number;
  category: string;
  image: string;
  inStock: boolean;
}

// Fallback mock data (used when API unavailable)
const mockWishlistItems: WishlistItem[] = [
  {
    id: "1",
    name: "گلخانه آلومینیومی 10x20",
    price: 45000000,
    category: "تجهیزات گلخانه‌ای",
    image: "/images/greenhouse.jpg",
    inStock: true,
  },
  {
    id: "2",
    name: "سیستم آبیاری هوشمند",
    price: 12000000,
    category: "سیستم‌های آبیاری",
    image: "/images/irrigation.jpg",
    inStock: true,
  },
  {
    id: "3",
    name: "تراکتور 85 اسب",
    price: 850000000,
    category: "تجهیزات کشاورزی",
    image: "/images/tractor.jpg",
    inStock: false,
  },
];

export default function WishlistPage() {
  const navigate = useNavigate();
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Load wishlist from backend, fallback to mock if failing
  useEffect(() => {
    let isMounted = true;
    const token = localStorage.getItem("token");

    async function fetchWishlist() {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch("http://localhost:3000/api/wishlist", {
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },
        });

        if (!res.ok) {
          throw new Error(`خطا در دریافت لیست علاقه‌مندی‌ها (${res.status})`);
        }

        const data = await res.json();
        const mapped: WishlistItem[] = (data?.data || []).map((w: any) => ({
          id: w.product?.id ?? w.id,
          name: w.product?.title ?? "محصول",
          price: w.product?.price ?? 0,
          category: w.product?.category?.name ?? "",
          image: w.product?.images?.[0] ?? "/images/placeholder.jpg",
          inStock: (w.product?.stock ?? 0) > 0,
        }));

        if (isMounted) {
          setWishlistItems(mapped);
        }
      } catch (err: any) {
        // Fallback to mock data for now
        if (isMounted) {
          setError(err?.message ?? "خطای ناشناخته");
          setWishlistItems(mockWishlistItems);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchWishlist();
    return () => {
      isMounted = false;
    };
  }, []);

  const removeItem = async (id: string) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:3000/api/wishlist/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      });
      // Optimistic update regardless; if API fails we still remove locally
      setWishlistItems((prev) => prev.filter((item) => item.id !== id));
    } catch {
      setWishlistItems((prev) => prev.filter((item) => item.id !== id));
    }
  };

  const addToCart = (item: WishlistItem) => {
    // TODO: Add to cart functionality
    navigate("/cart");
  };

  if (loading) {
    return (
      <PageLayout>
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-12" dir="rtl">
          <div className="container-arad max-w-4xl text-right">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">لیست علاقه‌مندی‌های من</h1>
            <p className="text-gray-600">در حال بارگذاری...</p>
          </div>
        </div>
      </PageLayout>
    );
  }

  if (wishlistItems.length === 0) {
    return (
      <PageLayout>
        <div
          className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-12"
          dir="rtl"
        >
          <div className="container-arad max-w-4xl">
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-gray-900 text-right mb-2">
                لیست علاقه‌مندی‌های من
              </h1>
            </div>

            <Card className="p-12 text-center">
              <Heart className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                لیست علاقه‌مندی‌های شما خالی است
              </h2>
              <p className="text-gray-600 mb-6">
                محصولات مورد علاقه‌ی خود را با کلیک بر روی قلب اضافه کنید
              </p>
              <Button
                onClick={() => navigate("/products")}
                className="bg-green-600 hover:bg-green-700"
              >
                مرور محصولات
              </Button>
            </Card>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-12" dir="rtl">
        <div className="container-arad max-w-5xl">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 text-right mb-2">
              لیست علاقه‌مندی‌های من
            </h1>
            <p className="text-gray-600 text-right">
              {wishlistItems.length} محصول در لیست علاقه‌مندی شما
            </p>
          </div>

          {/* Wishlist Items Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlistItems.map((item) => (
              <Card
                key={item.id}
                className="overflow-hidden hover:shadow-xl transition-shadow flex flex-col"
              >
                {/* Product Image */}
                <div className="w-full h-48 bg-gray-200 flex items-center justify-center relative">
                  <ShoppingCart className="w-12 h-12 text-gray-400" />
                  {!item.inStock && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <span className="bg-red-600 text-white px-4 py-2 rounded-lg">
                        ناموجود
                      </span>
                    </div>
                  )}
                  <button
                    onClick={() => removeItem(item.id)}
                    className="absolute top-2 left-2 p-2 bg-white rounded-full shadow-lg hover:bg-red-50 transition-colors"
                  >
                    <Heart className="w-5 h-5 text-red-500 fill-current" />
                  </button>
                </div>

                {/* Product Info */}
                <div className="p-6 flex flex-col flex-1">
                  <div className="mb-4 flex-1">
                    <div className="text-sm text-gray-600 text-right mb-1">
                      {item.category}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 text-right line-clamp-2">
                      {item.name}
                    </h3>
                  </div>

                  {/* Price */}
                  <div className="mb-4 pb-4 border-t border-gray-200">
                    <div className="text-2xl font-bold text-green-600 text-right">
                      {item.price.toLocaleString("fa-IR")}
                    </div>
                    <div className="text-xs text-gray-500 text-right">تومان</div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 flex-col-reverse">
                    <Button
                      onClick={() => removeItem(item.id)}
                      variant="destructive"
                      className="w-full"
                    >
                      <Trash2 className="w-4 h-4 ml-2" />
                      حذف
                    </Button>
                    <Button
                      onClick={() => addToCart(item)}
                      disabled={!item.inStock}
                      className="w-full bg-green-600 hover:bg-green-700"
                    >
                      <ShoppingCart className="w-4 h-4 ml-2" />
                      افزودن به سبد
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
