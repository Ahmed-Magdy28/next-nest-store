"use client";

import { Tag } from "lucide-react";
import { CatalogView } from "../../../components/e-commerce/products/catalog-view";

export default function DealsPage() {
  return (
    <CatalogView
      title={{ name: "Hot Deals", arName: "أقوى العروض" }}
      subtitle={{
        name: "Best discounts on quality products",
        arName: "أفضل الخصومات على منتجات مختارة",
      }}
      badge={{
        icon: Tag,
        label: { name: "Limited Time Offers", arName: "عروض لفترة محدودة" },
        colorClassName: "bg-rose-50 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400",
      }}
      presetFilters={{ onDiscount: true }}
      hideDiscountFilter={true}
      defaultSortBy="updatedAt"
    />
  );
}
