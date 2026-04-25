import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Truck, Star } from "lucide-react";

const OFFER = {
  titleAr: "باقة فخامة دخوني",
  subtitleAr: "تشكيلة فاخرة من العطور الشرقية الأصيلة",
  price: 395,
  originalPrice: 1580,
  image: "/products/featured-offer.jpg",
};

export default function Home() {
  const discount = Math.round(((OFFER.originalPrice - OFFER.price) / OFFER.originalPrice) * 100);

  return (
    <div className="bg-background min-h-screen pb-16">
      <section className="container mx-auto px-4 pt-6 md:pt-10 max-w-3xl">
        <div className="bg-card rounded-3xl shadow-md border border-border/60 overflow-hidden">
          {/* Image */}
          <div className="relative bg-[#f3ece1]">
            <img
              src={OFFER.image}
              alt={OFFER.titleAr}
              className="w-full h-auto object-contain"
            />
            <div className="absolute top-4 right-4 bg-[#c92a2a] text-white text-sm font-bold px-3 py-1.5 rounded-lg shadow-md">
              خصم {discount}%
            </div>
          </div>

          {/* Body */}
          <div className="p-6 md:p-10 text-center flex flex-col items-center gap-5">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground leading-tight">
              {OFFER.titleAr}
            </h1>
            <p className="text-muted-foreground text-base md:text-lg max-w-xl">
              {OFFER.subtitleAr}
            </p>

            {/* Stars */}
            <div className="flex items-center justify-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-[#f5b400] text-[#f5b400]" />
              ))}
              <span className="text-xs text-muted-foreground mr-2 font-bold">(248 تقييم)</span>
            </div>

            {/* Price block */}
            <div className="flex items-baseline justify-center gap-3 flex-wrap">
              <span className="text-4xl md:text-5xl font-bold text-[#c92a2a]">
                <span className="text-2xl md:text-3xl ml-1">ر.س</span>
                {OFFER.price}
              </span>
              <span className="text-xl md:text-2xl text-muted-foreground line-through">
                <span className="text-base ml-1">ر.س</span>
                {OFFER.originalPrice}
              </span>
            </div>

            {/* Buy Now */}
            <Link href="/checkout" className="w-full max-w-md">
              <Button
                size="lg"
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 text-xl font-bold py-7 rounded-xl shadow-lg shadow-primary/20 transition-transform active:scale-[0.99]"
                data-testid="button-buy-now"
              >
                اشترِ الآن
              </Button>
            </Link>

            {/* Trust badges */}
            <div className="grid grid-cols-2 gap-4 w-full pt-4 border-t border-border/60">
              <div className="flex items-center justify-center gap-2 text-sm text-foreground/80 font-bold">
                <Truck className="w-5 h-5 text-primary" />
                شحن مجاني
              </div>
              <div className="flex items-center justify-center gap-2 text-sm text-foreground/80 font-bold">
                <ShieldCheck className="w-5 h-5 text-primary" />
                دفع آمن
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
