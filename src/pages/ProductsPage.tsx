import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { PageLayout } from "@/components/layout";
import { ProductCard } from "@/components/cards";
import { Button } from "@/components/ui/button";
import { ChevronDown, Filter, Grid3X3, LayoutList, SlidersHorizontal, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

// Mock data for categories
const categoryData: Record<string, { title: string; description: string; icon: string }> = {
  seedlings: { title: "نهال", description: "انواع نهال میوه و درختان زینتی", icon: "🌱" },
  seeds: { title: "بذر", description: "بذرهای با کیفیت و پربار", icon: "🌾" },
  fertilizers: { title: "کود", description: "کودهای ارگانیک و شیمیایی", icon: "🧪" },
  pesticides: { title: "سم", description: "سموم و آفت‌کش‌های استاندارد", icon: "💧" },
  equipment: { title: "تجهیزات کشاورزی", description: "ادوات و ماشین‌آلات کشاورزی", icon: "🚜" },
  "greenhouse-equipment": { title: "تجهیزات گلخانه‌ای", description: "سیستم‌های گلخانه‌ای", icon: "🏡" },
  irrigation: { title: "سیستم‌های آبیاری", description: "سیستم‌های آبیاری هوشمند", icon: "💦" },
};

const sidebarCategories = [
  { name: "نهال", slug: "seedlings", subcategories: [
    { name: "نهال سیب", slug: "apple" },
    { name: "نهال گلابی", slug: "pear" },
    { name: "نهال زیتون", slug: "olive" },
  ]},
  { name: "بذر", slug: "seeds", subcategories: [
    { name: "بذر سبزیجات", slug: "vegetables" },
    { name: "بذر صیفی‌جات", slug: "summer-crops" },
  ]},
  { name: "کود", slug: "fertilizers", subcategories: [
    { name: "کود ارگانیک", slug: "organic" },
    { name: "کود شیمیایی", slug: "chemical" },
  ]},
  { name: "سم", slug: "pesticides", subcategories: [
    { name: "حشره‌کش", slug: "insecticide" },
    { name: "قارچ‌کش", slug: "fungicide" },
  ]},
];

// Mock products fallback
const mockProducts = Array.from({ length: 12 }, (_, i) => ({
  id: `${i + 1}`,
  name: `محصول نمونه ${i + 1}`,
  price: Math.floor(Math.random() * 2000000) + 100000,
  originalPrice: Math.random() > 0.5 ? Math.floor(Math.random() * 2500000) + 500000 : undefined,
  image: `https://images.unsplash.com/photo-${1560806887 + i}?w=400&h=400&fit=crop`,
  category: "محصولات کشاورزی",
  rating: Math.round((Math.random() * 2 + 3) * 10) / 10,
  inStock: Math.random() > 0.2,
}));

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  rating?: number;
  inStock?: boolean;
}


