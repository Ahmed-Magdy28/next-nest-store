"use client";

import { Sparkles } from "lucide-react";
import { CatalogView } from "../../../components/e-commerce/products/catalog-view";

export default function NewArrivalsPage() {
  return (
    <CatalogView
      title={{ name: "New Arrivals", arName: "وصل حديثاً" }}
      subtitle={{
        name: "Fresh products just added to our store",
        arName: "أحدث المنتجات المضافة للمتجر",
      }}
      badge={{
        icon: Sparkles,
        label: { name: "Just Dropped", arName: "أحدث الإضافات" },
        colorClassName: "bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400",
      }}
      presetFilters={{ isNew: true }}
      hideNewArrivalsFilter={true}
      defaultSortBy="createdAt"
    />
  );
}
