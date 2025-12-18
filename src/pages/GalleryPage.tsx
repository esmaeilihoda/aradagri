import { useState } from "react";
import { PageLayout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { X, ChevronLeft, ChevronRight, Filter, Grid3X3, LayoutGrid } from "lucide-react";
import { cn } from "@/lib/utils";

const categories = [
  { label: "همه", value: "all" },
  { label: "گلخانه", value: "greenhouse" },
  { label: "کشاورزی", value: "farming" },
  { label: "تجهیزات", value: "equipment" },
  { label: "ساختمان", value: "construction" },
  { label: "محصولات", value: "products" },
];

// Mock gallery images
const galleryImages = Array.from({ length: 48 }, (_, i) => ({
  id: i + 1,
  src: `https://images.unsplash.com/photo-${1560806887 + i * 10000}-1e4cd0b6cbd6?w=800`,
  thumbnail: `https://images.unsplash.com/photo-${1560806887 + i * 10000}-1e4cd0b6cbd6?w=400`,
  title: `تصویر گالری ${i + 1}`,
  category: categories[Math.floor(Math.random() * (categories.length - 1)) + 1].value,
}));

export default function GalleryPage() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);
  const [columns, setColumns] = useState(4);

  const filteredImages = selectedCategory === "all"
    ? galleryImages
    : galleryImages.filter((img) => img.category === selectedCategory);

  const openLightbox = (index: number) => {
    setCurrentImage(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % filteredImages.length);
  };

  const prevImage = () => {
    setCurrentImage((prev) => (prev - 1 + filteredImages.length) % filteredImages.length);
  };

  return (
    <PageLayout>
      {/* Hero */}
      <section className="bg-gradient-hero text-primary-foreground py-16">
        <div className="container-arad">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">گالری تصاویر</h1>
          <p className="text-xl text-primary-foreground/80 max-w-2xl">
            مشاهده نمونه کارها، محصولات و پروژه‌های اجرا شده توسط تیم آراد
          </p>
        </div>
      </section>

      <div className="container-arad py-12">
        {/* Filters */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-6 border-b border-border">
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setSelectedCategory(cat.value)}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium transition-colors",
                  selectedCategory === cat.value
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                )}
              >
                {cat.label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground text-sm">{filteredImages.length} تصویر</span>
            <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
              {[3, 4, 5].map((col) => (
                <button
                  key={col}
                  onClick={() => setColumns(col)}
                  className={cn(
                    "p-2 rounded-md transition-colors",
                    columns === col ? "bg-card shadow-sm" : "hover:bg-card/50"
                  )}
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Gallery Grid */}
        <div
          className="grid gap-4"
          style={{
            gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
          }}
        >
          {filteredImages.map((image, index) => (
            <button
              key={image.id}
              onClick={() => openLightbox(index)}
              className="group relative aspect-square rounded-xl overflow-hidden bg-muted"
            >
              <img
                src={image.thumbnail}
                alt={image.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/40 transition-colors flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity text-primary-foreground text-center">
                  <span className="block text-sm font-medium">{image.title}</span>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-12">
          <Button variant="outline" size="lg">
            بارگذاری بیشتر
          </Button>
        </div>
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-50 bg-background/95 flex items-center justify-center">
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 w-12 h-12 rounded-full bg-card flex items-center justify-center hover:bg-muted transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          <button
            onClick={prevImage}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-card flex items-center justify-center hover:bg-muted transition-colors"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          <button
            onClick={nextImage}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-card flex items-center justify-center hover:bg-muted transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <div className="max-w-5xl max-h-[80vh] mx-4">
            <img
              src={filteredImages[currentImage].src}
              alt={filteredImages[currentImage].title}
              className="max-w-full max-h-[80vh] object-contain rounded-xl"
            />
            <div className="text-center mt-4">
              <h3 className="text-lg font-medium">{filteredImages[currentImage].title}</h3>
              <span className="text-muted-foreground">
                {currentImage + 1} / {filteredImages.length}
              </span>
            </div>
          </div>
        </div>
      )}
    </PageLayout>
  );
}
