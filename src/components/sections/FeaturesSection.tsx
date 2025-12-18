import { Award, Shield, Truck, HeadphonesIcon } from "lucide-react";

const features = [
  {
    icon: Award,
    title: "کیفیت تضمینی",
    description: "تمام محصولات با گواهینامه‌های معتبر و تضمین کیفیت",
  },
  {
    icon: Truck,
    title: "ارسال سریع",
    description: "ارسال به سراسر کشور با بسته‌بندی استاندارد",
  },
  {
    icon: Shield,
    title: "ضمانت بازگشت",
    description: "امکان بازگشت کالا تا ۷ روز بعد از خرید",
  },
  {
    icon: HeadphonesIcon,
    title: "پشتیبانی ۲۴/۷",
    description: "پشتیبانی شبانه‌روزی توسط متخصصین کشاورزی",
  },
];

export function FeaturesSection() {
  return (
    <section className="py-12 border-y border-border">
      <div className="container-arad">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="flex flex-col md:flex-row items-center md:items-start gap-4 text-center md:text-right">
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <feature.icon className="w-7 h-7 text-primary" />
              </div>
              <div>
                <h3 className="font-bold text-foreground mb-1">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
