"use client";

import { useState } from "react";
import { ChevronLeft, Clock, Mail, MapPin, Send } from "lucide-react";

import { Link } from "../../../i18n/routing";
import { useLocalized } from "../../../i18n/use-localized";

/**
 * Interactive Contact Us page with support channels and message submission form.
 */
export default function ContactPage() {
  const { t } = useLocalized();
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-8 dark:bg-gray-950">
      <div className="mx-auto max-w-5xl space-y-8">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white"
        >
          <ChevronLeft className="h-4 w-4 rtl:rotate-180" />
          {t({ name: "Back to home", arName: "العودة للرئيسية" })}
        </Link>

        <header className="rounded-3xl border border-gray-200/80 bg-white p-6 shadow-xs sm:p-8 dark:border-gray-800 dark:bg-gray-900">
          <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
            {t({ name: "Support", arName: "الدعم" })}
          </span>
          <h1 className="mt-3 text-3xl font-extrabold text-gray-900 sm:text-4xl dark:text-white">
            {t({ name: "Contact Us", arName: "تواصل معنا" })}
          </h1>
          <p className="mt-2 text-sm text-gray-600 sm:text-base dark:text-gray-400">
            {t({
              name: "Have a question about an order or product? Send us a message anytime.",
              arName: "هل لديك استفسار حول طلب أو منتج؟ أرسل لنا رسالة وسنرد عليك قريباً.",
            })}
          </p>
        </header>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="space-y-4">
            <div className="rounded-2xl border border-gray-200/80 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
              <Mail className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <p className="mt-3 text-sm font-bold text-gray-900 dark:text-white">
                {t({ name: "Email", arName: "البريد الإلكتروني" })}
              </p>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                support@store.example.com
              </p>
            </div>
            <div className="rounded-2xl border border-gray-200/80 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
              <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <p className="mt-3 text-sm font-bold text-gray-900 dark:text-white">
                {t({ name: "Support Hours", arName: "ساعات العمل" })}
              </p>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {t({ name: "24/7 Online Support", arName: "دعم متواصل 24/7" })}
              </p>
            </div>
            <div className="rounded-2xl border border-gray-200/80 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
              <MapPin className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <p className="mt-3 text-sm font-bold text-gray-900 dark:text-white">
                {t({ name: "Headquarters", arName: "المقر الرئيسي" })}
              </p>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {t({ name: "Cairo, Egypt", arName: "القاهرة، مصر" })}
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200/80 bg-white p-6 sm:p-8 lg:col-span-2 dark:border-gray-800 dark:bg-gray-900">
            {submitted ? (
              <div className="rounded-2xl bg-emerald-50 p-6 text-center dark:bg-emerald-950/40">
                <p className="text-lg font-bold text-emerald-700 dark:text-emerald-300">
                  {t({ name: "Message Sent!", arName: "تم إرسال رسالتك!" })}
                </p>
                <p className="mt-1 text-sm text-emerald-600 dark:text-emerald-400">
                  {t({
                    name: "Thank you for reaching out. Our team will reply shortly.",
                    arName: "شكراً لتواصلك معنا. سيتواصل معك فريقنا قريباً.",
                  })}
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="mt-4 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-700"
                >
                  {t({ name: "Send another message", arName: "إرسال رسالة أخرى" })}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <input
                    required
                    type="text"
                    placeholder={t({ name: "Your Name", arName: "الاسم" })}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:bg-white dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  />
                  <input
                    required
                    type="email"
                    placeholder={t({ name: "Email Address", arName: "البريد الإلكتروني" })}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:bg-white dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  />
                </div>
                <input
                  required
                  type="text"
                  placeholder={t({ name: "Subject", arName: "الموضوع" })}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:bg-white dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
                <textarea
                  required
                  rows={4}
                  placeholder={t({ name: "How can we help?", arName: "كيف يمكننا مساعدتك؟" })}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:bg-white dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-blue-700"
                >
                  <Send className="h-4 w-4" />
                  <span>{t({ name: "Send Message", arName: "إرسال الرسالة" })}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
