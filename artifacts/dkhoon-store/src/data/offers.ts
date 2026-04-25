export type Item = {
  id: string;
  titleAr: string;
  subtitleAr?: string;
  price: number;
  originalPrice?: number;
  image: string;
  badge?: string;
};

export const MAIN_OFFER: Item = {
  id: "fakhama",
  titleAr: "باقة فخامة دخوني",
  subtitleAr: "تشكيلة فاخرة من أرقى العطور والبخور الشرقية الأصيلة",
  price: 395,
  originalPrice: 1580,
  image: "/products/featured-offer.jpg",
};

export const MORE_OFFERS: Item[] = [
  {
    id: "tib",
    titleAr: "باقة الطيب",
    subtitleAr: "إصدار خاص — 7 عطور فاخرة في علبة هدية",
    price: 199,
    image: "/products/offer-tib-real.png",
    badge: "إصدار خاص",
  },
  {
    id: "nasamat",
    titleAr: "نسمات دخوني",
    subtitleAr: "تشكيلة من 8 عطور فاخرة بسعر مميز",
    price: 495,
    originalPrice: 1980,
    image: "/products/offer-nasamat.png",
  },
  {
    id: "omr",
    titleAr: "بشارة العمر",
    subtitleAr: "مجموعة فاخرة هدية مثالية للمناسبات",
    price: 495,
    originalPrice: 1980,
    image: "/products/offer-omr.jpg",
  },
  {
    id: "oudak",
    titleAr: "عودك دخوني",
    subtitleAr: "بخور دخون الإماراتية المميز",
    price: 395,
    originalPrice: 1580,
    image: "/products/offer-oudak.png",
    badge: "كود R20",
  },
  {
    id: "asturi",
    titleAr: "العرض الأسطوري",
    subtitleAr: "تشكيلة عطور دخوني الكاملة",
    price: 495,
    originalPrice: 788,
    image: "/products/offer-asturi.jpg",
  },
  {
    id: "desire",
    titleAr: "طقم DESIRE الفاخر",
    subtitleAr: "هدية مميزة بتغليف فاخر",
    price: 295,
    image: "/products/offer-desire.jpg",
  },
  {
    id: "travel",
    titleAr: "طقم TRAVEL KIT",
    subtitleAr: "ست عطور مينيتشر فاخرة",
    price: 245,
    image: "/products/offer-travel.jpg",
  },
];

export const FEATURED_PERFUMES: Item[] = [
  { id: "signature-white", titleAr: "Signature White", price: 195, image: "/products/p-signature-white.png" },
  { id: "oud-diwan", titleAr: "عود الديوان", price: 295, image: "/products/p-oud-diwan.png" },
  { id: "balqees", titleAr: "Balqees", price: 245, image: "/products/p-balqees.png" },
  { id: "aura", titleAr: "Aura", price: 195, image: "/products/p-aura.png" },
  { id: "dkhoon-leather", titleAr: "Dkhoon Leather", price: 225, image: "/products/p-dkhoon-leather.png" },
  { id: "abu-dhabi", titleAr: "Abu Dhabi", price: 245, image: "/products/p-abu-dhabi.png" },
  { id: "shiny", titleAr: "Shiny", price: 175, image: "/products/p-shiny.png" },
  { id: "signature-rose", titleAr: "Signature Rose Gold", price: 215, image: "/products/p-signature-rose.png" },
  { id: "tiamo", titleAr: "Tiamo", price: 195, image: "/products/p-tiamo.png" },
  { id: "sapphire", titleAr: "Sapphire", price: 245, image: "/products/p-sapphire.png" },
  { id: "dkhoon-desert", titleAr: "Dkhoon Desert", price: 225, image: "/products/p-dkhoon-desert.png" },
  { id: "dkhoon-rose", titleAr: "Dkhoon Rose", price: 225, image: "/products/p-dkhoon-rose.png" },
  { id: "kuhailan", titleAr: "كحيلان", price: 245, image: "/products/p-kuhailan.png" },
  { id: "zayed", titleAr: "Zayed", price: 295, image: "/products/p-zayed.png" },
  { id: "private-musk", titleAr: "Private Musk VIP", price: 175, image: "/products/p-private-musk.png" },
  { id: "haneet", titleAr: "Haneet", price: 195, image: "/products/p-haneet.png" },
  { id: "dkhoon-amber", titleAr: "Dkhoon Amber", price: 225, image: "/products/p-dkhoon-amber.png" },
  { id: "so-sweety", titleAr: "So Sweety", price: 175, image: "/products/p-so-sweety.png" },
  { id: "doha-skyline", titleAr: "Doha Skyline", price: 195, image: "/products/p-doha-skyline.png" },
  { id: "hilal-9", titleAr: "Hilal 9", price: 245, image: "/products/p-hilal-9.png" },
  { id: "signature-black", titleAr: "Signature Black", price: 215, image: "/products/p-signature-black.png" },
  { id: "private-velvet", titleAr: "Private Velvet & Rose", price: 225, image: "/products/p-private-velvet.png" },
  { id: "couture", titleAr: "كوتور Couture", price: 245, image: "/products/p-couture.png" },
];

export const BUKHOOR_ITEMS: Item[] = [
  { id: "dkhoon-emiratia", titleAr: "دخون الإماراتية", subtitleAr: "بخور فاخر برائحة آسرة", price: 295, image: "/products/b-dkhoon-emiratia.png" },
  { id: "oud-turath", titleAr: "عود التراث", subtitleAr: "بخور أصيل بنفحة شرقية", price: 245, image: "/products/b-oud-turath.png" },
  { id: "daqat-oud", titleAr: "دقة عود", subtitleAr: "تركيبة فريدة من العود الفاخر", price: 245, image: "/products/b-daqat-oud.png" },
];

const ALL_ITEMS: Item[] = [MAIN_OFFER, ...MORE_OFFERS, ...FEATURED_PERFUMES, ...BUKHOOR_ITEMS];

export function findItem(id: string | null | undefined): Item {
  if (!id) return MAIN_OFFER;
  return ALL_ITEMS.find((o) => o.id === id) ?? MAIN_OFFER;
}
