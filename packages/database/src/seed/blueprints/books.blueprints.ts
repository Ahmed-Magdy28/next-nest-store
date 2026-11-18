import type { CategoryBlueprint } from "./blueprint.types";

/** Books category blueprints. */
export const booksBlueprints: CategoryBlueprint[] = [
  // ── Books ──────────────────────────────────────────────
  {
    slug: "programming-books",
    parentSlug: "books",
    categoryType: "book",
    minPrice: 25,
    maxPrice: 75,
    brands: [
      { en: "O'Reilly Media", ar: "دار أوريلي" },
      { en: "No Starch Press", ar: "نو ستارش برس" },
      { en: "Addison-Wesley", ar: "أديسون ويسلي" },
      { en: "Pragmatic Bookshelf", ar: "براجماتيك" },
    ],
    models: [
      { en: "Designing Data-Intensive Applications", ar: "تصميم التطبيقات كثيفة البيانات" },
      { en: "Clean Architecture: A Craftsman's Guide", ar: "المعمارية النظيفة: دليل الحرفي البرمجي" },
      { en: "The Rust Programming Language (2nd Edition)", ar: "لغة البرمجة رست: الدليل العملي الكامل" },
      { en: "Learning TypeScript: Scalable JavaScript", ar: "تعلم تايب سكريبت لتطوير أنظمة متماسكة" },
    ],
  },
  {
    slug: "novels",
    parentSlug: "books",
    categoryType: "book",
    minPrice: 12,
    maxPrice: 35,
    brands: [
      { en: "Penguin Classics", ar: "بينجوين كلاسيكس" },
      { en: "HarperCollins", ar: "هاربر كولينز" },
      { en: "Tor Books", ar: "تور بوكس" },
    ],
    models: [
      { en: "Dune: Deluxe Collector's Illustrated Edition", ar: "رواية كثيب: الطبعة المصورة الفاخرة" },
      { en: "The Silent Patient Psychological Thriller", ar: "المريض الصامت: رواية تشويق وإثارة نفسية" },
      { en: "The Midnight Library Bestselling Novel", ar: "مكتبة منتصف الليل: رحلة بين الاختيارات الممكنة" },
      { en: "Project Hail Mary Sci-Fi Adventure", ar: "مشروع هيل ماري: مغامرة خيال علمي شيقة" },
    ],
  },
  {
    slug: "self-development",
    parentSlug: "books",
    categoryType: "book",
    minPrice: 14,
    maxPrice: 38,
    brands: [
      { en: "Avery Publishing", ar: "إيفري" },
      { en: "Portfolio Books", ar: "بورتفوليو" },
      { en: "Harper Business", ar: "هاربر بيزنس" },
    ],
    models: [
      { en: "Atomic Habits: Proven Tiny Changes Guide", ar: "العادات الذرية: بناء عادات حسنة والتخلص من السيئة" },
      { en: "The Psychology of Money: Timeless Wealth Lessons", ar: "سيكولوجية المال: دروس خالدة في الثروة والسعادة" },
      { en: "Deep Work: Rules for Focused Success", ar: "العمل العميق: قواعد النجاح المركز في عالم مشتت" },
      { en: "Thinking, Fast and Slow by Daniel Kahneman", ar: "التفكير بسرعة وببطء لدانيال كانيمان" },
    ],
  },
  {
    slug: "business-books",
    parentSlug: "books",
    categoryType: "book",
    minPrice: 16,
    maxPrice: 45,
    brands: [
      { en: "Harvard Business Review", ar: "هارفارد بيزنس ريفيو" },
      { en: "Penguin Business", ar: "بينجوين للأعمال" },
    ],
    models: [
      { en: "Zero to One: Notes on Startups", ar: "من الصفر إلى الواحد: بناء الشركات الناشئة" },
      { en: "The Lean Startup: Continuous Innovation", ar: "الشركة الناشئة المرنة: الابتكار المستمر" },
      { en: "Good to Great: Why Some Companies Leap", ar: "من جيد إلى عظيم: أسرار نجاح الشركات" },
    ],
  },
  {
    slug: "arabic-literature",
    parentSlug: "books",
    categoryType: "book",
    minPrice: 10,
    maxPrice: 30,
    brands: [
      { en: "Dar Al Shorouk", ar: "دار الشروق" },
      { en: "Al Karma Books", ar: "دار الكرمة" },
    ],
    models: [
      { en: "Classic Arabic Poetry Anthology", ar: "مختارات من روائع الشعر العربي" },
      { en: "Modern Cairo Short Stories Collection", ar: "مجموعة قصصية من الأدب العربي الحديث" },
    ],
  },

];
