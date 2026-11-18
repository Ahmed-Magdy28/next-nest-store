"use client";

import {
  InfoPageLayout,
  type InfoSection,
} from "../../../components/common/info-page-layout";

const SHIPPING_SECTIONS: InfoSection[] = [
  {
    title: {
      name: "Processing & Dispatch",
      arName: "تجهيز وشحن الطلبات",
    },
    body: {
      name: "Orders placed before 2:00 PM are processed the same business day. You will receive an email confirmation as soon as your package ships.",
      arName: "يتم تجهيز الطلبات المؤكدة قبل الساعة 2 ظهراً في نفس يوم العمل، وستصلك رسالة تأكيد فور شحن الطلب.",
    },
  },
  {
    title: {
      name: "Shipping Rates & Free Delivery",
      arName: "تكاليف الشحن والشحن المجاني",
    },
    body: {
      name: "We offer straightforward flat-rate shipping and free standard delivery on qualifying orders:",
      arName: "نوفر أسعار شحن واضحة وتوصيلاً مجانياً للطلبات المؤهلة:",
    },
    items: [
      {
        name: "Free standard shipping on all orders over $100.",
        arName: "شحن عادي مجاني لجميع الطلبات التي تتجاوز $100.",
      },
      {
        name: "Standard delivery (3–5 business days): $5 flat rate.",
        arName: "التوصيل العادي (3 إلى 5 أيام عمل): $5 رسوم ثابتة.",
      },
      {
        name: "Express delivery (1–2 business days) available at checkout.",
        arName: "التوصيل السريع (1 إلى 2 يوم عمل) متاح عند إتمام الطلب.",
      },
    ],
  },
  {
    title: {
      name: "Order Tracking",
      arName: "تتبع الشحنة",
    },
    body: {
      name: "Visit your Account Orders page at any time to check live shipment progress and carrier tracking details.",
      arName: "يمكنك زيارة صفحة طلباتي في حسابك في أي وقت لمتابعة حالة الشحنة وتفاصيل شركة الشحن.",
    },
  },
];

/**
 * Storefront Shipping Policy page.
 */
export default function ShippingPolicyPage() {
  return (
    <InfoPageLayout
      eyebrow={{ name: "Delivery", arName: "التوصيل" }}
      title={{ name: "Shipping Policy", arName: "سياسة الشحن" }}
      subtitle={{
        name: "Fast, reliable delivery with free shipping on orders over $100.",
        arName: "توصيل سريع وموثوق مع شحن مجاني للطلبات فوق $100.",
      }}
      sections={SHIPPING_SECTIONS}
    />
  );
}
