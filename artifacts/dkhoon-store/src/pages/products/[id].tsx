import { useParams, Link } from "wouter";
import { useState } from "react";
import { useGetProduct } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart";
import { useToast } from "@/hooks/use-toast";
import { Star, Minus, Plus, ShoppingBag, ArrowRight, Loader2, Check } from "lucide-react";

export default function ProductDetail() {
  const params = useParams();
  const id = parseInt(params.id || "0");
  const { addToCart } = useCart();
  const { toast } = useToast();
  const [quantity, setQuantity] = useState(1);

  const { data: product, isLoading } = useGetProduct(id, {
    query: { enabled: !!id, queryKey: ['/api/products', id] }
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
          <Button variant="outline" className="font-bold border-primary text-primary">العودة للمنتجات</Button>
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

  const imageToUse = product.imageUrl || product.images?.[0] || "/products/oud-perfume.png";
  const price = product.price;
  const originalPrice = product.originalPrice;

  return (
    <div className="container mx-auto px-4 py-8 md:py-12 bg-background">
      <Link href="/products" className="inline-flex items-center text-sm font-bold text-muted-foreground hover:text-primary mb-8 transition-colors">
        <ArrowRight className="w-4 h-4 ml-2" />
        العودة للمنتجات
      </Link>

      <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
          {/* Images */}
          <div className="relative aspect-square md:aspect-auto md:h-full bg-background p-8 flex items-center justify-center border-b md:border-b-0 md:border-l border-border">
            {originalPrice && originalPrice > price && (
              <div className="absolute top-6 right-6 z-10 bg-destructive text-destructive-foreground px-3 py-1 rounded text-sm font-bold shadow-md">
                تخفيض {Math.round(((originalPrice - price) / originalPrice) * 100)}%
              </div>
            )}
            <img 
              src={imageToUse} 
              alt={product.nameAr}
              className="w-full h-full max-h-[500px] object-contain"
            />
          </div>

          {/* Info */}
          <div className="flex flex-col p-8 md:p-12">
            <div className="mb-3 text-secondary font-bold text-xs tracking-widest uppercase bg-secondary/10 inline-block px-3 py-1 rounded-full self-start">
              {product.categoryNameAr}
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold font-serif mb-3 text-foreground leading-tight">{product.nameAr}</h1>

            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center text-secondary">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-4 h-4 ${i < Math.floor(product.rating || 5) ? 'fill-current' : 'opacity-30'}`} />
                ))}
              </div>
              <span className="text-muted-foreground text-sm font-medium">({product.reviewCount} تقييم)</span>
            </div>

            <div className="mb-8 p-4 bg-muted/50 rounded-xl border border-border/50">
              {originalPrice && originalPrice > price ? (
                <div className="flex items-center gap-4 flex-wrap">
                  <span className="text-4xl font-bold text-primary">{price} د.إ</span>
                  <span className="text-xl text-muted-foreground line-through font-medium">{originalPrice} د.إ</span>
                </div>
              ) : (
                <span className="text-4xl font-bold text-primary">{price} د.إ</span>
              )}
              <p className="text-xs text-muted-foreground mt-2 font-medium">السعر شامل ضريبة القيمة المضافة</p>
            </div>

            <div className="space-y-4 mb-8 text-foreground/80 leading-relaxed font-medium">
              <p>{product.descriptionAr}</p>
            </div>

            <div className="mt-auto">
              <div className="h-px w-full bg-border mb-8" />

              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex items-center border border-border rounded-lg bg-background p-1 w-full sm:w-auto shrink-0 justify-between sm:justify-start">
                  <button 
                    className="w-10 h-10 flex items-center justify-center text-foreground hover:bg-muted rounded-md transition-colors"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <div className="w-12 h-10 flex items-center justify-center font-bold text-lg">
                    {quantity}
                  </div>
                  <button 
                    className="w-10 h-10 flex items-center justify-center text-foreground hover:bg-muted rounded-md transition-colors"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <Button 
                  className="flex-1 h-12 bg-primary text-primary-foreground hover:bg-primary/90 text-lg font-bold rounded-lg gap-2 shadow-md transition-transform active:scale-95"
                  onClick={handleAddToCart}
                >
                  <ShoppingBag className="w-5 h-5" />
                  إضافة للسلة
                </Button>
              </div>
              
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-foreground font-medium">
                <div className="flex items-center gap-3 bg-muted/50 p-3 rounded-lg border border-border/50">
                  <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3 text-green-600" />
                  </div>
                  متوفر في المخزون
                </div>
                <div className="flex items-center gap-3 bg-muted/50 p-3 rounded-lg border border-border/50">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3 text-primary" />
                  </div>
                  شحن مجاني متوفر
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}