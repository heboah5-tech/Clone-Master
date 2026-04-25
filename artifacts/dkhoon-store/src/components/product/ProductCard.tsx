import { Link } from "wouter";
import { Eye, Star } from "lucide-react";
import { Product } from "@workspace/api-client-react";
import { useCart } from "@/lib/cart";
import { useToast } from "@/hooks/use-toast";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const { toast } = useToast();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    toast({
      title: "تمت الإضافة للسلة",
      description: `${product.nameAr} أضيف بنجاح.`,
    });
  };

  const imageToUse =
    product.imageUrl ||
    product.images?.[0] ||
    "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=800";
  const price = product.price;
  const originalPrice = product.originalPrice;
  const hasDiscount = originalPrice && originalPrice > price;
  const discountPct = hasDiscount
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0;
  const ratingValue = Math.round(product.rating ?? 5);

  return (
    <Link
      href={`/products/${product.id}`}
      className="group relative flex flex-col bg-card rounded-2xl overflow-hidden border border-border/60 shadow-sm hover:shadow-lg transition-all duration-300"
      data-testid={`product-card-${product.id}`}
    >
      {/* Image area with dark studio background */}
      <div className="relative aspect-square overflow-hidden bg-[#1f1d1a] rounded-2xl m-2 mb-0">
        <img
          src={imageToUse}
          alt={product.name}
          className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
        />

        {/* New / Bestseller chips top-right */}
        <div className="absolute top-2 right-2 z-10 flex flex-col gap-1.5 items-end">
          {product.isNew && (
            <span className="bg-primary/95 text-primary-foreground text-[10px] font-bold px-2 py-0.5 rounded-md shadow-sm">
              جديد
            </span>
          )}
          {product.isBestseller && (
            <span className="bg-secondary/95 text-secondary-foreground text-[10px] font-bold px-2 py-0.5 rounded-md shadow-sm">
              الأكثر مبيعاً
            </span>
          )}
        </div>
      </div>

      {/* Discount badge under image, top-left */}
      {hasDiscount && (
        <div className="px-3 pt-3">
          <span className="inline-block bg-[#e98a8a] text-[#5a1414] text-[11px] font-bold px-2.5 py-1 rounded-md">
            {discountPct}.0%
          </span>
        </div>
      )}

      {/* Body */}
      <div className="px-3 pb-3 pt-2 flex flex-col items-center text-center gap-1.5 flex-1">
        <h3 className="font-bold text-sm sm:text-base text-foreground line-clamp-2 leading-snug">
          {product.nameAr}
        </h3>

        {/* Stars */}
        <div className="flex items-center justify-center gap-0.5">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-3.5 h-3.5 ${
                i < ratingValue
                  ? "fill-[#f5b400] text-[#f5b400]"
                  : "fill-muted text-muted"
              }`}
            />
          ))}
        </div>

        {/* Price row: sale price (red) + original strikethrough */}
        <div className="flex items-baseline justify-center gap-2 flex-wrap mt-1">
          <span className="text-base sm:text-lg font-bold text-[#c92a2a]">
            <span className="ml-0.5">ر.س</span>
            {price.toFixed(2)}
          </span>
          {hasDiscount && (
            <span className="text-xs sm:text-sm text-muted-foreground line-through">
              <span className="ml-0.5">ر.س</span>
              {originalPrice.toFixed(2)}
            </span>
          )}
        </div>
      </div>

      {/* Bottom action bar */}
      <div className="flex items-stretch border-t border-border/60 mt-auto rounded-b-2xl overflow-hidden">
        <button
          type="button"
          onClick={handleAddToCart}
          className="flex-1 bg-[#1d1b18] text-white font-bold text-sm py-3.5 hover:bg-[#0f0e0c] transition-colors active:scale-[0.99]"
          data-testid={`button-add-to-cart-${product.id}`}
        >
          أضف للسلة
        </button>
        <div
          className="flex items-center justify-center w-14 bg-[#e9dccb] text-[#1d1b18]"
          aria-hidden
        >
          <Eye className="w-5 h-5" />
        </div>
      </div>
    </Link>
  );
}
