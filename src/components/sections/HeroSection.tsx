import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Play } from "lucide-react";
import heroImage from "@/assets/hero-agriculture.jpg";

export function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="کشاورزی مدرن"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-l from-primary/95 via-primary/80 to-primary/60" />
      </div>

      {/* Animated Elements */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-accent/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-primary-foreground/10 rounded-full blur-3xl animate-float" />

      {/* Content */}
      <div className="container-arad relative z-10">
        <div className="max-w-2xl">
          <span className="inline-block px-4 py-2 bg-primary-foreground/10 backdrop-blur-sm rounded-full text-primary-foreground/90 text-sm font-medium mb-6 animate-fade-up">
            🌱 بیش از ۱۰ سال تجربه در صنعت کشاورزی
          </span>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground leading-tight mb-6 animate-fade-up" style={{ animationDelay: "0.1s" }}>
            آراد
            <br />
            <span className="text-accent">کشاورزی نوین</span>
            <br />
            در خدمت شما
          </h1>
          
          <p className="text-lg md:text-xl text-primary-foreground/80 leading-relaxed mb-8 animate-fade-up" style={{ animationDelay: "0.2s" }}>
            ارائه‌دهنده انواع نهال، بذر، کود، سم و تجهیزات کشاورزی با کیفیت برتر. 
            از ساخت گلخانه تا مشاوره تخصصی، همراه شما هستیم.
          </p>
          
          <div className="flex flex-wrap gap-4 animate-fade-up" style={{ animationDelay: "0.3s" }}>
            <Link to="/products">
              <Button variant="hero" size="xl">
                <span>مشاهده محصولات</span>
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <Button variant="outline-light" size="xl">
              <Play className="w-5 h-5" />
              <span>ویدیو معرفی</span>
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 mt-12 pt-8 border-t border-primary-foreground/20 animate-fade-up" style={{ animationDelay: "0.4s" }}>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-accent">۶۰۰+</div>
              <div className="text-sm text-primary-foreground/70">محصول متنوع</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-accent">۱۰+</div>
              <div className="text-sm text-primary-foreground/70">سال تجربه</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-accent">۵۰۰۰+</div>
              <div className="text-sm text-primary-foreground/70">مشتری راضی</div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-primary-foreground/60 animate-bounce">
        <span className="text-xs">اسکرول کنید</span>
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  );
}
