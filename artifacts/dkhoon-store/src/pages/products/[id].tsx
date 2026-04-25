import { useParams, Link, useLocation } from "wouter";
import { useState } from "react";
import { useGetProduct } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart";
import { useToast } from "@/hooks/use-toast";
import {
  Star,
  Minus,
  Plus,
  ShoppingBag,
  ArrowRight,
  Loader2,
  Sparkles,
  BadgePercent,
  Truck,
  ShieldCheck,
  RotateCcw,
  Gift,
} from "lucide-react";

export default function ProductDetail() {
  const params = useParams();
  const [, navigate] = useLocation();
  const id = parseInt(params.id || "0");
  const { addToCart } = useCart();
  const { toast } = useToast();
  const [quantity, setQuantity] = useState(1);

  const { data: product, isLoading } = useGetProduct(id, {
    query: { enabled: !!id, queryKey: ["/api/products", id] },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <h1 className="text-2xl font-bold mb-4 text-foreground">المنتج غير موجود</h1>
        <Link href="/products">
          <Button variant="outline" className="font-bold border-primary text-primary">
            العودة للمنتجات
          </Button>
        </Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product, quantity);
    toast({
      title: "تمت الإضافة للسلة",
      description: `تم إضافة ${quantity} من ${product.nameAr} بنجاح.`,
    });
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    navigate("/checkout");
  };

  const imageToUse = product.imageUrl || product.images?.[0] || "/products/oud-perfume.png";
  const price = product.price;
  const originalPrice = product.originalPrice;
  const hasDiscount = originalPrice && originalPrice > price;
  const discount = hasDiscount ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;
  const saved = hasDiscount ? originalPrice - price : 0;
  const totalPrice = price * quantity;

  return (
    <div className="bg-gradient-to-b from-background via-background to-[#efe6d5] min-h-screen pb-32 lg:pb-12 relative">
      {/* Decorative orbs */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[500px] overflow-hidden -z-0">
        <div className="absolute top-10 -right-20 w-64 h-64 rounded-full bg-secondary/15 blur-3xl" />
        <div className="absolute top-32 -left-20 w-72 h-72 rounded-full bg-primary/10 blur-3xl" />
      </div>

      <section className="container mx-auto px-3 sm:px-4 pt-4 sm:pt-8 max-w-3xl relative">
        {/* Back link */}
        <Link
          href="/products"
          className="inline-flex items-center text-xs sm:text-sm font-bold text-muted-foreground hover:text-primary mb-3 transition-colors"
        >
          <ArrowRight className="w-4 h-4 ml-1.5" />
          العودة للمنتجات
        </Link>

        {/* Tagline */}
        {hasDiscount && (
          <div className="flex items-center justify-center gap-2 mb-3 sm:mb-5 text-primary font-bold text-xs sm:text-sm">
            <Sparkles className="w-4 h-4 fill-secondary text-secondary" />
            <span className="tracking-wider">عرض خاص لفترة محدودة</span>
            <Sparkles className="w-4 h-4 fill-secondary text-secondary" />
          </div>
        )}

        <div className="bg-card rounded-3xl shadow-xl shadow-primary/5 border border-border/40 overflow-hidden relative">
          {/* Top ribbon */}
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-primary via-secondary to-primary z-10" />

          {/* Image */}
          <div className="relative bg-gradient-to-b from-[#f8f1e2] to-[#ede1c8]">
            <img
              src={imageToUse}
              alt={product.nameAr}
              className="w-full h-auto max-h-[460px] object-contain mx-auto p-6"
            />
            {hasDiscount && (
              <div className="absolute top-3 right-3 sm:top-5 sm:right-5 z-10">
                <div className="bg-gradient-to-br from-[#d63333] to-[#a01818] text-white text-sm sm:text-base font-bold px-3 py-1.5 sm:px-4 sm:py-2 rounded-2xl shadow-lg flex items-center gap-1.5">
                  <BadgePercent className="w-4 h-4" />
                  خصم {discount}%
                </div>
              </div>
            )}
            {hasDiscount && (
              <div className="absolute bottom-3 left-3 sm:bottom-5 sm:left-5 z-10 bg-emerald-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md">
                توفير ر.س {saved}
              </div>
            )}
          </div>

          {/* Body */}
          <div className="p-5 sm:p-8 md:p-10 text-center flex flex-col items-center gap-4 sm:gap-5">
            {/* Category pill */}
            {product.categoryNameAr && (
              <span className="text-secondary font-bold text-[11px] tracking-widest uppercase bg-secondary/10 px-3 py-1 rounded-full">
                {product.categoryNameAr}
              </span>
            )}

            {/* Stars */}
            <div className="flex items-center justify-center gap-1">
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 sm:w-5 sm:h-5 ${
                      i < Math.floor(product.rating || 5)
                        ? "fill-[#f5b400] text-[#f5b400]"
                        : "text-[#f5b400] opacity-30"
                    }`}
                  />
                ))}
              </div>
              <span className="text-[11px] sm:text-xs text-muted-foreground mr-2 font-bold">
                ({product.reviewCount} تقييم)
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground leading-tight">
              {product.nameAr}
            </h1>

            {product.descriptionAr && (
              <p className="text-muted-foreground text-sm sm:text-base max-w-xl leading-relaxed -mt-1">
                {product.descriptionAr}
              </p>
            )}

            {/* Price block */}
            <div className="w-full max-w-md bg-gradient-to-br from-[#fff7e8] to-[#faecc6] border border-secondary/30 rounded-2xl px-5 py-4 mt-1">
              <div className="text-[11px] sm:text-xs font-bold text-muted-foreground mb-1 tracking-wide">
                {hasDiscount ? "السعر بعد الخصم" : "السعر"}
              </div>
              <div className="flex items-baseline justify-center gap-3 flex-wrap">
                <span className="text-4xl sm:text-5xl md:text-6xl font-bold text-primary leading-none">
                  {price}
                  <span className="text-xl sm:text-2xl mr-1.5 align-middle">ر.س</span>
                </span>
                {hasDiscount && (
                  <span className="text-base sm:text-lg text-muted-foreground line-through font-medium">
                    بدلاً من {originalPrice} ر.س
                  </span>
                )}
              </div>
              <p className="text-[10px] text-muted-foreground font-medium mt-1">
                السعر شامل ضريبة القيمة المضافة
              </p>
            </div>

            {/* Quantity */}
            <div className="flex items-center justify-center gap-3 w-full max-w-md">
              <span className="text-sm font-bold text-foreground/80">الكمية</span>
              <div className="flex items-center border border-border rounded-xl bg-background p-1">
                <button
                  type="button"
                  className="w-9 h-9 flex items-center justify-center text-foreground hover:bg-muted rounded-md transition-colors disabled:opacity-40"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                  data-testid="button-decrease-quantity"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <div className="w-12 h-9 flex items-center justify-center font-bold text-base">
                  {quantity}
                </div>
                <button
                  type="button"
                  className="w-9 h-9 flex items-center justify-center text-foreground hover:bg-muted rounded-md transition-colors"
                  onClick={() => setQuantity(quantity + 1)}
                  data-testid="button-increase-quantity"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              {quantity > 1 && (
                <span className="text-sm font-bold text-primary">= ر.س {totalPrice}</span>
              )}
            </div>

            {/* Buy Now */}
            <div className="w-full max-w-md flex flex-col gap-2.5">
              <Button
                size="lg"
                onClick={handleBuyNow}
                className="w-full bg-gradient-to-br from-primary to-[#5a1414] text-primary-foreground hover:opacity-95 text-lg sm:text-xl font-bold py-7 sm:py-8 rounded-2xl shadow-xl shadow-primary/25 transition-all active:scale-[0.98] hover:shadow-2xl hover:shadow-primary/30"
                data-testid="button-buy-now"
              >
                <Gift className="w-5 h-5 ml-2" />
                اشترِ الآن
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={handleAddToCart}
                className="w-full border-2 border-primary/30 text-primary hover:bg-primary/5 hover:border-primary font-bold py-6 rounded-2xl"
                data-testid="button-add-to-cart"
              >
                <ShoppingBag className="w-5 h-5 ml-2" />
                إضافة للسلة
              </Button>
            </div>

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
      </section>

      {/* Sticky mobile bottom bar */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-card/95 backdrop-blur border-t border-border shadow-2xl px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <div className="flex items-center justify-between mb-2">
          <div>
            <div className="text-[11px] text-muted-foreground font-bold">الإجمالي</div>
            <div className="text-xl font-bold text-primary leading-tight">ر.س {totalPrice}</div>
          </div>
          <div className="flex items-center border border-border rounded-lg bg-background">
            <button
              type="button"
              className="w-8 h-8 flex items-center justify-center disabled:opacity-40"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              disabled={quantity <= 1}
              aria-label="تقليل الكمية"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <div className="w-8 h-8 flex items-center justify-center font-bold text-sm">{quantity}</div>
            <button
              type="button"
              className="w-8 h-8 flex items-center justify-center"
              onClick={() => setQuantity(quantity + 1)}
              aria-label="زيادة الكمية"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
        <Button
          type="button"
          onClick={handleBuyNow}
          size="lg"
          className="w-full bg-gradient-to-br from-primary to-[#5a1414] text-primary-foreground font-bold text-base rounded-xl shadow-lg shadow-primary/25 active:scale-[0.99] py-6"
          data-testid="button-buy-now-mobile"
        >
          <Gift className="w-4 h-4 ml-2" />
          اشترِ الآن
        </Button>
      </div>
    </div>
  );
}
