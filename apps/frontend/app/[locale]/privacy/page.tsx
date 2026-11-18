"use client";

import {
  InfoPageLayout,
  type InfoSection,
} from "../../../components/common/info-page-layout";

const PRIVACY_SECTIONS: InfoSection[] = [
  {
    title: {
      name: "Information We Collect",
      arName: "المعلومات التي نجمعها",
    },
    body: {
      name: "We collect only the details needed to process your orders and improve your shopping experience, including your name, email, shipping address, and order history.",
      arName: "نجمع فقط البيانات اللازمة لتنفيذ طلباتك وتحسين تجربة التسوق، مثل الاسم والبريد الإلكتروني وعنوان التوصيل وسجل الطلبات.",
    },
  },
  {
    title: {
      name: "How We Use Your Data",
      arName: "كيف نستخدم بياناتك",
    },
    body: {
      name: "Your information is used strictly to fulfill orders, provide customer support, prevent fraud, and send updates you opt into.",
      arName: "تُستخدم بياناتك حصرياً لتجهيز الطلبات وتقديم الدعم الفني ومنع الاحتيال وإرسال التحديثات التي تشترك بها.",
    },
  },
  {
    title: {
      name: "Security & Cookies",
      arName: "الأمان وملفات تعريف الارتباط",
    },
    body: {
      name: "All sessions and checkout flows use encrypted connections. Essential cookies keep your cart, language preference, and login session active.",
      arName: "تعتمد جميع الجلسات وعمليات الدفع على اتصال مشفر، وتُستخدم ملفات تعريف الارتباط الأساسية لحفظ السلة وتفضيل اللغة.",
    },
  },
  {
    title: {
      name: "Your Rights",
      arName: "حقوقك",
    },
    body: {
      name: "You can update your profile details anytime in Account Settings or contact support to request data export or account deletion.",
      arName: "يمكنك تحديث بياناتك في أي وقت من إعدادات الحساب أو التواصل مع الدعم لطلب حذف أو تصدير بياناتك.",
    },
  },
];

/**
 * Storefront Privacy Policy page.
 */
export default function PrivacyPolicyPage() {
  return (
    <InfoPageLayout
      eyebrow={{ name: "Legal", arName: "قانوني" }}
      title={{ name: "Privacy Policy", arName: "سياسة الخصوصية" }}
      subtitle={{
        name: "How we collect, protect, and respect your personal information.",
        arName: "كيف نجمع معلوماتك الشخصية ونحميها ونحافظ على خصوصيتها.",
      }}
      sections={PRIVACY_SECTIONS}
    />
  );
}
