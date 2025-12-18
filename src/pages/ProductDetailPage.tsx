import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { PageLayout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/cards";
import {
  ChevronLeft,
  ChevronRight,
  Heart,
  Share2,
  ShoppingCart,
  Truck,
  Shield,
  Phone,
  Minus,
  Plus,
  Star,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface Product {
  id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  stock: number;
  unit: string;
  images: string[];
  category: {
    id: string;
    name: string;
    slug: string;
  };
}

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [isTogglingWishlist, setIsTogglingWishlist] = useState(false);

  useEffect(() => {
    if (id) {
      fetchProduct();
      checkWishlist();
    }
  }, [id]);

  const checkWishlist = async () => {
    const token = localStorage.getItem("token");
    if (!token || !id) return;

    try {
      const response = await fetch(`http://localhost:3000/api/wishlist/check/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setIsInWishlist(data.isInWishlist || false);
      }
    } catch (err) {
      // Ignore errors
    }
  };

  const toggleWishlist = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast({
        title: "خطا",
        description: "لطفا ابتدا وارد حساب کاربری شوید",
        variant: "destructive",
      });
      return;
    }

    if (!product) return;

    try {
      setIsTogglingWishlist(true);
      
      if (isInWishlist) {
        // Remove from wishlist
        const response = await fetch(`http://localhost:3000/api/wishlist/${product.id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.ok) {
          setIsInWishlist(false);
          toast({
            title: "موفق",
            description: "از لیست علاقه‌مندی‌ها حذف شد",
          });
        }
      } else {
        // Add to wishlist
        const response = await fetch("http://localhost:3000/api/wishlist/add", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ productId: product.id }),
        });
        if (response.ok) {
          setIsInWishlist(true);
          toast({
            title: "موفق",
            description: "به لیست علاقه‌مندی‌ها اضافه شد",
          });
        }
      }
    } catch (err) {
      toast({
        title: "خطا",
        description: "خطا در به‌روزرسانی لیست علاقه‌مندی‌ها",
        variant: "destructive",
      });
    } finally {
      setIsTogglingWishlist(false);
    }
  };

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:3000/api/products/${id}`);
      
      if (!response.ok) {
        throw new Error("Product not found");
      }

      const result = await response.json();
      
      if (result.success && result.data) {
        setProduct(result.data);
        // Fetch related products from same category
        fetchRelatedProducts(result.data.category?.slug);
      }
    } catch (error) {
      console.error("Error fetching product:", error);
      toast({
        title: "خطا",
        description: "محصول یافت نشد",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedProducts = async (categorySlug?: string) => {
    try {
      const response = await fetch(`http://localhost:3000/api/products?limit=4`);
      if (response.ok) {
        const result = await response.json();
        if (result.success && Array.isArray(result.data)) {
          const related = result.data
            .filter((p: any) => p.id !== id)
            .slice(0, 4)
            .map((p: any) => ({
              id: p.id,
              name: p.title,
              price: p.price,
              image: p.images?.[0] || "https://images.unsplash.com/photo-1560806887-1?w=400",
              category: p.category?.name || "بدون دسته",
              rating: 4.5,
              inStock: p.stock > 0,
            }));
          setRelatedProducts(related);
        }
      }
    } catch (error) {
      console.error("Error fetching related products:", error);
    }
  };

  const handleAddToCart = async () => {
    if (!product) return;

    try {
      setIsAddingToCart(true);
      const token = localStorage.getItem("token");
      let guestToken = localStorage.getItem("guestToken");
      
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      let cartUrl = "http://localhost:3000/api/cart";
      if (!token && guestToken) {
        cartUrl += `?guestToken=${guestToken}`;
      }

      const cartResponse = await fetch(cartUrl, {
        method: "GET",
        headers,
      });

      if (!cartResponse.ok) {
        throw new Error("Failed to get cart");
      }

      const cartData = await cartResponse.json();
      if (!cartData.success || !cartData.data) {
        throw new Error("Invalid cart response");
      }

      if (!token && cartData.data.guestToken && !guestToken) {
        guestToken = cartData.data.guestToken;
        localStorage.setItem("guestToken", guestToken as string);
      }

      const cartId = cartData.data.id;

      let addUrl = `http://localhost:3000/api/cart/${cartId}/items`;
      if (!token && guestToken) {
        addUrl += `?guestToken=${guestToken}`;
      }

      const addResponse = await fetch(addUrl, {
        method: "POST",
        headers,
        body: JSON.stringify({
          productId: product.id,
          quantity: quantity,
        }),
      });

      if (!addResponse.ok) {
        throw new Error("Failed to add to cart");
      }

      toast({
        title: "موفق",
        description: `${product.title} به سبد خرید اضافه شد`,
      });
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast({
        title: "خطا",
        description: "خطا در اضافه کردن به سبد خرید",
        variant: "destructive",
      });
    } finally {
      setIsAddingToCart(false);
    }
  };

  if (loading) {
    return (
      <PageLayout>
        <div className="container-arad py-16 flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
            <p className="text-muted-foreground">در حال بارگذاری...</p>
          </div>
        </div>
      </PageLayout>
    );
  }

  if (!product) {
    return (
      <PageLayout>
        <div className="container-arad py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">محصول یافت نشد</h1>
          <Button onClick={() => navigate("/products")}>بازگشت به محصولات</Button>
        </div>
      </PageLayout>
    );
  }

  const images = product.images.length > 0 
    ? product.images 
    : ["https://images.unsplash.com/photo-1560806887-1?w=800"];

  return (
    <PageLayout>
      <div className="container-arad py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
          <Link to="/" className="hover:text-primary">خانه</Link>
          <ChevronLeft className="w-4 h-4" />
          <Link to="/products" className="hover:text-primary">محصولات</Link>
          <ChevronLeft className="w-4 h-4" />
          <Link to={`/products/${product.category?.slug}`} className="hover:text-primary">
            {product.category?.name}
          </Link>
          <ChevronLeft className="w-4 h-4" />
          <span className="text-foreground">{product.title}</span>
        </div>

        {/* Product Section */}
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {/* Image Gallery */}
          <div>
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-muted mb-4">
              <img
                src={images[selectedImage]}
                alt={product.title}
                className="w-full h-full object-cover"
              />
              {images.length > 1 && (
                <>
                  <button
                    onClick={() => setSelectedImage((prev) => (prev === 0 ? images.length - 1 : prev - 1))}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-card/90 rounded-full flex items-center justify-center hover:bg-card transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setSelectedImage((prev) => (prev === images.length - 1 ? 0 : prev + 1))}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-card/90 rounded-full flex items-center justify-center hover:bg-card transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>
            {images.length > 1 && (
              <div className="flex gap-3">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={cn(
                      "w-20 h-20 rounded-xl overflow-hidden border-2 transition-colors",
                      selectedImage === index ? "border-primary" : "border-transparent hover:border-border"
                    )}
                  >
                    <img src={image} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
              <span className="px-2 py-1 bg-primary/10 text-primary rounded-md">
                {product.category?.name}
              </span>
            </div>

            <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              {product.title}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      "w-5 h-5",
                      i < 4 ? "text-accent fill-accent" : "text-muted-foreground/30"
                    )}
                  />
                ))}
                <span className="font-bold text-foreground mr-2">4.5</span>
              </div>
            </div>

            {/* Price */}
            <div className="bg-muted/50 rounded-xl p-4 mb-6">
              <div className="flex items-baseline gap-3 mb-2">
                <span className="text-3xl font-bold text-primary">
                  {product.price.toLocaleString("fa-IR")}
                </span>
                <span className="text-muted-foreground">تومان / {product.unit}</span>
              </div>
            </div>

            {/* Stock */}
            <div className="flex items-center gap-2 mb-6">
              <span className={cn(
                "w-3 h-3 rounded-full",
                product.stock > 0 ? "bg-green-500" : "bg-destructive"
              )} />
              <span className={product.stock > 0 ? "text-green-600" : "text-destructive"}>
                {product.stock > 0 ? `موجود (${product.stock} ${product.unit})` : "ناموجود"}
              </span>
            </div>

            {/* Quantity & Add to Cart */}
            <div className="flex flex-wrap gap-4 mb-8">
              <div className="flex items-center border border-border rounded-xl overflow-hidden">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-12 h-12 flex items-center justify-center hover:bg-muted transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-16 text-center font-bold">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                  className="w-12 h-12 flex items-center justify-center hover:bg-muted transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <Button 
                variant="forest" 
                size="lg" 
                className="flex-1"
                onClick={handleAddToCart}
                disabled={isAddingToCart || product.stock === 0}
              >
                {isAddingToCart ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <ShoppingCart className="w-5 h-5" />
                )}
                افزودن به سبد خرید
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                onClick={toggleWishlist}
                disabled={isTogglingWishlist}
                className={isInWishlist ? "text-red-500 border-red-500" : ""}
              >
                <Heart className={`w-5 h-5 ${isInWishlist ? "fill-red-500" : ""}`} />
              </Button>
              <Button variant="outline" size="lg">
                <Share2 className="w-5 h-5" />
              </Button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="flex flex-col items-center gap-2 p-4 bg-muted/50 rounded-xl text-center">
                <Truck className="w-6 h-6 text-primary" />
                <span className="text-sm font-medium">ارسال رایگان</span>
              </div>
              <div className="flex flex-col items-center gap-2 p-4 bg-muted/50 rounded-xl text-center">
                <Shield className="w-6 h-6 text-primary" />
                <span className="text-sm font-medium">ضمانت کیفیت</span>
              </div>
              <div className="flex flex-col items-center gap-2 p-4 bg-muted/50 rounded-xl text-center">
                <Phone className="w-6 h-6 text-primary" />
                <span className="text-sm font-medium">پشتیبانی</span>
              </div>
            </div>

            {/* Description */}
            <div className="prose prose-sm max-w-none">
              <h3 className="text-lg font-bold mb-2">توضیحات محصول</h3>
              <p className="text-muted-foreground leading-relaxed">
                {product.description}
              </p>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-8">محصولات مرتبط</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} {...p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </PageLayout>
  );
}
