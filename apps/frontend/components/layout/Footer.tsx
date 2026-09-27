"use client";

import { useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { ShopName } from "@repo/shared/constants";

import {
  ShoppingBag,
  Mail,
  ArrowRight,
  ShieldCheck,
  Truck,
  RotateCcw,
  Headphones,
} from "lucide-react";

export function Footer() {
  const t = useTranslations("Footer");
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail("");
    }
  };

  return (
    <footer className="w-full border-t border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950">
      {/* Value Props */}
      <div className="border-b border-gray-100 dark:border-gray-800/60">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 py-8 sm:px-6 md:grid-cols-4 lg:px-8">
          <Feature
            icon={Truck}
            title={t("freeShipping")}
            desc={t("freeShippingDesc")}
          />
          <Feature
            icon={RotateCcw}
            title={t("moneyBack")}
            desc={t("moneyBackDesc")}
          />
          <Feature
            icon={ShieldCheck}
            title={t("secureCheckout")}
            desc={t("secureCheckoutDesc")}
          />
          <Feature
            icon={Headphones}
            title={t("support")}
            desc={t("supportDesc")}
          />
        </div>
      </div>

      {/* Main */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-8">
          {/* Brand */}
          <div className="space-y-6 lg:col-span-4">
            <Link
              href="/"
              className="flex items-center gap-2 text-xl font-bold tracking-tight text-gray-900 dark:text-white"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md shadow-blue-500/20">
                <ShoppingBag className="h-5 w-5" />
              </div>
              <span>{ShopName}</span>
            </Link>

            <p className="text-sm text-gray-600 dark:text-gray-400">
              {t("brandDesc")}
            </p>

            <div className="space-y-2">
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                {t("newsletterTitle")}
              </p>
              {subscribed ? (
                <div className="rounded-lg bg-emerald-50 p-3 text-sm font-medium text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400">
                  {t("newsletterSuccess")}
                </div>
              ) : (
                <form
                  onSubmit={handleSubscribe}
                  className="flex max-w-md gap-2"
                >
                  <div className="relative flex-1">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 rtl:left-auto rtl:right-3" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={t("newsletterPlaceholder")}
                      className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2.5 pl-9 pr-3 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20 dark:border-gray-800 dark:bg-gray-900 dark:text-white rtl:pl-3 rtl:pr-9"
                    />
                  </div>
                  <button
                    type="submit"
                    className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700"
                  >
                    <span>{t("newsletterJoin")}</span>
                    <ArrowRight className="h-4 w-4 rtl:rotate-180" />
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Links */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-8 lg:pl-8 rtl:lg:pl-0 rtl:lg:pr-8">
            <FooterCol
              title={t("shop")}
              links={[
                { href: "/products", label: t("allProducts") },
                { href: "/categories", label: t("categories") },
                { href: "/deals", label: t("featuredDeals") },
                { href: "/new-arrivals", label: t("newArrivals") },
              ]}
            />
            <FooterCol
              title={t("supportCol")}
              links={[
                { href: "/help", label: t("helpCenter") },
                { href: "/account/orders", label: t("trackOrders") },
                { href: "/shipping", label: t("shippingPolicy") },
                { href: "/returns", label: t("returns") },
              ]}
            />
            <FooterCol
              title={t("company")}
              links={[
                { href: "/about", label: t("aboutUs") },
                { href: "/contact", label: t("contactUs") },
                { href: "/privacy", label: t("privacyPolicy") },
                { href: "/terms", label: t("termsOfService") },
              ]}
            />
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-gray-100 pt-8 sm:flex-row dark:border-gray-800">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            © {new Date().getFullYear()} Store Inc. {t("rights")}
          </p>
        </div>
      </div>
    </footer>
  );
}

function Feature({
  icon: Icon,
  title,
  desc,
}: {
  icon: any;
  title: string;
  desc: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="text-sm font-semibold text-gray-900 dark:text-white">
          {title}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400">{desc}</p>
      </div>
    </div>
  );
}

function FooterCol({
  title,
  links,
}: {
  title: string;
  links: { href: string; label: string }[];
}) {
  return (
    <div>
      <p className="text-sm font-semibold tracking-wider text-gray-900 uppercase dark:text-white">
        {title}
      </p>
      <ul className="mt-4 space-y-2.5 text-sm">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="text-gray-600 transition hover:text-blue-600 dark:text-gray-400 dark:hover:text-white"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
