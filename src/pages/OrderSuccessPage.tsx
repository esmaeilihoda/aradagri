import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { PageLayout } from "@/components/layout/PageLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Package, Home, FileText } from "lucide-react";

export default function OrderSuccessPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [orderId, setOrderId] = useState<string | null>(null);

  useEffect(() => {
    // Get orderId from navigation state
    const state = location.state as { orderId?: string } | null;
    if (state?.orderId) {
      setOrderId(state.orderId);
    }
  }, [location]);

  return (
    <PageLayout>
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-12" dir="rtl">
        <div className="container-arad max-w-lg">
          <Card className="p-8 text-center">
            {/* Success Icon */}
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>

            {/* Success Message */}
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              سفارش شما با موفقیت ثبت شد!
            </h1>
            <p className="text-gray-600 mb-6">
              از خرید شما متشکریم. سفارش شما در حال پردازش است.
            </p>

            {/* Order Info */}
            {orderId && (
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <p className="text-sm text-gray-600 mb-1">شماره سفارش:</p>
                <p className="font-mono text-lg font-semibold text-gray-900">
                  #{orderId.slice(-8).toUpperCase()}
                </p>
              </div>
            )}

            {/* Status Steps */}
            <div className="flex items-center justify-center gap-2 mb-8">
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle className="w-5 h-5" />
                <span className="text-sm font-medium">ثبت شده</span>
              </div>
              <div className="w-8 h-px bg-gray-300" />
              <div className="flex items-center gap-2 text-gray-400">
                <Package className="w-5 h-5" />
                <span className="text-sm">در حال ارسال</span>
              </div>
              <div className="w-8 h-px bg-gray-300" />
              <div className="flex items-center gap-2 text-gray-400">
                <CheckCircle className="w-5 h-5" />
                <span className="text-sm">تحویل</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button
                onClick={() => navigate("/orders")}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                <FileText className="w-4 h-4 ml-2" />
                مشاهده سفارشات من
              </Button>
              <Button
                onClick={() => navigate("/")}
                variant="outline"
                className="w-full"
              >
                <Home className="w-4 h-4 ml-2" />
                بازگشت به صفحه اصلی
              </Button>
            </div>

            {/* Additional Info */}
            <p className="text-xs text-gray-500 mt-6">
              شما می‌توانید وضعیت سفارش خود را از بخش "سفارشات من" پیگیری کنید.
            </p>
          </Card>
        </div>
      </div>
    </PageLayout>
  );
}
