import { Link } from "wouter";
import { ShoppingCart, Star } from "lucide-react";
import { Product } from "@/lib/data";
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
    e.preventDefault(); // Prevent navigating to product detail
    addToCart(product);
    toast({
      title: "تمت الإضافة للسلة",
      description: `${product.name_ar} أضيف بنجاح.`,
    });
  };

  return (
    <Link href={`/products/${product.id}`} className="group relative block bg-card rounded-lg overflow-hidden border border-border hover:border-primary/50 transition-all duration-300">
      
      {/* Badges */}
      <div className="absolute top-3 right-3 z-10 flex flex-col gap-2">
        {product.isNew && (
          <span className="bg-primary text-primary-foreground text-xs font-bold px-2 py-1 rounded shadow-sm">
            جديد
          </span>
        )}
        {product.isBestseller && (
          <span className="bg-foreground text-background text-xs font-bold px-2 py-1 rounded shadow-sm">
            الأكثر مبيعاً
          </span>
        )}
        {product.discountPrice && (
          <span className="bg-destructive text-destructive-foreground text-xs font-bold px-2 py-1 rounded shadow-sm">
            تخفيض
          </span>
        )}
      </div>

      {/* Image */}
      <div className="aspect-[4/5] overflow-hidden bg-muted relative">
        <img
          src={product.image}
          alt={product.name_en}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col gap-3">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors line-clamp-1">{product.name_ar}</h3>
            <p className="text-xs text-muted-foreground uppercase tracking-wider">{product.name_en}</p>
          </div>
          <div className="flex items-center text-primary text-xs">
            <Star className="w-3 h-3 fill-current" />
            <span className="mr-1 text-foreground">{product.rating}</span>
          </div>
        </div>

        <div className="flex items-center justify-between mt-auto pt-2">
          <div className="flex flex-col">
            {product.discountPrice ? (
              <>
                <span className="text-lg font-bold text-primary">{product.discountPrice} د.إ</span>
                <span className="text-xs text-muted-foreground line-through">{product.price} د.إ</span>
              </>
            ) : (
              <span className="text-lg font-bold text-primary">{product.price} د.إ</span>
            )}
          </div>
          
          <Button
            size="icon"
            variant="secondary"
            className="rounded-full opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hover:bg-primary hover:text-primary-foreground"
            onClick={handleAddToCart}
          >
            <ShoppingCart className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Link>
  );
}
