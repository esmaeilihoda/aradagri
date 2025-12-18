import { Link, useParams } from "react-router-dom";
import { PageLayout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle, Phone, MessageCircle } from "lucide-react";

const servicesData: Record<string, {
  title: string;
  description: string;
  icon: string;
  heroImage: string;
  overview: string;
  steps: { title: string; description: string }[];
  benefits: { icon: string; title: string; description: string }[];
  gallery: string[];
}> = {
  "greenhouse-construction": {
    title: "ساخت گلخانه",
    description: "طراحی و اجرای گلخانه‌های مدرن با استانداردهای روز دنیا",
    icon: "🏗️",
    heroImage: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=1200",
    overview: "تیم متخصص آراد با بیش از یک دهه تجربه در صنعت گلخانه، آماده طراحی و اجرای گلخانه‌های مدرن برای شماست. از گلخانه‌های کوچک خانگی تا پروژه‌های صنعتی بزرگ، ما همراه شما هستیم.",
    steps: [
      { title: "مشاوره اولیه", description: "بررسی نیازها و شرایط زمین شما" },
      { title: "طراحی اختصاصی", description: "طراحی سازه و سیستم‌ها متناسب با پروژه" },
      { title: "برآورد هزینه", description: "ارائه پیش‌فاکتور شفاف و جامع" },
      { title: "اجرای پروژه", description: "ساخت و نصب توسط تیم متخصص" },
      { title: "تحویل و آموزش", description: "تحویل پروژه و آموزش بهره‌برداری" },
    ],
    benefits: [
      { icon: "⚡", title: "اجرای سریع", description: "تحویل پروژه در کوتاه‌ترین زمان ممکن" },
      { icon: "🎯", title: "کیفیت برتر", description: "استفاده از بهترین متریال و تجهیزات" },
      { icon: "💰", title: "قیمت رقابتی", description: "بهترین نسبت کیفیت به قیمت" },
      { icon: "🛠️", title: "پشتیبانی کامل", description: "خدمات پس از فروش و نگهداری" },
    ],
    gallery: [
      "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=600",
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600",
      "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600",
    ],
  },
  consulting: {
    title: "مشاوره سازه کشاورزی",
    description: "مشاوره تخصصی برای ساخت و بهینه‌سازی سازه‌های کشاورزی",
    icon: "📋",
    heroImage: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200",
    overview: "با بهره‌گیری از دانش و تجربه متخصصین ما، بهترین تصمیمات را برای پروژه‌های کشاورزی خود بگیرید.",
    steps: [
      { title: "درخواست مشاوره", description: "ثبت درخواست و توضیح پروژه" },
      { title: "بازدید از محل", description: "بازدید کارشناسی از محل پروژه" },
      { title: "تحلیل و بررسی", description: "بررسی فنی و اقتصادی پروژه" },
      { title: "ارائه راهکار", description: "پیشنهاد بهترین راهکارها" },
    ],
    benefits: [
      { icon: "📊", title: "تحلیل جامع", description: "بررسی همه‌جانبه پروژه" },
      { icon: "👨‍🔬", title: "تیم متخصص", description: "مشاوره توسط کارشناسان مجرب" },
      { icon: "📈", title: "بهینه‌سازی", description: "افزایش بهره‌وری و کاهش هزینه" },
      { icon: "🎓", title: "آموزش", description: "انتقال دانش و تجربه" },
    ],
    gallery: [],
  },
  landscaping: {
    title: "محوطه‌سازی و ویلاسازی",
    description: "طراحی و اجرای فضای سبز و ویلاهای باغی",
    icon: "🏡",
    heroImage: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200",
    overview: "خلق فضاهای سبز زیبا و کاربردی برای ویلاها و باغات. از طراحی منظر تا اجرای کامل پروژه.",
    steps: [
      { title: "طراحی منظر", description: "طراحی سه‌بعدی فضای سبز" },
      { title: "انتخاب گیاهان", description: "انتخاب گونه‌های مناسب" },
      { title: "اجرای پروژه", description: "کاشت و محوطه‌سازی" },
      { title: "نگهداری", description: "برنامه نگهداری و مراقبت" },
    ],
    benefits: [
      { icon: "🎨", title: "طراحی خلاقانه", description: "فضاهای منحصر به فرد" },
      { icon: "🌿", title: "گیاهان بومی", description: "استفاده از گونه‌های سازگار" },
      { icon: "💧", title: "آبیاری هوشمند", description: "سیستم‌های صرفه‌جو" },
      { icon: "🏆", title: "کیفیت اجرا", description: "استانداردهای بالا" },
    ],
    gallery: [],
  },
  legal: {
    title: "مشاوره حقوقی اراضی",
    description: "خدمات حقوقی تخصصی برای اراضی کشاورزی",
    icon: "⚖️",
    heroImage: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1200",
    overview: "خدمات حقوقی جامع برای اراضی کشاورزی شامل سند ملکی، تغییر کاربری، و مشاوره قانونی.",
    steps: [
      { title: "مشاوره اولیه", description: "بررسی وضعیت حقوقی ملک" },
      { title: "جمع‌آوری مدارک", description: "تکمیل پرونده" },
      { title: "پیگیری قانونی", description: "انجام امور اداری" },
      { title: "تحویل سند", description: "دریافت مدارک نهایی" },
    ],
    benefits: [
      { icon: "📜", title: "تجربه حقوقی", description: "تیم وکلای متخصص" },
      { icon: "⏱️", title: "سرعت عمل", description: "پیگیری مستمر پرونده" },
      { icon: "🔒", title: "امنیت", description: "حفظ محرمانگی اطلاعات" },
      { icon: "✅", title: "موفقیت", description: "درصد موفقیت بالا" },
    ],
    gallery: [],
  },
  "ai-tools": {
    title: "ابزارهای هوش مصنوعی",
    description: "استفاده از AI برای بهینه‌سازی کشاورزی",
    icon: "🤖",
    heroImage: "https://images.unsplash.com/photo-1535378620166-273708d44e4c?w=1200",
    overview: "با استفاده از فناوری‌های هوش مصنوعی، کشاورزی خود را هوشمند کنید و بهره‌وری را افزایش دهید.",
    steps: [
      { title: "نصب سنسورها", description: "جمع‌آوری داده‌های محیطی" },
      { title: "تحلیل داده", description: "پردازش با الگوریتم‌های AI" },
      { title: "پیش‌بینی", description: "پیش‌بینی محصول و بیماری" },
      { title: "بهینه‌سازی", description: "توصیه‌های عملیاتی" },
    ],
    benefits: [
      { icon: "📈", title: "افزایش بهره‌وری", description: "تا ۳۰٪ افزایش محصول" },
      { icon: "💧", title: "صرفه‌جویی آب", description: "مدیریت هوشمند آبیاری" },
      { icon: "🦠", title: "کنترل آفات", description: "تشخیص زودهنگام" },
      { icon: "📱", title: "مدیریت آسان", description: "اپلیکیشن موبایل" },
    ],
    gallery: [],
  },
};

