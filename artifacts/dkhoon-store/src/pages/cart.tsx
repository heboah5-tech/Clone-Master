import { Link } from "wouter";
import { useCart } from "@/lib/cart";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2, ArrowRight, Loader2, ShoppingBag } from "lucide-react";

export default function Cart() {
  const { items, updateQuantity, removeFromCart, totalPrice, isLoading } = useCart();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-32 text-center max-w-md">
        <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
          <ShoppingBag className="w-10 h-10 text-muted-foreground" />
        </div>
        <h1 className="text-3xl font-bold font-serif mb-4 text-foreground">السلة فارغة</h1>
        <p className="text-muted-foreground mb-8 font-medium">لم تقم بإضافة أي منتجات إلى سلة المشتريات بعد.</p>
        <Link href="/products">
          <Button size="lg" className="w-full bg-primary text-primary-foreground font-bold shadow-md">تصفح المنتجات</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-12 bg-background">
      <h1 className="text-3xl md:text-4xl font-bold font-serif mb-8 text-foreground border-b border-border/50 pb-6">سلة المشتريات</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Items List */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => {
            const price = item.product.price;
            const imageToUse = item.product.imageUrl || item.product.images?.[0] || "/products/oud-perfume.png";
            
            return (
              <div key={item.productId} className="flex gap-4 sm:gap-6 p-4 bg-card border border-border rounded-xl shadow-sm relative group">
                <Link href={`/products/${item.productId}`} className="shrink-0 block w-24 h-24 sm:w-32 sm:h-32 bg-background rounded-lg p-2 border border-border/50">
                  <img 
                    src={imageToUse} 
                    alt={item.product.nameAr} 
                    className="w-full h-full object-contain"
                  />
                </Link>
                
                <div className="flex-1 flex flex-col justify-between">
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <Link href={`/products/${item.productId}`} className="font-bold text-base sm:text-lg text-foreground hover:text-primary line-clamp-2 leading-snug">
                        {item.product.nameAr}
                      </Link>
                      <p className="text-primary font-bold mt-2">
                        {price} د.إ
                      </p>
                    </div>
                    <button 
                      onClick={() => removeFromCart(item.productId)}
                      className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md transition-colors p-2 shrink-0"
                      aria-label="Remove item"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between mt-4 flex-wrap gap-4">
                    <div className="flex items-center border border-border rounded-lg bg-background p-0.5">
                      <button 
                        className="w-8 h-8 flex items-center justify-center text-foreground hover:bg-muted rounded-md transition-colors"
                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <div className="w-10 h-8 flex items-center justify-center font-bold text-sm">
                        {item.quantity}
                      </div>
                      <button 
                        className="w-8 h-8 flex items-center justify-center text-foreground hover:bg-muted rounded-md transition-colors"
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                    
                    <div className="font-bold text-foreground text-sm bg-muted/50 px-3 py-1.5 rounded-lg border border-border/50">
                      الإجمالي: {price * item.quantity} د.إ
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-card border border-border rounded-xl shadow-sm p-6 sticky top-28">
            <h2 className="text-xl font-bold mb-6 text-foreground border-b border-border/50 pb-4">ملخص الطلب</h2>
            
            <div className="space-y-4 mb-6 text-sm font-medium text-foreground/80">
              <div className="flex justify-between">
                <span>المجموع الفرعي</span>
                <span className="text-foreground">{totalPrice} د.إ</span>
              </div>
              <div className="flex justify-between">
                <span>الشحن</span>
                <span className="text-primary font-bold">مجاني</span>
              </div>
            </div>
            
            <div className="border-t border-border/50 pt-4 mb-6 bg-muted/30 -mx-6 px-6 pb-6 rounded-b-xl">
              <div className="flex justify-between items-end mb-2">
                <span className="font-bold text-lg text-foreground">الإجمالي الكلي</span>
                <span className="font-bold text-2xl text-primary">{totalPrice} د.إ</span>
              </div>
              <p className="text-xs text-muted-foreground font-medium mb-6">السعر شامل ضريبة القيمة المضافة</p>
              
              <Button size="lg" className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-bold text-lg rounded-lg shadow-md transition-transform active:scale-95">
                إتمام الطلب
              </Button>
            </div>
            
            <Link href="/products" className="flex items-center justify-center text-sm font-bold text-muted-foreground hover:text-primary transition-colors">
              <ArrowRight className="w-4 h-4 ml-2" />
              متابعة التسوق
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}