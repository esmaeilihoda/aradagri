import { Link } from "react-router-dom";
import { Leaf, Phone, Mail, MapPin, Instagram, MessageCircle, Send } from "lucide-react";

const footerLinks = {
  products: [
    { label: "نهال", href: "/products/seedlings" },
    { label: "بذر", href: "/products/seeds" },
    { label: "کود", href: "/products/fertilizers" },
    { label: "سم", href: "/products/pesticides" },
    { label: "تجهیزات کشاورزی", href: "/products/equipment" },
    { label: "تجهیزات گلخانه‌ای", href: "/products/greenhouse-equipment" },
    { label: "سیستم‌های آبیاری", href: "/products/irrigation" },
  ],
  services: [
    { label: "ساخت گلخانه", href: "/services/greenhouse-construction" },
    { label: "مشاوره سازه کشاورزی", href: "/services/consulting" },
    { label: "محوطه‌سازی و ویلاسازی", href: "/services/landscaping" },
    { label: "مشاوره حقوقی اراضی", href: "/services/legal" },
    { label: "ابزارهای هوش مصنوعی", href: "/services/ai-tools" },
  ],
  info: [
    { label: "درباره ما", href: "/about" },
    { label: "تجارت درخت", href: "/about/tree-trade" },
    { label: "گواهی‌ها", href: "/certificates" },
    { label: "گالری تصاویر", href: "/gallery" },
    { label: "آنالیز رفتار مشتری", href: "/content/analytics" },
    { label: "پیشنهادها و مشاوره", href: "/content/suggestions" },
  ],
};

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      {/* Main Footer */}
      <div className="container-arad py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-3 mb-6">
              <div className="w-14 h-14 rounded-xl bg-primary-foreground/10 flex items-center justify-center">
                <Leaf className="w-8 h-8" />
              </div>
              <div>
                <h2 className="text-3xl font-bold">آراد</h2>
                <span className="text-sm text-primary-foreground/70">کشاورزی نوین</span>
              </div>
            </Link>
            <p className="text-primary-foreground/80 leading-relaxed mb-6 max-w-md">
              آراد، پیشرو در ارائه محصولات و خدمات کشاورزی با بیش از یک دهه تجربه در صنعت کشاورزی ایران. ما متعهد به ارائه بهترین کیفیت و پشتیبانی کامل برای کشاورزان عزیز هستیم.
            </p>
            <div className="space-y-3">
              <a href="tel:02112345678" className="flex items-center gap-3 text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                <Phone className="w-5 h-5" />
                ۰۲۱-۱۲۳۴۵۶۷۸
              </a>
              <a href="mailto:info@arad.ir" className="flex items-center gap-3 text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                <Mail className="w-5 h-5" />
                info@arad.ir
              </a>
              <p className="flex items-center gap-3 text-primary-foreground/80">
                <MapPin className="w-5 h-5" />
                تهران، خیابان ولیعصر
              </p>
            </div>
          </div>

          {/* Products Links */}
          <div>
            <h3 className="text-lg font-bold mb-6 pb-2 border-b border-primary-foreground/20">
              محصولات
            </h3>
            <ul className="space-y-3">
              {footerLinks.products.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-primary-foreground/70 hover:text-primary-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services Links */}
          <div>
            <h3 className="text-lg font-bold mb-6 pb-2 border-b border-primary-foreground/20">
              خدمات
            </h3>
            <ul className="space-y-3">
              {footerLinks.services.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-primary-foreground/70 hover:text-primary-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Info Links */}
          <div>
            <h3 className="text-lg font-bold mb-6 pb-2 border-b border-primary-foreground/20">
              اطلاعات
            </h3>
            <ul className="space-y-3">
              {footerLinks.info.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-primary-foreground/70 hover:text-primary-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-primary-foreground/10">
        <div className="container-arad py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-primary-foreground/60 text-sm">
              © ۱۴۰۳ آراد. تمامی حقوق محفوظ است.
            </p>
            <div className="flex items-center gap-4">
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-primary-foreground/20 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-primary-foreground/20 transition-colors"
                aria-label="WhatsApp"
              >
                <MessageCircle className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-primary-foreground/20 transition-colors"
                aria-label="Telegram"
              >
                <Send className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
