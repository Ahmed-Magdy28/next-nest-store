"use client";

import type { ReactNode } from "react";
import { ChevronLeft } from "lucide-react";

import { Link } from "../../i18n/routing";
import { useLocalized } from "../../i18n/use-localized";

/** Bilingual text pair used by {@link InfoPageLayout}. */
export interface LocalizedText {
  name: string;
  arName: string;
}

/** Content section rendered inside {@link InfoPageLayout}. */
export interface InfoSection {
  title: LocalizedText;
  body: LocalizedText;
  items?: LocalizedText[];
}

interface InfoPageLayoutProps {
  eyebrow: LocalizedText;
  title: LocalizedText;
  subtitle: LocalizedText;
  sections: InfoSection[];
  footerCta?: ReactNode;
}

/**
 * Shared layout shell for storefront support, company, and legal pages.
 */
export function InfoPageLayout({
  eyebrow,
  title,
  subtitle,
  sections,
  footerCta,
}: InfoPageLayoutProps) {
  const { t } = useLocalized();

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-8 dark:bg-gray-950">
      <div className="mx-auto max-w-4xl space-y-8">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white"
        >
          <ChevronLeft className="h-4 w-4 rtl:rotate-180" />
          {t({ name: "Back to home", arName: "العودة للرئيسية" })}
        </Link>

        <header className="rounded-3xl border border-gray-200/80 bg-white p-6 shadow-xs sm:p-8 dark:border-gray-800 dark:bg-gray-900">
          <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
            {t(eyebrow)}
          </span>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl dark:text-white">
            {t(title)}
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-gray-600 sm:text-base dark:text-gray-400">
            {t(subtitle)}
          </p>
        </header>

        <div className="space-y-4">
          {sections.map((section) => (
            <section
              key={section.title.name}
              className="rounded-2xl border border-gray-200/80 bg-white p-6 shadow-xs dark:border-gray-800 dark:bg-gray-900"
            >
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                {t(section.title)}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                {t(section.body)}
              </p>
              {section.items && section.items.length > 0 && (
                <ul className="mt-3 list-disc space-y-1.5 ps-5 text-sm text-gray-600 dark:text-gray-300">
                  {section.items.map((item) => (
                    <li key={item.name}>{t(item)}</li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>

        {footerCta}
      </div>
    </div>
  );
}
