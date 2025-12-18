import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, BarChart3, MessageCircle, Brain } from "lucide-react";

const insights = [
  {
    icon: BarChart3,
    title: "آنالیز رفتار مشتری",
    description: "تحلیل داده‌های خرید و ترجیحات مشتریان برای بهبود خدمات",
    href: "/content/analytics",
  },
  {
    icon: MessageCircle,
    title: "پیشنهادها و مشاوره",
    description: "دریافت پیشنهادات شخصی‌سازی شده و مشاوره آنلاین",
    href: "/content/suggestions",
  },
  {
    icon: Brain,
    title: "هوش مصنوعی کشاورزی",
    description: "استفاده از AI برای پیش‌بینی و بهینه‌سازی تولید",
    href: "/services/ai-tools",
  },
];

export function InsightsSection() {
  return (
    <section className="section-padding">
      <div className="container-arad">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1 bg-accent/20 text-accent-foreground rounded-full text-sm font-medium mb-4">
            داده‌محور
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            بینش‌های هوشمند
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            با استفاده از تحلیل داده و هوش مصنوعی، بهترین تصمیمات کشاورزی را بگیرید
          </p>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {insights.map((insight, index) => (
            <div
              key={index}
              className="group relative bg-card rounded-2xl p-8 shadow-arad-sm hover:shadow-arad-lg transition-all duration-300 border border-border/50 overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="relative">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <insight.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">{insight.title}</h3>
                <p className="text-muted-foreground mb-6">{insight.description}</p>
                <Link to={insight.href}>
                  <Button variant="ghost" className="group/btn p-0 h-auto font-medium text-primary">
                    <span>اطلاعات بیشتر</span>
                    <ArrowLeft className="w-4 h-4 mr-2 group-hover/btn:-translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
