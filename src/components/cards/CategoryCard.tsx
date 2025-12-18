import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface CategoryCardProps {
  title: string;
  description?: string;
  icon: string;
  href: string;
  image?: string;
  className?: string;
}

export function CategoryCard({ title, description, icon, href, image, className }: CategoryCardProps) {
  return (
    <Link
      to={href}
      className={cn(
        "group relative overflow-hidden rounded-2xl bg-card p-6 shadow-arad-sm hover:shadow-arad-lg transition-all duration-300 hover:-translate-y-1 border border-border/50",
        className
      )}
    >
      {image && (
        <div className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity">
          <img src={image} alt="" className="w-full h-full object-cover" />
        </div>
      )}
      <div className="relative z-10">
        <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform">
          {icon}
        </div>
        <h3 className="text-lg font-bold text-foreground mb-1">{title}</h3>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      <div className="absolute bottom-4 left-4 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
        <svg className="w-4 h-4 text-primary rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </Link>
  );
}
