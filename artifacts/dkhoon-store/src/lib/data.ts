export interface Product {
  id: string;
  name_ar: string;
  name_en: string;
  description_ar: string;
  description_en: string;
  price: number;
  discountPrice?: number;
  category: string;
  image: string;
  isNew?: boolean;
  isBestseller?: boolean;
  rating: number;
  reviews: number;
}

export interface Category {
  id: string;
  name_ar: string;
  name_en: string;
  image: string;
}

export const categories: Category[] = [
  { id: "bukhoor", name_ar: "بخور", name_en: "Incense", image: "https://images.unsplash.com/photo-1608528577891-eb055944f2e7?auto=format&fit=crop&q=80&w=600" },
  { id: "mens-perfume", name_ar: "عطور رجالية", name_en: "Men's Perfumes", image: "https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&q=80&w=600" },
  { id: "womens-perfume", name_ar: "عطور نسائية", name_en: "Women's Perfumes", image: "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&q=80&w=600" },
  { id: "cosmetics", name_ar: "مستحضرات", name_en: "Cosmetics", image: "https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?auto=format&fit=crop&q=80&w=600" },
  { id: "gifts", name_ar: "هدايا", name_en: "Gift Sets", image: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&q=80&w=600" }
];

export const products: Product[] = [
  {
    id: "p1",
    name_ar: "عود ملكي",
    name_en: "Royal Oud",
    description_ar: "عطر فاخر يجمع بين الأصالة العربية والفخامة العصرية، مع نفحات من العود النقي والزعفران.",
    description_en: "A luxurious perfume combining Arabic authenticity with modern elegance, featuring pure oud and saffron notes.",
    price: 450,
    discountPrice: 380,
    category: "mens-perfume",
    image: "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=800",
    isBestseller: true,
    rating: 4.8,
    reviews: 124
  },
  {
    id: "p2",
    name_ar: "بخور الامارات",
    name_en: "Emirates Bukhoor",
    description_ar: "بخور تقليدي مصنوع من أجود أنواع العود والورد الطائفي، يملأ المكان بعبق لا يُنسى.",
    description_en: "Traditional incense made from the finest oud and Taif rose, filling the space with an unforgettable aroma.",
    price: 220,
    category: "bukhoor",
    image: "https://images.unsplash.com/photo-1608528577891-eb055944f2e7?auto=format&fit=crop&q=80&w=800",
    isBestseller: true,
    rating: 4.9,
    reviews: 89
  },
  {
    id: "p3",
    name_ar: "مسك الورد",
    name_en: "Rose Musk",
    description_ar: "عطر ناعم يجمع بين رائحة الورد الدمشقي والمسك الأبيض ليعطيك إحساساً بالانتعاش والنقاء.",
    description_en: "A soft fragrance combining Damask rose and white musk for a feeling of freshness and purity.",
    price: 180,
    discountPrice: 150,
    category: "womens-perfume",
    image: "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?auto=format&fit=crop&q=80&w=800",
    isNew: true,
    rating: 4.7,
    reviews: 56
  },
  {
    id: "p4",
    name_ar: "مجموعة العروس",
    name_en: "Bridal Set",
    description_ar: "مجموعة متكاملة للعناية والتعطير، تحتوي على عطور وبخور ولوشن الجسم الممزوج بالعود.",
    description_en: "A complete care and fragrance set, containing perfumes, incense, and oud-infused body lotion.",
    price: 850,
    category: "gifts",
    image: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&q=80&w=800",
    rating: 5.0,
    reviews: 34
  },
  {
    id: "p5",
    name_ar: "عنبر أصيل",
    name_en: "Authentic Amber",
    description_ar: "عطر دافئ وعميق بمكونات من العنبر الطبيعي والفانيليا والأخشاب الثمينة.",
    description_en: "A warm and deep fragrance with notes of natural amber, vanilla, and precious woods.",
    price: 320,
    category: "mens-perfume",
    image: "https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&q=80&w=800",
    isNew: true,
    rating: 4.6,
    reviews: 42
  }
];
