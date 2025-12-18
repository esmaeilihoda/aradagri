import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileCheck } from "lucide-react";

const certificates = [
  { title: "گواهی استاندارد ملی", year: "۱۴۰۲" },
  { title: "گواهی ISO 9001", year: "۱۴۰۱" },
  { title: "گواهی کشاورزی ارگانیک", year: "۱۴۰۲" },
  { title: "مجوز وزارت جهاد کشاورزی", year: "۱۴۰۰" },
];

export function CertificatesSection() {
  return (
    <section className="section-padding bg-primary text-primary-foreground">
      <div className="container-arad">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div>
            <span className="inline-block px-4 py-1 bg-primary-foreground/10 rounded-full text-sm font-medium mb-4">
              اعتبار و اعتماد
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              گواهینامه‌ها و افتخارات
            </h2>
            <p className="text-primary-foreground/80 leading-relaxed mb-8">
              آراد با دریافت گواهینامه‌های معتبر ملی و بین‌المللی، کیفیت محصولات و خدمات خود را تضمین می‌کند. 
              ما متعهد به رعایت استانداردهای کشاورزی پایدار و ارائه محصولات سالم هستیم.
            </p>
            <Link to="/certificates">
              <Button variant="outline-light" size="lg" className="group">
                <span>مشاهده گواهینامه‌ها</span>
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>

          {/* Certificates Grid */}
          <div className="grid grid-cols-2 gap-4">
            {certificates.map((cert, index) => (
              <div
                key={index}
                className="bg-primary-foreground/10 backdrop-blur-sm rounded-2xl p-6 border border-primary-foreground/20 hover:bg-primary-foreground/15 transition-colors"
              >
                <FileCheck className="w-10 h-10 text-accent mb-4" />
                <h3 className="font-bold mb-1">{cert.title}</h3>
                <span className="text-sm text-primary-foreground/60">صادر شده: {cert.year}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