export default function ProductsPage() {
  const { category, subcategory } = useParams();
  const [expandedCategory, setExpandedCategory] = useState<string | null>(category || null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("newest");

  const currentCategory = category ? categoryData[category] : null;

  // Fetch products when category changes
  useEffect(() => {
    fetchProducts();
  }, [category]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      // Fetch a broader list so we can still render even if category filtering isn't supported server-side.
      const url = `http://localhost:3000/api/products?limit=50`;

      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }

      const result = await response.json();
      
      // API returns { success: true, data: [...products], pagination: {...} }
      if (result.success && Array.isArray(result.data)) {
        let fetchedProducts = result.data.map((p: any) => ({
          id: p.id,
          name: p.title || p.name,
          price: p.price,
          originalPrice: p.discountedPrice ? p.price : undefined,
          image: p.images?.[0] || "https://images.unsplash.com/photo-1560806887-1?w=400&h=400&fit=crop",
          category: p.category?.name || "بدون دسته",
          categorySlug: p.category?.slug,
          rating: p.rating || 4.5,
          inStock: p.stock > 0,
        }));

        if (category) {
          fetchedProducts = fetchedProducts.filter((p: any) => p.categorySlug === category);
        }

        setProducts(fetchedProducts.length > 0 ? fetchedProducts : mockProducts);
      } else {
        setProducts(mockProducts);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts(mockProducts);
    } finally {
      setLoading(false);
    }
  };

  const toggleCategory = (slug: string) => {
    setExpandedCategory((prev) => (prev === slug ? null : slug));
  };

  return (
    <PageLayout>
      {/* Hero Banner */}
      <section className="bg-gradient-hero text-primary-foreground py-12 md:py-16">
        <div className="container-arad">
          <div className="flex items-center gap-2 text-sm text-primary-foreground/70 mb-4">
            <Link to="/" className="hover:text-primary-foreground">خانه</Link>
            <span>/</span>
            <Link to="/products" className="hover:text-primary-foreground">محصولات</Link>
            {currentCategory && (
              <>
                <span>/</span>
                <span>{currentCategory.title}</span>
              </>
            )}
          </div>
          <div className="flex items-center gap-4">
            {currentCategory && (
              <span className="text-5xl">{currentCategory.icon}</span>
            )}
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                {currentCategory?.title || "همه محصولات"}
              </h1>
              <p className="text-primary-foreground/80">
                {currentCategory?.description || "مشاهده تمام محصولات آراد"}
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="container-arad py-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <aside className="hidden lg:block w-72 shrink-0">
            <div className="sticky top-24 bg-card rounded-2xl border border-border/50 overflow-hidden">
              <div className="p-4 border-b border-border bg-muted/50">
                <h3 className="font-bold text-foreground flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  دسته‌بندی‌ها
                </h3>
              </div>
              <nav className="p-2">
                {sidebarCategories.map((cat) => (
                  <div key={cat.slug}>
                    <div className="w-full flex items-center justify-between px-4 py-3 rounded-lg text-right transition-colors">
                      <Link
                        to={`/products/${cat.slug}`}
                        className={cn(
                          "flex-1 font-medium transition-colors",
                          category === cat.slug ? "text-primary" : "hover:text-primary"
                        )}
                      >
                        {cat.name}
                      </Link>
                      <button
                        onClick={() => toggleCategory(cat.slug)}
                        className="text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <ChevronDown
                          className={cn(
                            "w-4 h-4 transition-transform",
                            expandedCategory === cat.slug && "rotate-180"
                          )}
                        />
                      </button>
                    </div>
                    {expandedCategory === cat.slug && (
                      <div className="mr-4 mt-1 mb-2 space-y-1 border-r-2 border-border pr-4">
                        {cat.subcategories.map((sub) => (
                          <Link
                            key={sub.slug}
                            to={`/products/${cat.slug}/${sub.slug}`}
                            className={cn(
                              "block px-3 py-2 rounded-lg text-sm transition-colors",
                              subcategory === sub.slug
                                ? "bg-primary/10 text-primary font-medium"
                                : "text-muted-foreground hover:bg-muted hover:text-foreground"
                            )}
                          >
                            {sub.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </nav>
            </div>

            {/* Filters */}
            <div className="mt-6 bg-card rounded-2xl border border-border/50 p-4">
              <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4" />
                فیلترها
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-2 block">
                    محدوده قیمت
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="از"
                      className="flex-1 h-10 px-3 bg-muted rounded-lg text-sm border-none"
                    />
                    <input
                      type="number"
                      placeholder="تا"
                      className="flex-1 h-10 px-3 bg-muted rounded-lg text-sm border-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-2 block">
                    وضعیت موجودی
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="rounded border-border" />
                    <span className="text-sm">فقط موجود</span>
                  </label>
                </div>
                <Button variant="forest" className="w-full">
                  اعمال فیلتر
                </Button>
              </div>
            </div>
          </aside>

          {/* Products Grid */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-border">
              <span className="text-muted-foreground">
                <span className="font-bold text-foreground">{products.length}</span> محصول
              </span>
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="icon"
                  className="lg:hidden"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <Filter className="w-5 h-5" />
                </Button>
                <div className="hidden md:flex items-center gap-1 bg-muted rounded-lg p-1">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={cn(
                      "p-2 rounded-md transition-colors",
                      viewMode === "grid" ? "bg-card shadow-sm" : "hover:bg-card/50"
                    )}
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={cn(
                      "p-2 rounded-md transition-colors",
                      viewMode === "list" ? "bg-card shadow-sm" : "hover:bg-card/50"
                    )}
                  >
                    <LayoutList className="w-4 h-4" />
                  </button>
                </div>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="h-10 px-4 bg-muted rounded-lg border-none text-sm"
                >
                  <option value="newest">مرتب‌سازی: جدیدترین</option>
                  <option value="price-asc">ارزان‌ترین</option>
                  <option value="price-desc">گران‌ترین</option>
                  <option value="popular">پرفروش‌ترین</option>
                </select>
              </div>
            </div>

            {/* Products */}
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-green-600" />
              </div>
            ) : (
              <>
                <div
                  className={cn(
                    "grid gap-6",
                    viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3" : "grid-cols-1"
                  )}
                >
                  {products.length > 0 ? (
                    products.map((product) => <ProductCard key={product.id} {...product} />)
                  ) : (
                    <div className="col-span-full text-center py-12">
                      <p className="text-muted-foreground">محصولی یافت نشد</p>
                    </div>
                  )}
                </div>

                {/* Pagination */}
                {products.length > 0 && (
                  <div className="flex items-center justify-center gap-2 mt-12">
                    <Button variant="outline" size="icon">
                      <ChevronDown className="w-4 h-4 rotate-90" />
                    </Button>
                    {[1, 2, 3, 4, 5].map((page) => (
                      <Button
                        key={page}
                        variant={page === 1 ? "forest" : "outline"}
                        size="icon"
                      >
                        {page}
                      </Button>
                    ))}
                    <Button variant="outline" size="icon">
                      <ChevronDown className="w-4 h-4 -rotate-90" />
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
