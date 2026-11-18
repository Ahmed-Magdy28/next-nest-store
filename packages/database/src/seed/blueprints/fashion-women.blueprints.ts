import type { CategoryBlueprint } from "./blueprint.types";

/** Women's fashion category blueprints. */
export const fashionWomenBlueprints: CategoryBlueprint[] = [
  // ── Women's Fashion ────────────────────────────────────
  {
    slug: "women-tshirts",
    parentSlug: "women-fashion",
    categoryType: "clothing",
    minPrice: 15,
    maxPrice: 55,
    brands: [
      { en: "Zara", ar: "زارا" },
      { en: "Mango", ar: "مانجو" },
      { en: "H&M", ar: "إتش آند إم" },
      { en: "Bershka", ar: "بيرشكا" },
    ],
    models: [
      { en: "Soft Ribbed Crop Baby Tee", ar: "تيشيرت كروب ناعم مضلع بقصة مريحة" },
      { en: "Relaxed Fit Organic Cotton Graphic Tee", ar: "تيشيرت قطن عضوي فضفاض بطبعة ورود أنيقة" },
      { en: "V-Neck Short Sleeve Casual Top", ar: "بلوزة يومية بياقة سبعة وخامة انسيابية" },
    ],
  },
  {
    slug: "women-dresses",
    parentSlug: "women-fashion",
    categoryType: "clothing",
    minPrice: 35,
    maxPrice: 180,
    brands: [
      { en: "Zara", ar: "زارا" },
      { en: "Mango", ar: "مانجو" },
      { en: "ASOS", ar: "أسوس" },
      { en: "Massimo Dutti", ar: "ماسيمو دوتي" },
    ],
    models: [
      { en: "Flowy Floral Tiered Maxi Dress", ar: "فستان ماكسي طويل مورد بأكمام منسدلة" },
      { en: "Elegance Satin Slip Evening Dress", ar: "فستان سهرة ستان ناعم وأنيق للمناسبات" },
      { en: "Ribbed Knit Bodycon Midi Dress", ar: "فستان تريكو ميدي مجسم بتصميم عصري" },
      { en: "Linen Blend Belted Shirt Dress", ar: "فستان قميص كتان مع حزام خصر ربيعي" },
    ],
  },
  {
    slug: "women-jeans",
    parentSlug: "women-fashion",
    categoryType: "clothing",
    minPrice: 35,
    maxPrice: 110,
    brands: [
      { en: "Levi's", ar: "ليفايز" },
      { en: "Zara", ar: "زارا" },
      { en: "Stradivarius", ar: "ستراديفاريوس" },
    ],
    models: [
      { en: "High-Waist Wide-Leg Denim Trousers", ar: "بنطلون جينز واسع بخصر عالٍ وتصميم تريندي" },
      { en: "Vintage Mom Fit High Rise Jeans", ar: "جينز مام فيت عالي الخصر بقصة مريحة كلاسيكية" },
      { en: "Sculpting Skinny Jeans with Stretch", ar: "بنطال جينز سكيني مطاطي مريح ومحدد للقوام" },
    ],
  },
  {
    slug: "women-shoes",
    parentSlug: "women-fashion",
    categoryType: "shoes",
    minPrice: 35,
    maxPrice: 175,
    brands: [
      { en: "Steve Madden", ar: "ستيف مادن" },
      { en: "Aldo", ar: "ألدو" },
      { en: "Nike", ar: "نايكي" },
      { en: "Mango", ar: "مانجو" },
    ],
    models: [
      { en: "Chunky Platform Retro Sneakers", ar: "سنيكرز بلاتفورم مريح بنعل سميك وتصميم عصري" },
      { en: "Block Heel Leather Ankle Boots", ar: "بوت جلد بكعب عريض مربع ومريح للمشي" },
      { en: "Strappy Square-Toe Heeled Sandals", ar: "صندل أنيق بسيور ناعمة ومقدمة مربعة" },
      { en: "Soft Leather Pointed Ballet Flats", ar: "حذاء فلات باليه جلد ناعم بمقدمة مدببة" },
    ],
  },
  {
    slug: "women-bags",
    parentSlug: "women-fashion",
    categoryType: "clothing",
    minPrice: 30,
    maxPrice: 220,
    brands: [
      { en: "Guess", ar: "جيس" },
      { en: "Michael Kors", ar: "مايكل كورس" },
      { en: "Aldo", ar: "ألدو" },
      { en: "Zara", ar: "زارا" },
    ],
    models: [
      { en: "Quilted Faux Leather Crossbody Bag", ar: "حقيبة كروس جلد مبطن بسلسلة ذهبية أنيقة" },
      { en: "Large Canvas Everyday Tote Bag", ar: "حقيبة يد توت واسعة من الكانفاس للعمل والجامعة" },
      { en: "Croissant Leather Shoulder Bag", ar: "حقيبة كتف جلد كرواسون بتصميم عصري مميز" },
      { en: "Mini structured Evening Clutch", ar: "كلتش سهرة صغير ولامع مزود بحمالة كتف" },
    ],
  },

];
