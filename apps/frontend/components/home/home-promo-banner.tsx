"use client";

import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "../../i18n/routing";
import { useLocalized } from "../../i18n/use-localized";

/**
 * Mid-page promotional banner highlighting the `WELCOME10` coupon and seasonal deals.
 */
export function HomePromoBanner() {
  const { t } = useLocalized();

  return (
    <section className="py-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 px-6 py-8 text-white shadow-lg sm:px-10 sm:py-10">
          <div className="pointer-events-none absolute -end-12 -top-12 h-48 w-48 rounded-full bg-white/10 blur-2xl" />

          <div className="relative flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <div className="space-y-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-bold uppercase tracking-wider backdrop-blur-xs">
                <Sparkles className="h-3.5 w-3.5" />
                {t({ name: "Limited Offer", arName: "عرض لفترة محدودة" })}
              </span>
              <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
                {t({
                  name: "Save 10% on your first order with code WELCOME10",
                  arName: "وفر 10% على طلبك الأول باستخدام كود WELCOME10",
                })}
              </h2>
              <p className="max-w-2xl text-sm text-blue-100">
                {t({
                  name: "Apply at checkout across electronics, fashion, home appliances, and more.",
                  arName: "استخدمه عند الدفع على الإلكترونيات والأزياء والأجهزة المنزلية والمزيد.",
                })}
              </p>
            </div>

            <Link
              href="/deals"
              className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-blue-700 shadow-md transition-all hover:-translate-y-0.5 hover:bg-blue-50"
            >
              <span>
                {t({ name: "Explore Hot Deals", arName: "استكشف العروض" })}
              </span>
              <ArrowRight className="h-4 w-4 rtl:rotate-180" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
