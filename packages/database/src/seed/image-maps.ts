/**
 * Verified Unsplash image URLs used deterministically for seeded products.
 */
export const PRODUCT_IMAGE_POOL: readonly string[] = [
  "https://images.unsplash.com/photo-1542751371-adc38448a05e",
  "https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf",
  "https://images.unsplash.com/photo-1509198397868-475647b2a1e5",
  "https://images.unsplash.com/photo-1498049794561-7780e7231661",
  "https://images.unsplash.com/photo-1519389950473-47ba0277781c",
  "https://images.unsplash.com/photo-1550751827-4bd374c3f58b",
  "https://images.unsplash.com/photo-1505740420928-5e560c06d30e",
  "https://images.unsplash.com/photo-1518770660439-4636190af475",
  "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04",
  "https://images.unsplash.com/photo-1488161628813-04466f872be2",
  "https://images.unsplash.com/photo-1507680434567-5739c80be1ac",
  "https://images.unsplash.com/photo-1527010154944-f2241763d806",
  "https://images.unsplash.com/photo-1483985988355-763728e1935b",
  "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f",
  "https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93",
  "https://images.unsplash.com/photo-1590330297626-d7aff25a0431",
  "https://images.unsplash.com/photo-1484154218962-a197022b5858",
  "https://images.unsplash.com/photo-1556911220-bff31c812dba",
  "https://images.unsplash.com/photo-1570222094114-d054a817e56b",
  "https://images.unsplash.com/photo-1495446815901-a7297e633e8d",
  "https://images.unsplash.com/photo-1532012197267-da84d127e765",
  "https://images.unsplash.com/photo-1517836357463-d25dfeac3438",
  "https://images.unsplash.com/photo-1552046122-03184de85e08",
  "https://images.unsplash.com/photo-1555041469-a586c61ea9bc",
  "https://images.unsplash.com/photo-1558060370-d644479cb6f7",
];

/**
 * Mapping from category `imageSeed` keys to verified Unsplash photo URLs.
 */
export const CATEGORY_IMAGE_MAP: Record<string, string> = {
  // Gaming
  gaming: "https://images.unsplash.com/photo-1542751371-adc38448a05e",
  ps5: "https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf",
  ps4: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5",
  "xbox-series": "https://images.unsplash.com/photo-1616588589676-62b3bd4ff6d2",
  "xbox-one": "https://images.unsplash.com/photo-1552820728-8b83bb6b773f",
  nintendo: "https://images.unsplash.com/photo-1493711662062-fa541adb3fc8",
  "gaming-acc": "https://images.unsplash.com/photo-1538481199705-c710c4e965fc",
  "pc-gaming": "https://images.unsplash.com/photo-1550745165-9bc0b252726f",
  "vr-headsets": "https://images.unsplash.com/photo-1534423861386-85a16f5d13fd",

  // Electronics
  electronics: "https://images.unsplash.com/photo-1498049794561-7780e7231661",
  laptops: "https://images.unsplash.com/photo-1519389950473-47ba0277781c",
  smartphones: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b",
  tvs: "https://images.unsplash.com/photo-1550009158-9ebf69173e03",
  tablets: "https://images.unsplash.com/photo-1548092372-0d1bd40894a3",
  headphones: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e",
  cameras: "https://images.unsplash.com/photo-1518770660439-4636190af475",
  smartwatches: "https://images.unsplash.com/photo-1555664424-778a1e5e1b48",
  networking: "https://images.unsplash.com/photo-1562408590-e32931084e23",

  // Men's Fashion
  "men-fashion": "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04",
  "men-tshirts": "https://images.unsplash.com/photo-1488161628813-04466f872be2",
  "men-jeans": "https://images.unsplash.com/photo-1507680434567-5739c80be1ac",
  "men-underwear": "https://images.unsplash.com/photo-1617113930975-f9c7243ae527",
  "men-shorts": "https://images.unsplash.com/photo-1617114919297-3c8ddb01f599",
  "men-shoes": "https://images.unsplash.com/photo-1527010154944-f2241763d806",

  // Women's Fashion
  "women-fashion": "https://images.unsplash.com/photo-1483985988355-763728e1935b",
  "women-tshirts": "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f",
  "women-dresses": "https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93",
  "women-jeans": "https://images.unsplash.com/photo-1532453288672-3a27e9be9efd",
  "women-shoes": "https://images.unsplash.com/photo-1554412933-514a83d2f3c8",
  "women-bags": "https://images.unsplash.com/photo-1590330297626-d7aff25a0431",

  // Home Appliances
  "home-appliances": "https://images.unsplash.com/photo-1484154218962-a197022b5858",
  refrigerators: "https://images.unsplash.com/photo-1556911220-bff31c812dba",
  "washing-machines": "https://images.unsplash.com/photo-1556909212-d5b604d0c90d",
  ovens: "https://images.unsplash.com/photo-1556185781-a47769abb7ee",
  "food-processors": "https://images.unsplash.com/photo-1570222094114-d054a817e56b",
  fryers: "https://images.unsplash.com/photo-1586208958839-06c17cacdf08",
  microwaves: "https://images.unsplash.com/photo-1588854337115-1c67d9247e4d",
  dishwashers: "https://images.unsplash.com/photo-1596552183299-000ef779e88d",
  vacuums: "https://images.unsplash.com/photo-1632923565835-6582b54f2105",

  // Books
  books: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d",
  "prog-books": "https://images.unsplash.com/photo-1532012197267-da84d127e765",
  novels: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f",
  "self-dev": "https://images.unsplash.com/photo-1457369804613-52c61a468e7d",
  "business-books": "https://images.unsplash.com/photo-1535905557558-afc4877a26fc",
  "arabic-literature": "https://images.unsplash.com/photo-1541963463532-d68292c34b19",

  // Sports & Fitness
  "sports-fitness": "https://images.unsplash.com/photo-1517836357463-d25dfeac3438",
  "gym-equipment": "https://images.unsplash.com/photo-1534438327276-14e5300c3a48",
  sportswear: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b",
  "running-shoes": "https://images.unsplash.com/photo-1526506118085-60ce8714f8c5",
  bicycles: "https://images.unsplash.com/photo-1571902943202-507ec2618e8f",

  // Beauty & Personal Care
  "beauty-care": "https://images.unsplash.com/photo-1552046122-03184de85e08",
  skincare: "https://images.unsplash.com/photo-1555820585-c5ae44394b79",
  perfumes: "https://images.unsplash.com/photo-1573461160327-b450ce3d8e7f",
  "hair-care": "https://images.unsplash.com/photo-1580870069867-74c57ee1bb07",
  grooming: "https://images.unsplash.com/photo-1581182800629-7d90925ad072",

  // Furniture & Home Decor
  "furniture-decor": "https://images.unsplash.com/photo-1555041469-a586c61ea9bc",
  "office-furniture": "https://images.unsplash.com/photo-1487015307662-6ce6210680f1",
  lighting: "https://images.unsplash.com/photo-1540932239986-30128078f3c5",
  bedding: "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92",
  "home-decor": "https://images.unsplash.com/photo-1586023492125-27b2c045efd7",

  // Toys & Baby
  "toys-baby": "https://images.unsplash.com/photo-1558060370-d644479cb6f7",
  "board-games": "https://images.unsplash.com/photo-1587654780291-39c9404d746b",
  "action-figures": "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1",
  "baby-gear": "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4",
};
