import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PageLayout } from "@/components/layout/PageLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Plus, Edit2, Trash2, ShieldAlert } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { API_BASE_URL } from "@/lib/api-config";

interface Product {
  id: string;
  title: string;
  slug: string;
  price: number;
  stock: number;
  category: { name: string };
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface Order {
  id: string;
  status: string;
  total: number;
  createdAt: string;
  user?: { name: string; email: string };
  items: Array<{ quantity: number; product: { title: string } }>;
}

export default function AdminPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, isLoggedIn } = useAuth();
  
  const [activeTab, setActiveTab] = useState<"products" | "categories" | "orders">("products");
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newProduct, setNewProduct] = useState({
    title: "",
    slug: "",
    price: 0,
    stock: 0,
    categoryId: "",
    description: "",
  });
  const [newCategory, setNewCategory] = useState({
    name: "",
    slug: "",
    description: "",
  });

  // Check if user is admin
  const isAdmin = isLoggedIn && user?.role === "ADMIN";

  useEffect(() => {
    loadData();
  }, [activeTab]);

  // Always load categories for the product dropdown
  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const token = localStorage.getItem("token");
      const headers: Record<string, string> = {};
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const resp = await fetch("${API_BASE_URL}/categories", { headers });
      if (resp.ok) {
        const data = await resp.json();
        if (data.success && data.data) {
          setCategories(data.data);
        }
      }
    } catch (error) {
      console.error("Error loading categories:", error);
    }
  };

  const loadData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const headers: Record<string, string> = {};

      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      if (activeTab === "products") {
        const resp = await fetch("${API_BASE_URL}/products", { headers });
        if (resp.ok) {
          const data = await resp.json();
          if (data.success && data.data) {
            setProducts(data.data);
          }
        }
      } else if (activeTab === "categories") {
        await loadCategories();
      } else if (activeTab === "orders") {
        const resp = await fetch("${API_BASE_URL}/orders/admin/all", { headers });
        if (resp.ok) {
          const data = await resp.json();
          if (data.success && data.data) {
            setOrders(data.data);
          }
        }
      }
    } catch (error) {
      console.error("Error loading data:", error);
      toast({
        title: "خطا",
        description: "خطا در بارگذاری اطلاعات",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = async () => {
    if (!newProduct.title || !newProduct.slug || !newProduct.categoryId) {
      toast({
        title: "خطا",
        description: "لطفا تمامی فیلدهای الزامی را پر کنید",
        variant: "destructive",
      });
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      };

      const response = await fetch("${API_BASE_URL}/products", {
        method: "POST",
        headers,
        body: JSON.stringify({
          ...newProduct,
          images: ["https://images.unsplash.com/photo-1560806887-1?w=400&h=400&fit=crop"],
        }),
      });

      if (response.ok) {
        toast({
          title: "موفق",
          description: "محصول اضافه شد",
        });
        setNewProduct({ title: "", slug: "", price: 0, stock: 0, categoryId: "", description: "" });
        setShowAddProduct(false);
        loadData();
      }
    } catch (error) {
      toast({
        title: "خطا",
        description: "خطا در اضافه کردن محصول",
        variant: "destructive",
      });
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!window.confirm("آیا از حذف این محصول مطمئنید؟")) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/products/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        toast({
          title: "موفق",
          description: "محصول حذف شد",
        });
        loadData();
      }
    } catch (error) {
      toast({
        title: "خطا",
        description: "خطا در حذف محصول",
        variant: "destructive",
      });
    }
  };

  const handleAddCategory = async () => {
    if (!newCategory.name || !newCategory.slug) {
      toast({
        title: "خطا",
        description: "لطفا نام و شناسه دسته‌بندی را وارد کنید",
        variant: "destructive",
      });
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("${API_BASE_URL}/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(newCategory),
      });

      if (response.ok) {
        toast({
          title: "موفق",
          description: "دسته‌بندی اضافه شد",
        });
        setNewCategory({ name: "", slug: "", description: "" });
        setShowAddCategory(false);
        loadCategories();
      } else {
        const err = await response.json();
        toast({
          title: "خطا",
          description: err.message || "خطا در اضافه کردن دسته‌بندی",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "خطا",
        description: "خطا در اضافه کردن دسته‌بندی",
        variant: "destructive",
      });
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!window.confirm("آیا از حذف این دسته‌بندی مطمئنید؟")) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        toast({
          title: "موفق",
          description: "دسته‌بندی حذف شد",
        });
        loadCategories();
      } else {
        const err = await response.json();
        toast({
          title: "خطا",
          description: err.message || "خطا در حذف دسته‌بندی",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "خطا",
        description: "خطا در حذف دسته‌بندی",
        variant: "destructive",
      });
    }
  };

  // Access denied for non-admin users
  if (!isAdmin) {
    return (
      <PageLayout>
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-12" dir="rtl">
          <div className="container-arad max-w-lg">
            <Card className="p-12 text-center">
              <ShieldAlert className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">دسترسی محدود</h2>
              <p className="text-gray-600 mb-6">
                شما دسترسی به پنل مدیریت را ندارید. لطفا با حساب مدیر وارد شوید.
              </p>
              <div className="flex gap-4 justify-center">
                <Button onClick={() => navigate("/login")} className="bg-green-600 hover:bg-green-700">
                  ورود به حساب
                </Button>
                <Button variant="outline" onClick={() => navigate("/")}>
                  بازگشت به خانه
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </PageLayout>
    );
  }

  if (loading) {
    return (
      <PageLayout>
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-12" dir="rtl">
          <div className="container-arad max-w-6xl">
            <Card className="p-12 text-center">
              <Loader2 className="w-8 h-8 animate-spin text-green-600 mx-auto mb-4" />
              <p className="text-muted-foreground">در حال بارگذاری...</p>
            </Card>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-12" dir="rtl">
        <div className="container-arad max-w-6xl">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 text-right mb-2">پنل مدیریت</h1>
            <p className="text-gray-600 text-right">مدیریت محصولات، دسته‌بندی‌ها و سفارشات</p>
          </div>

          {/* Tabs */}
          <div className="flex gap-4 mb-8 border-b border-gray-200">
            {["products", "categories", "orders"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={cn(
                  "px-4 py-3 font-medium transition-colors border-b-2",
                  activeTab === tab
                    ? "border-green-600 text-green-600"
                    : "border-transparent text-gray-600 hover:text-gray-900"
                )}
              >
                {tab === "products" && "محصولات"}
                {tab === "categories" && "دسته‌بندی‌ها"}
                {tab === "orders" && "سفارشات"}
              </button>
            ))}
          </div>

          {/* Products Tab */}
          {activeTab === "products" && (
            <div>
              <div className="mb-6 flex justify-end">
                <Button
                  onClick={() => setShowAddProduct(!showAddProduct)}
                  className="bg-green-600 hover:bg-green-700 flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  افزودن محصول
                </Button>
              </div>

              {showAddProduct && (
                <Card className="p-6 mb-6">
                  <h3 className="text-lg font-bold text-right mb-4">افزودن محصول جدید</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="نام محصول"
                      value={newProduct.title}
                      onChange={(e) => setNewProduct({ ...newProduct, title: e.target.value })}
                      className="p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                    />
                    <input
                      type="text"
                      placeholder="شناسه (slug)"
                      value={newProduct.slug}
                      onChange={(e) => setNewProduct({ ...newProduct, slug: e.target.value })}
                      className="p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                    />
                    <input
                      type="number"
                      placeholder="قیمت"
                      value={newProduct.price}
                      onChange={(e) => setNewProduct({ ...newProduct, price: Number(e.target.value) })}
                      className="p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                    />
                    <input
                      type="number"
                      placeholder="موجودی"
                      value={newProduct.stock}
                      onChange={(e) => setNewProduct({ ...newProduct, stock: Number(e.target.value) })}
                      className="p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                    />
                    <select
                      value={newProduct.categoryId}
                      onChange={(e) => setNewProduct({ ...newProduct, categoryId: e.target.value })}
                      className="p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 outline-none md:col-span-2"
                    >
                      <option value="">انتخاب دسته‌بندی</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                    <textarea
                      placeholder="توضیح محصول"
                      value={newProduct.description}
                      onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                      className="p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 outline-none md:col-span-2 h-24"
                    />
                  </div>
                  <div className="flex gap-2 mt-4 justify-end">
                    <Button variant="outline" onClick={() => setShowAddProduct(false)}>
                      لغو
                    </Button>
                    <Button onClick={handleAddProduct} className="bg-green-600 hover:bg-green-700">
                      ذخیره
                    </Button>
                  </div>
                </Card>
              )}

              <div className="grid gap-4">
                {products.map((product) => (
                  <Card key={product.id} className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="font-bold text-gray-900">{product.title}</h4>
                        <p className="text-sm text-gray-600">
                          {product.category.name} • {product.stock} موجودی
                        </p>
                        <p className="text-lg font-semibold text-green-600 mt-1">
                          {product.price.toLocaleString("fa-IR")} تومان
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="icon">
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteProduct(product.id)}
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Categories Tab */}
          {activeTab === "categories" && (
            <div>
              <div className="mb-6 flex justify-end">
                <Button
                  onClick={() => setShowAddCategory(!showAddCategory)}
                  className="bg-green-600 hover:bg-green-700 flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  افزودن دسته‌بندی
                </Button>
              </div>

              {showAddCategory && (
                <Card className="p-6 mb-6">
                  <h3 className="text-lg font-bold text-right mb-4">افزودن دسته‌بندی جدید</h3>
                  <div className="space-y-4">
                    <input
                      type="text"
                      placeholder="نام دسته‌بندی"
                      value={newCategory.name}
                      onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                      className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                    />
                    <input
                      type="text"
                      placeholder="شناسه (slug)"
                      value={newCategory.slug}
                      onChange={(e) => setNewCategory({ ...newCategory, slug: e.target.value })}
                      className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                    />
                  </div>
                  <div className="flex gap-2 mt-4 justify-end">
                    <Button variant="outline" onClick={() => setShowAddCategory(false)}>
                      لغو
                    </Button>
                    <Button onClick={handleAddCategory} className="bg-green-600 hover:bg-green-700">
                      ذخیره
                    </Button>
                  </div>
                </Card>
              )}

              <div className="grid gap-4 md:grid-cols-2">
                {categories.map((cat) => (
                  <Card key={cat.id} className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-bold text-gray-900">{cat.name}</h4>
                        <p className="text-sm text-gray-600">{cat.slug}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="icon">
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleDeleteCategory(cat.id)}
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Orders Tab */}
          {activeTab === "orders" && (
            <div>
              {orders.length === 0 ? (
                <Card className="p-12 text-center">
                  <p className="text-gray-600 mb-4">هیچ سفارشی وجود ندارد</p>
                </Card>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <Card key={order.id} className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-4 mb-2">
                            <h4 className="font-bold text-gray-900">سفارش #{order.id.slice(-6)}</h4>
                            <span className={cn(
                              "px-2 py-1 text-xs rounded-full",
                              order.status === "PENDING" && "bg-yellow-100 text-yellow-700",
                              order.status === "PROCESSING" && "bg-blue-100 text-blue-700",
                              order.status === "COMPLETED" && "bg-green-100 text-green-700",
                              order.status === "CANCELLED" && "bg-red-100 text-red-700"
                            )}>
                              {order.status === "PENDING" && "در انتظار"}
                              {order.status === "PROCESSING" && "در حال پردازش"}
                              {order.status === "COMPLETED" && "تکمیل شده"}
                              {order.status === "CANCELLED" && "لغو شده"}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600">
                            {order.user?.name || "کاربر مهمان"} • {order.items?.length || 0} آیتم
                          </p>
                          <p className="text-sm text-gray-500">
                            {new Date(order.createdAt).toLocaleDateString("fa-IR")}
                          </p>
                        </div>
                        <div className="text-left">
                          <p className="text-lg font-bold text-green-600">
                            {order.total?.toLocaleString("fa-IR") || "---"} تومان
                          </p>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  );
}
