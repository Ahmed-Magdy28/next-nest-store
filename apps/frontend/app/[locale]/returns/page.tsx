"use client";

import {
  InfoPageLayout,
  type InfoSection,
} from "../../../components/common/info-page-layout";

const RETURNS_SECTIONS: InfoSection[] = [
  {
    title: {
      name: "30-Day Return Window",
      arName: "إمكانية الإرجاع خلال 30 يوماً",
    },
    body: {
      name: "You may return most new, unopened items within 30 days of delivery for a full refund or exchange.",
      arName: "يمكنك إرجاع معظم المنتجات الجديدة وغير المفتوحة خلال 30 يوماً من تاريخ الاستلام لاسترداد كامل المبلغ أو الاستبدال.",
    },
  },
  {
    title: {
      name: "Eligibility Conditions",
      arName: "شروط قبول الإرجاع",
    },
    body: {
      name: "To ensure a smooth return process, please make sure your item meets these requirements:",
      arName: "لضمان سرعة إتمام الإرجاع، يرجى التأكد من توفر الشروط التالية:",
    },
    items: [
      {
        name: "Item is unused, undamaged, and in its original packaging.",
        arName: "المنتج غير مستخدم وبحالته الأصلية داخل عبوته.",
      },
      {
        name: "All accessories, manuals, and tags are included.",
        arName: "تضمين جميع الملحقات والكتيبات والملصقات الأصلية.",
      },
      {
        name: "Order number or receipt is provided with the request.",
        arName: "تقديم رقم الطلب أو فاتورة الشراء مع طلب الإرجاع.",
      },
    ],
  },
  {
    title: {
      name: "Refund Timeline",
      arName: "مدة استرداد المبلغ",
    },
    body: {
      name: "Once your return is received and inspected, refunds are issued to your original payment method within 5–7 business days.",
      arName: "بمجرد استلام وفحص المرتجع، يتم تحويل المبلغ إلى وسيلة الدفع الأصلية خلال 5 إلى 7 أيام عمل.",
    },
  },
];

/**
 * Storefront Returns & Refunds Policy page.
 */
export default function ReturnsPage() {
  return (
    <InfoPageLayout
      eyebrow={{ name: "Guarantee", arName: "الضمان" }}
      title={{ name: "Returns & Refunds", arName: "سياسة الاسترجاع" }}
      subtitle={{
        name: "Shop with confidence backed by our hassle-free 30-day return policy.",
        arName: "تسوق بثقة مع سياسة استرجاع سهلة ومريحة خلال 30 يوماً.",
      }}
      sections={RETURNS_SECTIONS}
    />
  );
}
