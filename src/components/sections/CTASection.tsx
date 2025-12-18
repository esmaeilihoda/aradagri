import { Button } from "@/components/ui/button";
import { Phone, MessageCircle } from "lucide-react";

export function CTASection() {
  return (
    <section className="section-padding bg-gradient-to-br from-arad-forest to-arad-forest-dark text-primary-foreground relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-primary-foreground/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
      
      <div className="container-arad relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            آماده شروع همکاری هستید؟
          </h2>
          <p className="text-lg md:text-xl text-primary-foreground/80 mb-8">
            همین حالا با کارشناسان ما تماس بگیرید و از مشاوره رایگان بهره‌مند شوید
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button variant="hero" size="xl">
              <Phone className="w-5 h-5" />
              <span>۰۲۱-۱۲۳۴۵۶۷۸</span>
            </Button>
            <Button variant="outline-light" size="xl">
              <MessageCircle className="w-5 h-5" />
              <span>چت آنلاین</span>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
