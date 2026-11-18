"use client";

import { Link } from "../../../i18n/routing";
import { useLocalized } from "../../../i18n/use-localized";
import {
  InfoPageLayout,
  type InfoSection,
} from "../../../components/common/info-page-layout";

const ABOUT_SECTIONS: InfoSection[] = [
  {
    title: {
      name: "Our Mission",
      arName: "رسالتنا",
    },
    body: {
      name: "We built this storefront to make everyday online shopping fast, transparent, and enjoyable—combining curated products with reliable delivery.",
      arName: "أنشأنا هذا المتجر لجعل تجربة التسوق الإلكتروني سريعة وواضحة وممتعة، مع الجمع بين المنتجات المختارة والتوصيل الموثوق.",
    },
  },
  {
    title: {
      name: "What We Offer",
      arName: "ماذا نقدم",
    },
    body: {
      name: "Our catalog spans 10+ departments and over 600 products from trusted brands:",
      arName: "يغطي متجرنا أكثر من 10 أقسام وأكثر من 600 منتج من علامات تجارية موثوقة:",
    },
    items: [
      {
        name: "Gaming, Electronics, and Smart Home Appliances.",
        arName: "الألعاب والإلكترونيات والأجهزة المنزلية الذكية.",
      },
      {
        name: "Men's & Women's Fashion, Sports, and Beauty.",
        arName: "أزياء الرجال والنساء والرياضة والعناية الشخصية.",
      },
      {
        name: "Furniture, Home Decor, Books, and Toys.",
        arName: "الأثاث والديكور والكتب والألعاب.",
      },
    ],
  },
  {
    title: {
      name: "Quality & Support",
      arName: "الجودة والدعم",
    },
    body: {
      name: "Every product is sourced from verified distributors with transparent pricing, 24/7 customer support, and a 30-day return guarantee.",
      arName: "نحرص على توفير منتجات أصلية بأسعار شفافة ودعم فني متواصل وضمان استرجاع لمدة 30 يوماً.",
    },
  },
];

/**
 * Storefront About Us page.
 */
export default function AboutPage() {
  const { t } = useLocalized();

  return (
    <InfoPageLayout
      eyebrow={{ name: "Company", arName: "عن المتجر" }}
      title={{ name: "About Us", arName: "من نحن" }}
      subtitle={{
        name: "Your destination for authentic tech, fashion, home essentials, and more.",
        arName: "وجهتك الموثوقة للتقنية والأزياء ومستلزمات المنزل والمزيد.",
      }}
      sections={ABOUT_SECTIONS}
      footerCta={
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
          <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
            {t({
              name: "Ready to explore our latest collections?",
              arName: "هل أنت مستعد لاستكشاف أحدث المجموعات؟",
            })}
          </p>
          <Link
            href="/products"
            className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
          >
            {t({ name: "Browse Products", arName: "تصفح المنتجات" })}
          </Link>
        </div>
      }
    />
  );
}
