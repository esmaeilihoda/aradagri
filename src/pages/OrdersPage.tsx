import { useState, useEffect } from "react";
import { PageLayout } from "@/components/layout/PageLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package, Calendar, DollarSign, ChevronDown, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  product: {
    id: string;
    title: string;
    images?: string[];
  };
}

interface Order {
  id: string;
  totalAmount: number;
  status: "PENDING" | "PROCESSING" | "COMPLETED" | "CANCELLED";
  createdAt: string;
  items: OrderItem[];
}

const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  PROCESSING: "bg-blue-100 text-blue-800",
  COMPLETED: "bg-green-100 text-green-800",
  CANCELLED: "bg-red-100 text-red-800",
};

const statusLabels: Record<string, string> = {
  PENDING: "در انتظار",
  PROCESSING: "در حال پردازش",
  COMPLETED: "تکمیل شده",
  CANCELLED: "لغو شده",
};

export default function OrdersPage() {
  const navigate = useNavigate();
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      
      if (!token) {
        navigate("/login");
        return;
      }

      const response = await fetch("http://localhost:3000/api/orders/my", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setOrders(data.data || []);
        }
      } else {
        setError("خطا در بارگذاری سفارشات");
      }
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError("خطا در بارگذاری سفارشات");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <PageLayout>
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-12" dir="rtl">
          <div className="container-arad max-w-4xl">
            <Card className="p-12 text-center">
              <Loader2 className="w-8 h-8 animate-spin text-green-600 mx-auto mb-4" />
              <p className="text-gray-600">در حال بارگذاری...</p>
            </Card>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-12" dir="rtl">
        <div className="container-arad max-w-4xl">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 text-right mb-2">
              سفارش‌های من
            </h1>
            <p className="text-gray-600 text-right">
              مشاهده و دنبال کردن تمام سفارش‌های شما
            </p>
          </div>

          {error && (
            <Card className="p-4 mb-6 bg-red-50 border-red-200">
              <p className="text-red-700 text-right">{error}</p>
            </Card>
          )}

          {/* Orders List */}
          {orders.length === 0 ? (
            <Card className="p-12 text-center">
              <Package className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                هنوز سفارشی ندارید
              </h2>
              <p className="text-gray-600 mb-6">
                شروع کنید و اولین سفارش خود را ثبت کنید
              </p>
              <Button
                onClick={() => navigate("/products")}
                className="bg-green-600 hover:bg-green-700"
              >
                مرور محصولات
              </Button>
            </Card>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <Card
                  key={order.id}
                  className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
                >
                  {/* Order Summary */}
                  <div
                    onClick={() =>
                      setExpandedOrderId(
                        expandedOrderId === order.id ? null : order.id
                      )
                    }
                    className="p-6 cursor-pointer hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center justify-between flex-row-reverse">
                      <div className="flex-1 text-right">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          سفارش #{order.id.slice(-6).toUpperCase()}
                        </h3>
                        <div className="flex flex-row-reverse gap-6 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            <span>{new Date(order.createdAt).toLocaleDateString("fa-IR")}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Package className="w-4 h-4" />
                            <span>{order.items?.length || 0} مورد</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <DollarSign className="w-4 h-4" />
                            <span>
                              {order.totalAmount?.toLocaleString("fa-IR") || "---"} تومان
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Status Badge */}
                      <div className="flex items-center gap-3 ml-6">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            statusColors[order.status] || "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {statusLabels[order.status] || order.status}
                        </span>
                        <ChevronDown
                          className={`w-5 h-5 text-gray-400 transition-transform ${
                            expandedOrderId === order.id ? "rotate-180" : ""
                          }`}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Order Details (Expandable) */}
                  {expandedOrderId === order.id && (
                    <div className="border-t border-gray-200 p-6 bg-gray-50">
                      <div className="space-y-4">
                        {/* Order Items */}
                        <div>
                          <h4 className="text-sm font-semibold text-gray-900 text-right mb-4">
                            آیتم‌های سفارش
                          </h4>
                          <div className="space-y-3">
                            {order.items?.map((item) => (
                              <div key={item.id} className="flex items-center justify-between bg-white p-3 rounded-lg">
                                <div className="text-right">
                                  <p className="font-medium text-gray-900">{item.product?.title}</p>
                                  <p className="text-sm text-gray-600">
                                    {item.quantity} عدد × {item.price?.toLocaleString("fa-IR")} تومان
                                  </p>
                                </div>
                                <p className="font-semibold text-green-600">
                                  {(item.quantity * item.price)?.toLocaleString("fa-IR")} تومان
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col md:flex-row-reverse gap-3 pt-4 border-t border-gray-200">
                          {order.status === "COMPLETED" && (
                            <Button
                              variant="outline"
                              className="flex-1"
                              onClick={() => navigate("/products")}
                            >
                              سفارش مجدد
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  );
}
