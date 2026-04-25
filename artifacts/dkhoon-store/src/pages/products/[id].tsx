import { useParams, Link } from "wouter";
import { useState } from "react";
import { products } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart";
import { useToast } from "@/hooks/use-toast";
import { Star, Minus, Plus, ShoppingBag, ArrowRight } from "lucide-react";

export default function ProductDetail() {
  const params = useParams();
  const product = products.find(p => p.id === params.id);
  const { addToCart } = useCart();
  const { toast } = useToast();
  const [quantity, setQuantity] = useState(1);

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <h1 className="text-2xl font-bold mb-4 text-foreground">المنتج غير موجود</h1>
        <Link href="/products">
          <Button variant="outline">العودة للمنتجات</Button>
        </Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product, quantity);
    toast({
      title: "تمت الإضافة للسلة",
      description: `تم إضافة ${quantity} من ${product.name_ar} بنجاح.`,
    });
  };

  return (
    <div className="container mx-auto px-4 py-8 md:py-16">
      <Link href="/products" className="inline-flex items-center text-muted-foreground hover:text-primary mb-8 transition-colors">
        <ArrowRight className="w-4 h-4 ml-2" />
        العودة للمنتجات
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24">
        {/* Images */}
        <div className="relative aspect-square md:aspect-[4/5] bg-card rounded-2xl overflow-hidden border border-border">
          {product.discountPrice && (
            <div className="absolute top-6 right-6 z-10 bg-destructive text-destructive-foreground px-3 py-1.5 rounded text-sm font-bold shadow-lg">
              تخفيض
            </div>
          )}
          <img 
            src={product.image} 
            alt={product.name_en}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Info */}
        <div className="flex flex-col justify-center">
          <div className="mb-2 text-primary font-medium text-sm tracking-widest uppercase">
            {product.category.replace('-', ' ')}
          </div>
          <h1 className="text-4xl md:text-5xl font-bold font-serif mb-2 text-foreground">{product.name_ar}</h1>
          <p className="text-xl text-muted-foreground uppercase tracking-widest mb-6">{product.name_en}</p>

          <div className="flex items-center gap-4 mb-8">
            <div className="flex items-center text-primary">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`w-5 h-5 ${i < Math.floor(product.rating) ? 'fill-current' : 'opacity-30'}`} />
              ))}
            </div>
            <span className="text-muted-foreground text-sm">({product.reviews} تقييم)</span>
          </div>

          <div className="mb-8">
            {product.discountPrice ? (
              <div className="flex items-end gap-4">
                <span className="text-4xl font-bold text-primary">{product.discountPrice} د.إ</span>
                <span className="text-xl text-muted-foreground line-through mb-1">{product.price} د.إ</span>
              </div>
            ) : (
              <span className="text-4xl font-bold text-primary">{product.price} د.إ</span>
            )}
          </div>

          <div className="space-y-4 mb-10 text-muted-foreground leading-relaxed">
            <p>{product.description_ar}</p>
            <p className="text-sm font-sans" dir="ltr">{product.description_en}</p>
          </div>

          <div className="h-px w-full bg-border mb-10" />

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex items-center border border-border rounded-none bg-card">
              <button 
                className="w-12 h-12 flex items-center justify-center text-foreground hover:bg-muted transition-colors"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
              >
                <Minus className="w-4 h-4" />
              </button>
              <div className="w-12 h-12 flex items-center justify-center font-bold text-lg">
                {quantity}
              </div>
              <button 
                className="w-12 h-12 flex items-center justify-center text-foreground hover:bg-muted transition-colors"
                onClick={() => setQuantity(quantity + 1)}
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <Button 
              className="flex-1 h-12 bg-primary text-primary-foreground hover:bg-primary/90 text-lg rounded-none gap-2"
              onClick={handleAddToCart}
            >
              <ShoppingBag className="w-5 h-5" />
              إضافة للسلة
            </Button>
          </div>
          
          <div className="mt-8 grid grid-cols-2 gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              متوفر في المخزون
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary" />
              شحن مجاني للطلبات فوق 500 د.إ
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
