"use client";

import { ArrowRight, Tag } from "lucide-react";
import { useTranslations } from "next-intl";

import { Link } from "../../i18n/routing";
import { useLocalized } from "../../i18n/use-localized";
import { HeroSpotlight } from "./hero-spotlight";

/**
 * Storefront hero banner with primary CTAs, store highlights,
 * and a visual spotlight bento card for quick department navigation.
 */
export function HeroSection() {
  const t = useTranslations("Home");
  const { t: tLocal } = useLocalized();

  return (
    <section className="relative overflow-hidden border-b border-gray-200/80 bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 py-14 text-white sm:py-20">
      <div className="pointer-events-none absolute -top-32 end-0 h-96 w-96 rounded-full bg-blue-500/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 start-0 h-80 w-80 rounded-full bg-indigo-500/15 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12">
          <div className="text-start lg:col-span-7">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-500/15 px-3.5 py-1 text-xs font-semibold text-blue-200 backdrop-blur-md">
              <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
              <span>
                {tLocal({
                  name: "600+ Products Across 10 Departments",
                  arName: "أكثر من 600 منتج في 10 أقسام متنوعة",
                })}
              </span>
            </div>

            <h1 className="mt-5 text-4xl font-extrabold leading-[1.12] tracking-tight text-white sm:text-5xl lg:text-6xl">
              {t("heroTitle")}
            </h1>

            <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-300 sm:text-lg">
              {t("heroSubtitle")}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3.5">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-600/30 transition-all hover:-translate-y-0.5 hover:bg-blue-500"
              >
                <span>{t("shopNow")}</span>
                <ArrowRight className="h-4 w-4 rtl:rotate-180" />
              </Link>
              <Link
                href="/deals"
                className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur-md transition-all hover:bg-white/20"
              >
                <Tag className="h-4 w-4 text-rose-300" />
                <span>{t("viewDeals")}</span>
              </Link>
            </div>

            <div className="mt-10 grid max-w-md grid-cols-3 gap-4 border-t border-white/15 pt-6">
              <div>
                <p className="text-2xl font-black text-white">600+</p>
                <p className="mt-0.5 text-xs font-medium text-slate-400">
                  {tLocal({ name: "Curated Items", arName: "منتج متنوع" })}
                </p>
              </div>
              <div>
                <p className="text-2xl font-black text-blue-400">100%</p>
                <p className="mt-0.5 text-xs font-medium text-slate-400">
                  {tLocal({ name: "Authentic Brands", arName: "علامات أصلية" })}
                </p>
              </div>
              <div>
                <p className="text-2xl font-black text-emerald-400">24/7</p>
                <p className="mt-0.5 text-xs font-medium text-slate-400">
                  {tLocal({ name: "Fast Support", arName: "دعم متواصل" })}
                </p>
              </div>
            </div>
          </div>

          <HeroSpotlight />
        </div>
      </div>
    </section>
  );
}
