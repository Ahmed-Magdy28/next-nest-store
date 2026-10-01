"use client";

import { Flame } from "lucide-react";
import { CatalogView } from "../../../components/e-commerce/products/catalog-view";

export default function BestSellersPage() {
  return (
    <CatalogView
      title={{ name: "Best Sellers", arName: "الأكثر مبيعاً" }}
      subtitle={{
        name: "Our most popular products",
        arName: "أكثر المنتجات شعبية عند عملائنا",
      }}
      badge={{
        icon: Flame,
        label: { name: "Top Trending", arName: "الأكثر طلباً" },
        colorClassName: "bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400",
      }}
      defaultSortBy="createdAt"
    />
  );
}
