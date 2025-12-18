import { CategoryCard } from "@/components/cards";

const categories = [
  {
    title: "نهال",
    description: "انواع نهال میوه و درختان",
    icon: "🌱",
    href: "/products/seedlings",
  },
  {
    title: "بذر",
    description: "بذرهای با کیفیت",
    icon: "🌾",
    href: "/products/seeds",
  },
  {
    title: "کود",
    description: "کودهای ارگانیک و شیمیایی",
    icon: "🧪",
    href: "/products/fertilizers",
  },
  {
    title: "سم",
    description: "سموم و آفت‌کش‌ها",
    icon: "💧",
    href: "/products/pesticides",
  },
  {
    title: "تجهیزات کشاورزی",
    description: "ادوات و ماشین‌آلات",
    icon: "🚜",
    href: "/products/equipment",
  },
  {
    title: "تجهیزات گلخانه",
    description: "سیستم‌های گلخانه‌ای",
    icon: "🏡",
    href: "/products/greenhouse-equipment",
  },
  {
    title: "سیستم آبیاری",
    description: "آبیاری هوشمند",
    icon: "💦",
    href: "/products/irrigation",
  },
];

export function CategoriesSection() {
  return (
    <section className="section-padding bg-gradient-section">
      <div className="container-arad">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
            دسته‌بندی‌ها
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            محصولات ما
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            با بیش از ۶۰۰ محصول متنوع در دسته‌بندی‌های مختلف، تمام نیازهای کشاورزی شما را تأمین می‌کنیم
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {categories.map((category) => (
            <CategoryCard key={category.href} {...category} />
          ))}
        </div>
      </div>
    </section>
  );
}
