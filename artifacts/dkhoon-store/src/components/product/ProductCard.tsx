import { Link } from "wouter";
import { ShoppingBag, Star } from "lucide-react";
import { Product } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
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
    addToCart(product);
    toast({
      title: "تمت الإضافة للسلة",
      description: `${product.nameAr} أضيف بنجاح.`,
    });
  };

  const imageToUse = product.imageUrl || product.images?.[0] || "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=800";
  const price = product.price;
  const originalPrice = product.originalPrice;

  return (
    <Link href={`/products/${product.id}`} className="group relative flex flex-col bg-card rounded-lg overflow-hidden border border-border hover:border-primary/30 hover:shadow-md transition-all duration-300">
      
      {/* Badges */}
      <div className="absolute top-2 right-2 z-10 flex flex-col gap-1.5">
        {product.isNew && (
          <span className="bg-primary text-primary-foreground text-[10px] font-bold px-2 py-0.5 rounded shadow-sm">
            جديد
          </span>
        )}
        {product.isBestseller && (
          <span className="bg-secondary text-secondary-foreground text-[10px] font-bold px-2 py-0.5 rounded shadow-sm">
            الأكثر مبيعاً
          </span>
        )}
        {originalPrice && originalPrice > price && (
          <span className="bg-destructive text-destructive-foreground text-[10px] font-bold px-2 py-0.5 rounded shadow-sm">
            تخفيض {Math.round(((originalPrice - price) / originalPrice) * 100)}%
          </span>
        )}
      </div>

      {/* Image */}
      <div className="aspect-square overflow-hidden bg-background relative p-4">
        <img
          src={imageToUse}
          alt={product.name}
          className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      {/* Content */}
      <div className="p-3 sm:p-4 flex flex-col flex-1 gap-2 border-t border-border/50">
        <div className="flex items-center text-secondary text-xs mb-1">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className={`w-3 h-3 ${i < Math.floor(product.rating || 5) ? 'fill-current' : 'opacity-30'}`} />
          ))}
          <span className="text-muted-foreground mr-1">({product.reviewCount})</span>
        </div>

        <h3 className="font-bold text-sm sm:text-base text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-snug">
          {product.nameAr}
        </h3>
        
        <div className="mt-auto pt-2 flex flex-col gap-1">
          <div className="flex items-baseline gap-2 flex-wrap">
            <span className="text-base sm:text-lg font-bold text-primary">{price} د.إ</span>
            {originalPrice && originalPrice > price && (
              <span className="text-xs sm:text-sm text-muted-foreground line-through">{originalPrice} د.إ</span>
            )}
          </div>
        </div>

        <Button
          variant="default"
          className="w-full mt-2 bg-primary text-primary-foreground hover:bg-primary/90 font-bold h-10 gap-2 shadow-sm rounded-md transition-transform active:scale-95"
          onClick={handleAddToCart}
        >
          <ShoppingBag className="w-4 h-4" />
          أضف للسلة
        </Button>
      </div>
    </Link>
  );
}