export default function ServicePage() {
  const { slug } = useParams();
  const service = slug ? servicesData[slug] : null;

  if (!service) {
    return (
      <PageLayout>
        <div className="container-arad py-20 text-center">
          <h1 className="text-3xl font-bold mb-4">خدمت یافت نشد</h1>
          <Link to="/services">
            <Button>بازگشت به خدمات</Button>
          </Link>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      {/* Hero */}
      <section className="relative min-h-[50vh] flex items-center">
        <div className="absolute inset-0">
          <img src={service.heroImage} alt={service.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-l from-primary/95 via-primary/85 to-primary/70" />
        </div>
        <div className="container-arad relative z-10 py-16">
          <div className="flex items-center gap-2 text-sm text-primary-foreground/70 mb-4">
            <Link to="/" className="hover:text-primary-foreground">خانه</Link>
            <span>/</span>
            <Link to="/services" className="hover:text-primary-foreground">خدمات</Link>
            <span>/</span>
            <span className="text-primary-foreground">{service.title}</span>
          </div>
          <div className="flex items-center gap-4 mb-6">
            <span className="text-6xl">{service.icon}</span>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-2">
                {service.title}
              </h1>
              <p className="text-xl text-primary-foreground/80">{service.description}</p>
            </div>
          </div>
          <div className="flex gap-4 mt-8">
            <Button variant="hero" size="xl">
              <Phone className="w-5 h-5" />
              درخواست مشاوره
            </Button>
            <Button variant="outline-light" size="xl">
              <MessageCircle className="w-5 h-5" />
              چت آنلاین
            </Button>
          </div>
        </div>
      </section>

      {/* Overview */}
      <section className="section-padding">
        <div className="container-arad">
          <div className="max-w-3xl">
            <h2 className="text-3xl font-bold text-foreground mb-6">درباره این خدمت</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">{service.overview}</p>
          </div>
        </div>
      </section>

      {/* Process Steps */}
      <section className="section-padding bg-muted/50">
        <div className="container-arad">
          <h2 className="text-3xl font-bold text-foreground mb-12 text-center">مراحل انجام کار</h2>
          <div className="relative">
            <div className="absolute top-8 right-8 left-8 h-0.5 bg-border hidden lg:block" />
            <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-8">
              {service.steps.map((step, index) => (
                <div key={index} className="relative text-center">
                  <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold mx-auto mb-4 relative z-10">
                    {index + 1}
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="section-padding">
        <div className="container-arad">
          <h2 className="text-3xl font-bold text-foreground mb-12 text-center">مزایای این خدمت</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {service.benefits.map((benefit, index) => (
              <div
                key={index}
                className="bg-card rounded-2xl p-6 border border-border/50 shadow-arad-sm hover:shadow-arad-md transition-shadow"
              >
                <span className="text-4xl mb-4 block">{benefit.icon}</span>
                <h3 className="text-lg font-bold text-foreground mb-2">{benefit.title}</h3>
                <p className="text-muted-foreground">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-primary text-primary-foreground">
        <div className="container-arad text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">آماده شروع هستید؟</h2>
          <p className="text-xl text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
            همین حالا با ما تماس بگیرید و از مشاوره رایگان بهره‌مند شوید
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button variant="hero" size="xl">
              <Phone className="w-5 h-5" />
              ۰۲۱-۱۲۳۴۵۶۷۸
            </Button>
            <Button variant="outline-light" size="xl">
              <ArrowLeft className="w-5 h-5" />
              ثبت درخواست آنلاین
            </Button>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
