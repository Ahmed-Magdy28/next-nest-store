"use client";

import { useTranslations } from "next-intl";

import { useDeals, useNewArrivals } from "../../../hooks/use-products";
import { useLocalized } from "../../../i18n/use-localized";
import { HeroSection } from "../../../components/home/hero-section";
import { HomeCategories } from "../../../components/home/home-categories";
import { HomeProductSection } from "../../../components/home/home-product-section";
import { HomePromoBanner } from "../../../components/home/home-promo-banner";
import { HomeValueProps } from "../../../components/home/home-value-props";

/**
 * Main storefront home page combining hero spotlight, trust strip,
 * visual category showcase, new arrivals, promo banner, and hot deals.
 */
export default function HomePage() {
  const newArrivals = useNewArrivals(8);
  const deals = useDeals(8);
  const t = useTranslations("Home");
  const { t: tLocal } = useLocalized();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <HeroSection />
      <HomeValueProps />
      <HomeCategories />

      <HomeProductSection
        eyebrow={tLocal({
          name: "Fresh From Inventory",
          arName: "وصل حديثاً للمتجر",
        })}
        title={t("newArrivals")}
        viewAllHref="/new-arrivals"
        viewAllLabel={t("viewAll")}
        accent="blue"
        products={newArrivals.data?.items ?? []}
        isLoading={newArrivals.isLoading}
      />

      <HomePromoBanner />

      <HomeProductSection
        eyebrow={tLocal({
          name: "Special Discounts",
          arName: "خصومات مميزة",
        })}
        title={t("hotDeals")}
        viewAllHref="/deals"
        viewAllLabel={t("viewAll")}
        accent="rose"
        products={deals.data?.items ?? []}
        isLoading={deals.isLoading}
        tinted
      />
    </div>
  );
}
