import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PageLayout } from "@/components/layout/PageLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Plus, Edit2, Trash2, Star, Loader2, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { API_BASE_URL } from "@/lib/api-config";

interface Address {
  id: string;
  title: string;
  fullName: string;
  phone: string;
  street: string;
  city: string;
  province: string;
  postalCode: string;
  isDefault: boolean;
}

export default function AddressesPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    fullName: "",
    phone: "",
    street: "",
    city: "",
    province: "",
    postalCode: "",
    isDefault: false,
  });

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      
      if (!token) {
        navigate("/login");
        return;
      }

      const response = await fetch("${API_BASE_URL}/address", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setAddresses(data.data || []);
        }
      }
    } catch (err) {
      console.error("Error fetching addresses:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const url = editingAddress 
        ? `${API_BASE_URL}/address/${editingAddress.id}`
        : "${API_BASE_URL}/address";
      
      const response = await fetch(url, {
        method: editingAddress ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast({
          title: "موفق",
          description: editingAddress ? "آدرس به‌روزرسانی شد" : "آدرس جدید اضافه شد",
        });
        setShowAddForm(false);
        setEditingAddress(null);
        setFormData({
          title: "",
          fullName: "",
          phone: "",
          street: "",
          city: "",
          province: "",
          postalCode: "",
          isDefault: false,
        });
        fetchAddresses();
      } else {
        const err = await response.json();
        toast({
          title: "خطا",
          description: err.message || "خطا در ذخیره آدرس",
          variant: "destructive",
        });
      }
    } catch (err) {
      toast({
        title: "خطا",
        description: "خطا در ذخیره آدرس",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("آیا از حذف این آدرس مطمئنید؟")) return;

    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const response = await fetch(`${API_BASE_URL}/address/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        toast({
          title: "موفق",
          description: "آدرس حذف شد",
        });
        fetchAddresses();
      }
    } catch (err) {
      toast({
        title: "خطا",
        description: "خطا در حذف آدرس",
        variant: "destructive",
      });
    }
  };

  const handleSetDefault = async (id: string) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const response = await fetch(`${API_BASE_URL}/address/${id}/default`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        toast({
          title: "موفق",
          description: "آدرس پیش‌فرض تغییر کرد",
        });
        fetchAddresses();
      }
    } catch (err) {
      toast({
        title: "خطا",
        description: "خطا در تغییر آدرس پیش‌فرض",
        variant: "destructive",
      });
    }
  };

  const startEdit = (address: Address) => {
    setEditingAddress(address);
    setFormData({
      title: address.title,
      fullName: address.fullName,
      phone: address.phone,
      street: address.street,
      city: address.city,
      province: address.province,
      postalCode: address.postalCode,
      isDefault: address.isDefault,
    });
    setShowAddForm(true);
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
          <div className="mb-8 flex items-center justify-between">
            <div>
              <Button 
                variant="ghost" 
                onClick={() => navigate("/profile")}
                className="mb-2"
              >
                <ArrowRight className="w-4 h-4 ml-2" />
                بازگشت به پروفایل
              </Button>
              <h1 className="text-4xl font-bold text-gray-900 text-right mb-2">
                آدرس‌های من
              </h1>
              <p className="text-gray-600 text-right">
                مدیریت آدرس‌های ارسال سفارش
              </p>
            </div>
            <Button
              onClick={() => {
                setEditingAddress(null);
                setFormData({
                  title: "",
                  fullName: "",
                  phone: "",
                  street: "",
                  city: "",
                  province: "",
                  postalCode: "",
                  isDefault: false,
                });
                setShowAddForm(true);
              }}
              className="bg-green-600 hover:bg-green-700"
            >
              <Plus className="w-4 h-4 ml-2" />
              افزودن آدرس
            </Button>
          </div>

          {/* Add/Edit Form */}
          {showAddForm && (
            <Card className="p-6 mb-8">
              <h3 className="text-lg font-bold text-right mb-4">
                {editingAddress ? "ویرایش آدرس" : "افزودن آدرس جدید"}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="عنوان آدرس (مثلا: خانه)"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                    required
                  />
                  <input
                    type="text"
                    placeholder="نام و نام خانوادگی گیرنده"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                    required
                  />
                  <input
                    type="text"
                    placeholder="شماره تماس"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                    required
                  />
                  <input
                    type="text"
                    placeholder="کد پستی"
                    value={formData.postalCode}
                    onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                    className="p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                    required
                  />
                  <input
                    type="text"
                    placeholder="استان"
                    value={formData.province}
                    onChange={(e) => setFormData({ ...formData, province: e.target.value })}
                    className="p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                    required
                  />
                  <input
                    type="text"
                    placeholder="شهر"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                    required
                  />
                </div>
                <textarea
                  placeholder="آدرس کامل"
                  value={formData.street}
                  onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 outline-none h-24"
                  required
                />
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isDefault}
                    onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <span className="text-gray-700">تنظیم به عنوان آدرس پیش‌فرض</span>
                </label>
                <div className="flex gap-3 justify-end">
                  <Button type="button" variant="outline" onClick={() => setShowAddForm(false)}>
                    لغو
                  </Button>
                  <Button type="submit" className="bg-green-600 hover:bg-green-700">
                    {editingAddress ? "به‌روزرسانی" : "ذخیره"}
                  </Button>
                </div>
              </form>
            </Card>
          )}

          {/* Addresses List */}
          {addresses.length === 0 ? (
            <Card className="p-12 text-center">
              <MapPin className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                هنوز آدرسی ثبت نکرده‌اید
              </h2>
              <p className="text-gray-600 mb-6">
                آدرس‌های خود را برای ارسال سریع‌تر سفارشات اضافه کنید
              </p>
            </Card>
          ) : (
            <div className="space-y-4">
              {addresses.map((address) => (
                <Card key={address.id} className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 text-right">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-bold text-gray-900">{address.title}</h3>
                        {address.isDefault && (
                          <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded-full flex items-center gap-1">
                            <Star className="w-3 h-3" />
                            پیش‌فرض
                          </span>
                        )}
                      </div>
                      <p className="text-gray-700 font-medium">{address.fullName}</p>
                      <p className="text-gray-600 mt-1">{address.street}</p>
                      <p className="text-gray-600">
                        {address.city} - {address.province} - کد پستی: {address.postalCode}
                      </p>
                      <p className="text-gray-600 mt-1">تلفن: {address.phone}</p>
                    </div>
                    <div className="flex flex-col gap-2">
                      {!address.isDefault && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleSetDefault(address.id)}
                          title="تنظیم به عنوان پیش‌فرض"
                        >
                          <Star className="w-4 h-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => startEdit(address)}
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(address.id)}
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  );
}
