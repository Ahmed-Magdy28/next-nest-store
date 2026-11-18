"use client";

import { Link } from "../../../i18n/routing";
import { useLocalized } from "../../../i18n/use-localized";
import {
  InfoPageLayout,
  type InfoSection,
} from "../../../components/common/info-page-layout";

const HELP_SECTIONS: InfoSection[] = [
  {
    title: {
      name: "How do I track my order?",
      arName: "كيف يمكنني تتبع طلبي؟",
    },
    body: {
      name: "Sign in to your account and open the Orders page to view real-time status updates, tracking numbers, and delivery estimates.",
      arName: "سجّل الدخول إلى حسابك وافتح صفحة الطلبات لمتابعة حالة الطلب ورقم التتبع وتاريخ التوصيل المتوقع.",
    },
  },
  {
    title: {
      name: "How can I apply a discount code?",
      arName: "كيف أستخدم كود الخصم؟",
    },
    body: {
      name: "Enter your promo code (such as WELCOME10 for 10% off) in the coupon field on the cart or checkout page before placing your order.",
      arName: "أدخل كود الخصم (مثل WELCOME10 للحصول على خصم 10%) في خانة الكوبون بصفحة السلة أو إتمام الطلب.",
    },
  },
  {
    title: {
      name: "What payment methods are accepted?",
      arName: "ما هي وسائل الدفع المتاحة؟",
    },
    body: {
      name: "We accept major credit and debit cards as well as cash on delivery where available. All online payments are encrypted.",
      arName: "نقبل البطاقات الائتمانية وبطاقات الخصم المباشر بالإضافة إلى الدفع عند الاستلام حسب المنطقة.",
    },
  },
  {
    title: {
      name: "How do returns and refunds work?",
      arName: "كيف تتم عمليات الاسترجاع واسترداد الأموال؟",
    },
    body: {
      name: "Unused items in original packaging can be returned within 30 days of delivery. Refunds are processed within 5–7 business days.",
      arName: "يمكن إرجاع المنتجات غير المستخدمة في عبوتها الأصلية خلال 30 يوماً من الاستلام، ويتم رد المبلغ خلال 5 إلى 7 أيام عمل.",
    },
  },
];

/**
 * Customer Help Center page with common FAQs and quick support links.
 */
export default function HelpCenterPage() {
  const { t } = useLocalized();

  return (
    <InfoPageLayout
      eyebrow={{ name: "Support", arName: "الدعم" }}
      title={{ name: "Help Center", arName: "مركز المساعدة" }}
      subtitle={{
        name: "Find quick answers about orders, shipping, payments, and returns.",
        arName: "اعثر على إجابات سريعة حول الطلبات والشحن والدفع والاسترجاع.",
      }}
      sections={HELP_SECTIONS}
      footerCta={
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-blue-200/80 bg-blue-50/70 p-6 dark:border-blue-900/60 dark:bg-blue-950/30">
          <div>
            <p className="text-base font-bold text-gray-900 dark:text-white">
              {t({ name: "Still need help?", arName: "هل ما زلت بحاجة للمساعدة؟" })}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {t({
                name: "Our support team responds within 24 hours.",
                arName: "يرد فريق الدعم لدينا خلال 24 ساعة.",
              })}
            </p>
          </div>
          <Link
            href="/contact"
            className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
          >
            {t({ name: "Contact Support", arName: "تواصل مع الدعم" })}
          </Link>
        </div>
      }
    />
  );
}
