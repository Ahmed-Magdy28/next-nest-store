"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { ArrowRight } from "lucide-react";

export function HeroSection() {
  const t = useTranslations("Home");

  return (
    <section className="relative overflow-hidden border-b border-gray-200/80 bg-gradient-to-b from-blue-50/60 via-white to-gray-50/40 py-16 sm:py-24 dark:border-gray-800 dark:from-blue-950/20 dark:via-gray-950 dark:to-gray-950">
      {/* Decorative background glow */}
      <div className="pointer-events-none absolute -top-24 start-1/2 -z-10 h-96 w-96 -translate-x-1/2 rounded-full bg-blue-500/10 blur-3xl dark:bg-blue-600/15" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7 text-start">
            {/* Top Announcement Pill */}
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-200/80 bg-blue-50/80 px-3.5 py-1 text-xs font-semibold text-blue-700 shadow-xs dark:border-blue-900/60 dark:bg-blue-950/60 dark:text-blue-300">
              <span className="flex h-2 w-2 rounded-full bg-blue-600 animate-pulse" />
              <span>Special Spring Offers & Exclusive Discounts</span>
            </div>

            <h1 className="mt-5 text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl dark:text-white leading-[1.15]">
              {t("heroTitle")}
            </h1>

            <p className="mt-5 text-base sm:text-lg text-gray-600 dark:text-gray-300 max-w-xl leading-relaxed">
              {t("heroSubtitle")}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3.5">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-600/25 transition-all hover:bg-blue-700 hover:shadow-blue-600/35 hover:-translate-y-0.5 active:translate-y-0"
              >
                {t("shopNow")}
                <ArrowRight className="h-4 w-4 rtl:rotate-180" />
              </Link>
              <Link
                href="/deals"
                className="inline-flex items-center gap-2 rounded-xl border border-gray-300/80 bg-white/80 px-6 py-3.5 text-sm font-semibold text-gray-800 backdrop-blur-xs transition hover:bg-gray-100 hover:border-gray-400 dark:border-gray-700 dark:bg-gray-900/80 dark:text-gray-200 dark:hover:bg-gray-800"
              >
                {t("viewDeals")}
              </Link>
            </div>

            {/* Quick Trust Highlights */}
            <div className="mt-10 grid grid-cols-3 gap-4 border-t border-gray-200/70 pt-6 dark:border-gray-800 max-w-md">
              <div>
                <p className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white">
                  100%
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mt-0.5">
                  Original Goods
                </p>
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-black text-blue-600 dark:text-blue-400">
                  24/7
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mt-0.5">
                  Fast Support
                </p>
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-black text-emerald-600 dark:text-emerald-400">
                  Free
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mt-0.5">
                  Over $100
                </p>
              </div>
            </div>
          </div>

          {/* Hero Quick Banner / Visual Card */}
          <div className="lg:col-span-5 hidden lg:block">
            <div className="relative rounded-3xl border border-gray-200/80 bg-gradient-to-br from-white to-gray-50 p-7 shadow-xl shadow-gray-200/50 dark:border-gray-800 dark:from-gray-900 dark:to-gray-950 dark:shadow-none">
              <div className="flex items-center justify-between pb-5 border-b border-gray-100 dark:border-gray-800">
                <span className="text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400">
                  Weekly Highlights
                </span>
                <span className="rounded-full bg-rose-500 px-2.5 py-0.5 text-[11px] font-bold text-white shadow-xs">
                  Up to 50% Off
                </span>
              </div>

              <div className="mt-5 space-y-4">
                <Link
                  href="/deals"
                  className="group block rounded-2xl border border-gray-100 bg-white p-4 transition-all hover:border-blue-500 hover:shadow-md dark:border-gray-800 dark:bg-gray-800/60"
                >
                  <p className="text-xs font-semibold text-rose-600 dark:text-rose-400">
                    ⚡ Flash Sale
                  </p>
                  <p className="text-sm font-bold text-gray-900 group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400 mt-1">
                    Check limited time deals across all tech & fashion
                  </p>
                </Link>

                <Link
                  href="/new-arrivals"
                  className="group block rounded-2xl border border-gray-100 bg-white p-4 transition-all hover:border-blue-500 hover:shadow-md dark:border-gray-800 dark:bg-gray-800/60"
                >
                  <p className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                    ✨ Just In
                  </p>
                  <p className="text-sm font-bold text-gray-900 group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400 mt-1">
                    Explore fresh arrivals from premium verified brands
                  </p>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
