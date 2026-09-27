export interface CategorySeed {
  name: string;
  arName: string;
  slug: string;
  imageSeed: string; // للاستخدام مع categoryImage
  children?: CategorySeed[];
}

export const categoriesData: CategorySeed[] = [
  // ═══════════════════════════════════════════════════════
  // Gaming
  // ═══════════════════════════════════════════════════════
  {
    name: "Gaming",
    arName: "الألعاب",
    slug: "gaming",
    imageSeed: "gaming",
    children: [
      {
        name: "PlayStation 5",
        arName: "بلايستيشن 5",
        slug: "playstation-5",
        imageSeed: "ps5",
      },
      {
        name: "PlayStation 4",
        arName: "بلايستيشن 4",
        slug: "playstation-4",
        imageSeed: "ps4",
      },
      {
        name: "Xbox Series X|S",
        arName: "إكس بوكس سيريس",
        slug: "xbox-series",
        imageSeed: "xbox-series",
      },
      {
        name: "Xbox One",
        arName: "إكس بوكس ون",
        slug: "xbox-one",
        imageSeed: "xbox-one",
      },
      {
        name: "Nintendo Switch",
        arName: "نينتندو سويتش",
        slug: "nintendo-switch",
        imageSeed: "nintendo",
      },
      {
        name: "Gaming Accessories",
        arName: "ملحقات الألعاب",
        slug: "gaming-accessories",
        imageSeed: "gaming-acc",
      },
    ],
  },

  // ═══════════════════════════════════════════════════════
  // Electronics
  // ═══════════════════════════════════════════════════════
  {
    name: "Electronics",
    arName: "الإلكترونيات",
    slug: "electronics",
    imageSeed: "electronics",
    children: [
      {
        name: "Laptops",
        arName: "لابتوبات",
        slug: "laptops",
        imageSeed: "laptops",
      },
      {
        name: "Smartphones",
        arName: "هواتف ذكية",
        slug: "smartphones",
        imageSeed: "smartphones",
      },
      {
        name: "TVs & Monitors",
        arName: "تلفزيونات وشاشات",
        slug: "tvs-monitors",
        imageSeed: "tvs",
      },
      {
        name: "Tablets",
        arName: "تابلت",
        slug: "tablets",
        imageSeed: "tablets",
      },
      {
        name: "Headphones",
        arName: "سماعات",
        slug: "headphones",
        imageSeed: "headphones",
      },
      {
        name: "Cameras",
        arName: "كاميرات",
        slug: "cameras",
        imageSeed: "cameras",
      },
    ],
  },

  // ═══════════════════════════════════════════════════════
  // Men's Fashion
  // ═══════════════════════════════════════════════════════
  {
    name: "Men's Fashion",
    arName: "أزياء رجالية",
    slug: "men-fashion",
    imageSeed: "men-fashion",
    children: [
      {
        name: "Men's T-Shirts",
        arName: "تيشيرتات رجالية",
        slug: "men-tshirts",
        imageSeed: "men-tshirts",
      },
      {
        name: "Men's Jeans",
        arName: "بناطيل جينز رجالية",
        slug: "men-jeans",
        imageSeed: "men-jeans",
      },
      {
        name: "Men's Underwear",
        arName: "ملابس داخلية رجالية",
        slug: "men-underwear",
        imageSeed: "men-underwear",
      },
      {
        name: "Men's Shorts",
        arName: "شورتات رجالية",
        slug: "men-shorts",
        imageSeed: "men-shorts",
      },
      {
        name: "Men's Shoes",
        arName: "أحذية رجالية",
        slug: "men-shoes",
        imageSeed: "men-shoes",
      },
    ],
  },

  // ═══════════════════════════════════════════════════════
  // Women's Fashion
  // ═══════════════════════════════════════════════════════
  {
    name: "Women's Fashion",
    arName: "أزياء نسائية",
    slug: "women-fashion",
    imageSeed: "women-fashion",
    children: [
      {
        name: "Women's T-Shirts",
        arName: "تيشيرتات نسائية",
        slug: "women-tshirts",
        imageSeed: "women-tshirts",
      },
      {
        name: "Women's Dresses",
        arName: "فساتين نسائية",
        slug: "women-dresses",
        imageSeed: "women-dresses",
      },
      {
        name: "Women's Jeans",
        arName: "بناطيل جينز نسائية",
        slug: "women-jeans",
        imageSeed: "women-jeans",
      },
      {
        name: "Women's Shoes",
        arName: "أحذية نسائية",
        slug: "women-shoes",
        imageSeed: "women-shoes",
      },
      {
        name: "Women's Bags",
        arName: "حقائب نسائية",
        slug: "women-bags",
        imageSeed: "women-bags",
      },
    ],
  },

  // ═══════════════════════════════════════════════════════
  // Home Appliances
  // ═══════════════════════════════════════════════════════
  {
    name: "Home Appliances",
    arName: "أجهزة منزلية",
    slug: "home-appliances",
    imageSeed: "home-appliances",
    children: [
      {
        name: "Refrigerators",
        arName: "ثلاجات",
        slug: "refrigerators",
        imageSeed: "refrigerators",
      },
      {
        name: "Washing Machines",
        arName: "غسالات",
        slug: "washing-machines",
        imageSeed: "washing-machines",
      },
      {
        name: "Ovens & Stoves",
        arName: "بوتاجازات وأفران",
        slug: "ovens-stoves",
        imageSeed: "ovens",
      },
      {
        name: "Food Processors",
        arName: "محضرات طعام",
        slug: "food-processors",
        imageSeed: "food-processors",
      },
      {
        name: "Fryers",
        arName: "قلايات",
        slug: "fryers",
        imageSeed: "fryers",
      },
      {
        name: "Microwaves",
        arName: "ميكروويف",
        slug: "microwaves",
        imageSeed: "microwaves",
      },
      {
        name: "Dishwashers",
        arName: "غسالات أطباق",
        slug: "dishwashers",
        imageSeed: "dishwashers",
      },
      {
        name: "Vacuum Cleaners",
        arName: "مكانس كهربائية",
        slug: "vacuum-cleaners",
        imageSeed: "vacuums",
      },
    ],
  },

  // ═══════════════════════════════════════════════════════
  // Books
  // ═══════════════════════════════════════════════════════
  {
    name: "Books",
    arName: "كتب",
    slug: "books",
    imageSeed: "books",
    children: [
      {
        name: "Programming Books",
        arName: "كتب برمجة",
        slug: "programming-books",
        imageSeed: "prog-books",
      },
      {
        name: "Novels",
        arName: "روايات",
        slug: "novels",
        imageSeed: "novels",
      },
      {
        name: "Self Development",
        arName: "تطوير الذات",
        slug: "self-development",
        imageSeed: "self-dev",
      },
    ],
  },
];
