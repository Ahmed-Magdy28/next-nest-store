"use client";

import {
  InfoPageLayout,
  type InfoSection,
} from "../../../components/common/info-page-layout";

const TERMS_SECTIONS: InfoSection[] = [
  {
    title: {
      name: "Use of Service",
      arName: "استخدام المتجر",
    },
    body: {
      name: "By accessing and placing orders on our storefront, you agree to provide accurate account and delivery information and use the service lawfully.",
      arName: "باستخدامك للمتجر وإتمام الطلبات، فإنك توافق على تقديم بيانات دقيقة للحساب والتوصيل والالتزام بالاستخدام المشروع.",
    },
  },
  {
    title: {
      name: "Pricing, Promotions & Availability",
      arName: "الأسعار والعروض والتوافر",
    },
    body: {
      name: "Product prices and stock availability are updated regularly. Promotional codes are subject to expiration dates and single-use limits where noted.",
      arName: "يتم تحديث الأسعار وتوافر المنتجات بانتظام، وتخضع أكواد الخصم لفترة الصلاحية وشروط الاستخدام المعلنة.",
    },
  },
  {
    title: {
      name: "Orders & Cancellations",
      arName: "الطلبات والإلغاء",
    },
    body: {
      name: "Orders can be cancelled before dispatch from your Account Orders page. Once shipped, standard 30-day return terms apply.",
      arName: "يمكن إلغاء الطلب قبل الشحن من صفحة طلبات الحساب، وبعد الشحن تنطبق شروط سياسة الاسترجاع خلال 30 يوماً.",
    },
  },
  {
    title: {
      name: "Limitation of Liability",
      arName: "حدود المسؤولية",
    },
    body: {
      name: "To the maximum extent permitted by law, our liability for any order is limited to the purchase price paid for the applicable items.",
      arName: "في الحدود التي يسمح بها القانون، تقتصر مسؤوليتنا عن أي طلب على قيمة المبلغ المدفوع للمنتجات المشمولة.",
    },
  },
];

/**
 * Storefront Terms of Service page.
 */
export default function TermsOfServicePage() {
  return (
    <InfoPageLayout
      eyebrow={{ name: "Legal", arName: "قانوني" }}
      title={{ name: "Terms of Service", arName: "شروط الخدمة" }}
      subtitle={{
        name: "Please review the terms governing orders, pricing, and use of our platform.",
        arName: "يرجى مراجعة الشروط والأحكام المنظمة للطلبات والأسعار واستخدام المنصة.",
      }}
      sections={TERMS_SECTIONS}
    />
  );
}
