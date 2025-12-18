import { ServiceCard } from "@/components/cards";

const services = [
  {
    title: "ساخت گلخانه",
    description: "طراحی و اجرای گلخانه‌های مدرن با استانداردهای روز دنیا",
    icon: "🏗️",
    href: "/services/greenhouse-construction",
    features: ["طراحی اختصاصی", "تجهیزات پیشرفته", "پشتیبانی کامل"],
  },
  {
    title: "مشاوره سازه کشاورزی",
    description: "مشاوره تخصصی برای ساخت و بهینه‌سازی سازه‌های کشاورزی",
    icon: "📋",
    href: "/services/consulting",
    features: ["تحلیل فنی", "برنامه‌ریزی مالی", "نظارت اجرایی"],
  },
  {
    title: "محوطه‌سازی و ویلاسازی",
    description: "طراحی و اجرای فضای سبز و ویلاهای باغی",
    icon: "🏡",
    href: "/services/landscaping",
    features: ["طراحی منظر", "اجرای فضای سبز", "نگهداری"],
  },
  {
    title: "مشاوره حقوقی اراضی",
    description: "خدمات حقوقی تخصصی برای اراضی کشاورزی",
    icon: "⚖️",
    href: "/services/legal",
    features: ["سند ملکی", "تغییر کاربری", "مشاوره قانونی"],
  },
  {
    title: "ابزارهای هوش مصنوعی",
    description: "استفاده از AI برای بهینه‌سازی کشاورزی",
    icon: "🤖",
    href: "/services/ai-tools",
    features: ["تحلیل داده", "پیش‌بینی محصول", "مدیریت هوشمند"],
  },
];

export function ServicesSection() {
  return (
    <section className="section-padding">
      <div className="container-arad">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1 bg-accent/20 text-accent-foreground rounded-full text-sm font-medium mb-4">
            خدمات ما
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            خدمات تخصصی آراد
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            از ساخت گلخانه تا مشاوره حقوقی، تمام خدمات مورد نیاز کشاورزی را ارائه می‌دهیم
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <ServiceCard key={service.href} {...service} />
          ))}
        </div>
      </div>
    </section>
  );
}
