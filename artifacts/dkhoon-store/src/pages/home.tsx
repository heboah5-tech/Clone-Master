import { useEffect, useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Truck, Star, Sparkles, Clock, BadgePercent, Gift, RotateCcw } from "lucide-react";

const OFFER = {
  titleAr: "باقة فخامة دخوني",
  subtitleAr: "تشكيلة فاخرة من أرقى العطور والبخور الشرقية الأصيلة",
  price: 395,
  originalPrice: 1580,
  image: "/products/featured-offer.jpg",
};

function useCountdown(initialSeconds: number) {
  const [s, setS] = useState(initialSeconds);
  useEffect(() => {
    const t = setInterval(() => setS((v) => (v > 0 ? v - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, []);
  const hh = String(Math.floor(s / 3600)).padStart(2, "0");
  const mm = String(Math.floor((s % 3600) / 60)).padStart(2, "0");
  const ss = String(s % 60).padStart(2, "0");
  return { hh, mm, ss };
}

export default function Home() {
  const discount = Math.round(((OFFER.originalPrice - OFFER.price) / OFFER.originalPrice) * 100);
  const saved = OFFER.originalPrice - OFFER.price;
  const { hh, mm, ss } = useCountdown(6 * 3600 + 24 * 60 + 18);

  return (
    <div className="bg-gradient-to-b from-background via-background to-[#efe6d5] min-h-screen pb-12">
      {/* Decorative gold orbs */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[500px] overflow-hidden -z-0">
        <div className="absolute top-10 -right-20 w-64 h-64 rounded-full bg-secondary/15 blur-3xl" />
        <div className="absolute top-32 -left-20 w-72 h-72 rounded-full bg-primary/10 blur-3xl" />
      </div>

      <section className="container mx-auto px-3 sm:px-4 pt-4 sm:pt-8 max-w-3xl relative">
        {/* Tag line above */}
        <div className="flex items-center justify-center gap-2 mb-3 sm:mb-5 text-primary font-bold text-xs sm:text-sm">
          <Sparkles className="w-4 h-4 fill-secondary text-secondary" />
          <span className="tracking-wider">عرض حصري لفترة محدودة</span>
          <Sparkles className="w-4 h-4 fill-secondary text-secondary" />
        </div>

        <div className="bg-card rounded-3xl shadow-xl shadow-primary/5 border border-border/40 overflow-hidden relative">
          {/* Top ribbon */}
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-primary via-secondary to-primary z-10" />

          {/* Image */}
          <div className="relative bg-gradient-to-b from-[#f8f1e2] to-[#ede1c8]">
            <img
              src={OFFER.image}
              alt={OFFER.titleAr}
              className="w-full h-auto object-contain"
            />
            {/* Discount badge */}
            <div className="absolute top-3 right-3 sm:top-5 sm:right-5 z-10">
              <div className="bg-gradient-to-br from-[#d63333] to-[#a01818] text-white text-sm sm:text-base font-bold px-3 py-1.5 sm:px-4 sm:py-2 rounded-2xl shadow-lg flex items-center gap-1.5">
                <BadgePercent className="w-4 h-4" />
                خصم {discount}%
              </div>
            </div>
            {/* Save badge */}
            <div className="absolute bottom-3 left-3 sm:bottom-5 sm:left-5 z-10 bg-emerald-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md">
              توفير ر.س {saved}
            </div>
          </div>

          {/* Body */}
          <div className="p-5 sm:p-8 md:p-10 text-center flex flex-col items-center gap-4 sm:gap-5">
            {/* Stars */}
            <div className="flex items-center justify-center gap-1">
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 sm:w-5 sm:h-5 fill-[#f5b400] text-[#f5b400]" />
                ))}
              </div>
              <span className="text-[11px] sm:text-xs text-muted-foreground mr-2 font-bold">
                (248 تقييم)
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground leading-tight">
              {OFFER.titleAr}
            </h1>
            <p className="text-muted-foreground text-sm sm:text-base md:text-lg max-w-xl leading-relaxed -mt-1">
              {OFFER.subtitleAr}
            </p>

            {/* Price block */}
            <div className="w-full max-w-md bg-gradient-to-br from-[#fff7e8] to-[#faecc6] border border-secondary/30 rounded-2xl px-5 py-4 mt-1">
              <div className="text-[11px] sm:text-xs font-bold text-muted-foreground mb-1 tracking-wide">
                السعر بعد الخصم
              </div>
              <div className="flex items-baseline justify-center gap-3 flex-wrap">
                <span className="text-4xl sm:text-5xl md:text-6xl font-bold text-primary leading-none">
                  {OFFER.price}
                  <span className="text-xl sm:text-2xl mr-1.5 align-middle">ر.س</span>
                </span>
                <span className="text-base sm:text-lg text-muted-foreground line-through font-medium">
                  بدلاً من {OFFER.originalPrice} ر.س
                </span>
              </div>
            </div>

            {/* Countdown */}
            <div className="w-full max-w-md flex items-center justify-center gap-2 sm:gap-3 bg-foreground/95 text-white rounded-xl py-3 px-4">
              <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-secondary shrink-0" />
              <span className="text-xs sm:text-sm font-bold">ينتهي العرض خلال</span>
              <div className="flex items-center gap-1 sm:gap-1.5 font-mono font-bold text-base sm:text-lg" dir="ltr">
                <span className="bg-white/15 rounded px-1.5 py-0.5 min-w-[36px] text-center">{hh}</span>
                <span className="text-secondary">:</span>
                <span className="bg-white/15 rounded px-1.5 py-0.5 min-w-[36px] text-center">{mm}</span>
                <span className="text-secondary">:</span>
                <span className="bg-white/15 rounded px-1.5 py-0.5 min-w-[36px] text-center">{ss}</span>
              </div>
            </div>

            {/* Buy Now */}
            <Link href="/checkout" className="w-full max-w-md">
              <Button
                size="lg"
                className="w-full bg-gradient-to-br from-primary to-[#5a1414] text-primary-foreground hover:opacity-95 text-lg sm:text-xl font-bold py-7 sm:py-8 rounded-2xl shadow-xl shadow-primary/25 transition-all active:scale-[0.98] hover:shadow-2xl hover:shadow-primary/30"
                data-testid="button-buy-now"
              >
                <Gift className="w-5 h-5 ml-2" />
                اشترِ الآن
              </Button>
            </Link>

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-2 sm:gap-4 w-full pt-4 mt-1 border-t border-border/60">
              <div className="flex flex-col items-center gap-1.5 text-foreground/80">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-secondary/15 flex items-center justify-center">
                  <Truck className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                </div>
                <span className="text-[11px] sm:text-xs font-bold text-center">شحن مجاني</span>
              </div>
              <div className="flex flex-col items-center gap-1.5 text-foreground/80">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-secondary/15 flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                </div>
                <span className="text-[11px] sm:text-xs font-bold text-center">دفع آمن</span>
              </div>
              <div className="flex flex-col items-center gap-1.5 text-foreground/80">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-secondary/15 flex items-center justify-center">
                  <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                </div>
                <span className="text-[11px] sm:text-xs font-bold text-center">إرجاع مجاني</span>
              </div>
            </div>
          </div>
        </div>

        {/* What's inside */}
        <div className="mt-6 sm:mt-8 bg-card rounded-2xl border border-border/40 shadow-sm p-5 sm:p-7">
          <h2 className="text-lg sm:text-xl font-bold text-foreground mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-secondary fill-secondary" />
            ماذا تتضمن الباقة؟
          </h2>
          <ul className="space-y-3 text-sm sm:text-base text-foreground/85">
            {[
              "طقم عطر TRAVEL KIT الفاخر",
              "عطر DESIRE الشرقي الأصيل",
              "مجموعة العطور المنوعة (CASA · MASTER · DESIRE)",
              "تغليف هدايا فاخر مجاني",
            ].map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span className="mt-0.5 w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold shrink-0">
                  ✓
                </span>
                <span className="font-medium leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
