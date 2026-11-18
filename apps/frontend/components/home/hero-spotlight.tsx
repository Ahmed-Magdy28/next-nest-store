"use client";

import { Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";

import { Link } from "../../i18n/routing";
import { useLocalized } from "../../i18n/use-localized";
import { CategoryImage } from "../e-commerce/categories/category-image";

/**
 * Right-column visual bento spotlight shown on desktop in {@link HeroSection}.
 */
export function HeroSpotlight() {
  const t = useTranslations("Home");
  const { t: tLocal } = useLocalized();

  return (
    <div className="hidden lg:col-span-5 lg:block">
      <div className="grid grid-cols-2 gap-3.5">
        <Link
          href="/deals"
          className="group relative col-span-2 h-44 overflow-hidden rounded-2xl border border-white/15 bg-slate-900"
        >
          <CategoryImage
            src="https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&h=400&q=80"
            alt="Flash Deals"
            fallbackLabel="D"
            sizes="480px"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/35 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-4">
            <span className="inline-flex items-center gap-1 rounded-full bg-rose-500 px-2.5 py-0.5 text-[11px] font-bold text-white">
              {tLocal({ name: "Up to 30% Off", arName: "خصم حتى 30%" })}
            </span>
            <p className="mt-1.5 text-base font-bold text-white">
              {tLocal({
                name: "Flash Deals Across Tech & Gaming",
                arName: "عروض سريعة على الإلكترونيات والألعاب",
              })}
            </p>
          </div>
        </Link>

        <Link
          href="/new-arrivals"
          className="group relative h-36 overflow-hidden rounded-2xl border border-white/15 bg-slate-900"
        >
          <CategoryImage
            src="https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=400&h=400&q=80"
            alt="New Arrivals"
            fallbackLabel="N"
            sizes="240px"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-3.5">
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-300">
              <Sparkles className="h-3 w-3" />
              {tLocal({ name: "Just In", arName: "وصل حديثاً" })}
            </span>
            <p className="text-sm font-bold text-white">{t("newArrivals")}</p>
          </div>
        </Link>

        <Link
          href="/categories"
          className="group relative h-36 overflow-hidden rounded-2xl border border-white/15 bg-slate-900"
        >
          <CategoryImage
            src="https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=400&h=400&q=80"
            alt="All Categories"
            fallbackLabel="C"
            sizes="240px"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-3.5">
            <span className="text-[11px] font-semibold text-emerald-300">
              {tLocal({ name: "10 Departments", arName: "10 أقسام" })}
            </span>
            <p className="text-sm font-bold text-white">
              {tLocal({ name: "All Categories", arName: "كل الأقسام" })}
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
}
