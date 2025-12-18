import { Link } from "react-router-dom";
import { PageLayout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Award, Users, Leaf, Target, ArrowLeft } from "lucide-react";

const stats = [
  { value: "۱۰+", label: "سال تجربه" },
  { value: "۵۰۰۰+", label: "مشتری راضی" },
  { value: "۶۰۰+", label: "محصول" },
  { value: "۲۴/۷", label: "پشتیبانی" },
];

const values = [
  {
    icon: Leaf,
    title: "کشاورزی پایدار",
    description: "ما به کشاورزی پایدار و حفظ محیط زیست متعهد هستیم و محصولاتی ارائه می‌دهیم که با طبیعت سازگار باشند.",
  },
  {
    icon: Award,
    title: "کیفیت برتر",
    description: "تمام محصولات ما دارای گواهینامه‌های معتبر هستند و تحت نظارت دقیق کنترل کیفیت قرار می‌گیرند.",
  },
  {
    icon: Users,
    title: "مشتری‌مداری",
    description: "رضایت مشتری اولویت اول ماست. تیم پشتیبانی ما همیشه آماده پاسخگویی به سوالات شماست.",
  },
  {
    icon: Target,
    title: "نوآوری",
    description: "با استفاده از جدیدترین فناوری‌ها، راهکارهای نوین کشاورزی را به شما ارائه می‌دهیم.",
  },
];

const timeline = [
  { year: "۱۳۹۲", title: "تأسیس آراد", description: "شروع فعالیت با فروش نهال و بذر" },
  { year: "۱۳۹۵", title: "گسترش محصولات", description: "افزودن کود و سموم به سبد محصولات" },
  { year: "۱۳۹۸", title: "خدمات گلخانه", description: "آغاز خدمات ساخت گلخانه" },
  { year: "۱۴۰۰", title: "هوش مصنوعی", description: "راه‌اندازی ابزارهای AI کشاورزی" },
  { year: "۱۴۰۳", title: "امروز", description: "پیشرو در صنعت کشاورزی ایران" },
];

export default function AboutPage() {
  return (
    <PageLayout>
      {/* Hero */}
      <section className="relative py-20 bg-gradient-hero text-primary-foreground overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 right-20 w-72 h-72 bg-primary-foreground rounded-full blur-3xl" />
          <div className="absolute bottom-20 left-20 w-96 h-96 bg-accent rounded-full blur-3xl" />
        </div>
        <div className="container-arad relative z-10">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            درباره آراد
          </h1>
          <p className="text-xl md:text-2xl text-primary-foreground/80 max-w-3xl leading-relaxed">
            بیش از یک دهه تجربه در ارائه محصولات و خدمات کشاورزی با کیفیت. 
            ما آینده کشاورزی ایران را می‌سازیم.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-card border-b border-border">
        <div className="container-arad">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-primary mb-2">{stat.value}</div>
                <div className="text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="section-padding">
        <div className="container-arad">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block px-4 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
                داستان ما
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                از یک رویا تا واقعیت
              </h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  آراد در سال ۱۳۹۲ با هدف ارتقای سطح کشاورزی ایران تأسیس شد. ما از یک فروشگاه کوچک نهال شروع کردیم و امروز به یکی از بزرگترین مراکز ارائه محصولات و خدمات کشاورزی تبدیل شده‌ایم.
                </p>
                <p>
                  تیم ما متشکل از متخصصان باتجربه کشاورزی است که با عشق به طبیعت و تعهد به کیفیت، بهترین محصولات را انتخاب و ارائه می‌کنند.
                </p>
                <p>
                  ما باور داریم که کشاورزی مدرن می‌تواند هم سودآور و هم پایدار باشد. به همین دلیل، همواره در پی ارائه راهکارهای نوین و سازگار با محیط زیست هستیم.
                </p>
              </div>
              <Link to="/products" className="inline-block mt-6">
                <Button variant="forest" size="lg" className="group">
                  مشاهده محصولات
                  <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800"
                alt="تیم آراد"
                className="rounded-2xl shadow-arad-lg"
              />
              <div className="absolute -bottom-6 -right-6 bg-primary text-primary-foreground rounded-2xl p-6 shadow-arad-lg">
                <div className="text-4xl font-bold">۱۰+</div>
                <div className="text-sm text-primary-foreground/80">سال تجربه</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section-padding bg-muted/50">
        <div className="container-arad">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1 bg-accent/20 text-accent-foreground rounded-full text-sm font-medium mb-4">
              ارزش‌های ما
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              آنچه ما را متفاوت می‌کند
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <div
                key={index}
                className="bg-card rounded-2xl p-6 border border-border/50 shadow-arad-sm hover:shadow-arad-md transition-shadow"
              >
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <value.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">{value.title}</h3>
                <p className="text-muted-foreground text-sm">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="section-padding">
        <div className="container-arad">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
              مسیر ما
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              تاریخچه آراد
            </h2>
          </div>
          <div className="relative">
            <div className="absolute right-1/2 top-0 bottom-0 w-0.5 bg-border hidden md:block" />
            <div className="space-y-8">
              {timeline.map((item, index) => (
                <div
                  key={index}
                  className={`flex items-center gap-8 ${index % 2 === 0 ? "md:flex-row-reverse" : ""}`}
                >
                  <div className="flex-1 hidden md:block" />
                  <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold shrink-0 relative z-10">
                    {item.year}
                  </div>
                  <div className="flex-1 bg-card rounded-xl p-6 border border-border/50">
                    <h3 className="font-bold text-foreground mb-1">{item.title}</h3>
                    <p className="text-muted-foreground text-sm">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-primary text-primary-foreground">
        <div className="container-arad text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            آماده همکاری با ما هستید؟
          </h2>
          <p className="text-xl text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
            با ما تماس بگیرید و از مشاوره رایگان بهره‌مند شوید
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/contact">
              <Button variant="hero" size="xl">تماس با ما</Button>
            </Link>
            <Link to="/products">
              <Button variant="outline-light" size="xl">مشاهده محصولات</Button>
            </Link>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
