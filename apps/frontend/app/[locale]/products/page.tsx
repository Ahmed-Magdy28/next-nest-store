"use client";

import { useTranslations } from "next-intl";
import { CatalogView } from "../../../components/e-commerce/products/catalog-view";

export default function ProductsPage() {
  const t = useTranslations("Products");

  return (
    <CatalogView
      title={t("title")}
      subtitle={t("browseCatalog")}
    />
  );
}
