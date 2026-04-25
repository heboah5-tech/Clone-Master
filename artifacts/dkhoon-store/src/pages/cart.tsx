import { Link } from "wouter";
import { useCart } from "@/lib/cart";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2, ArrowRight } from "lucide-react";

export default function Cart() {
  const { items, updateQuantity, removeFromCart, totalPrice } = useCart();

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-32 text-center max-w-md">
        <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
          <Trash2 className="w-10 h-10 text-muted-foreground" />
        </div>
        <h1 className="text-3xl font-bold font-serif mb-4 text-foreground">السلة فارغة</h1>
        <p className="text-muted-foreground mb-8">لم تقم بإضافة أي منتجات إلى سلة المشتريات بعد.</p>
        <Link href="/products">
          <Button size="lg" className="w-full bg-primary text-primary-foreground">تصفح المنتجات</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 md:py-16">
      <h1 className="text-4xl font-bold font-serif mb-12 text-foreground">سلة المشتريات</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        
        {/* Items List */}
        <div className="lg:col-span-2 space-y-6">
          {items.map((item) => {
            const price = item.product.discountPrice || item.product.price;
            
            return (
              <div key={item.product.id} className="flex gap-6 p-4 bg-card border border-border rounded-xl relative group">
                <Link href={`/products/${item.product.id}`} className="shrink-0">
                  <img 
                    src={item.product.image} 
                    alt={item.product.name_en} 
                    className="w-24 h-24 sm:w-32 sm:h-32 object-cover rounded-lg bg-muted"
                  />
                </Link>
                
                <div className="flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <Link href={`/products/${item.product.id}`} className="font-bold text-lg text-foreground hover:text-primary line-clamp-1">
                        {item.product.name_ar}
                      </Link>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider mt-1">{item.product.name_en}</p>
                    </div>
                    <button 
                      onClick={() => removeFromCart(item.product.id)}
                      className="text-muted-foreground hover:text-destructive transition-colors p-2 -m-2"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="text-primary font-bold mb-auto">
                    {price} د.إ
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center border border-border rounded-lg bg-background">
                      <button 
                        className="w-8 h-8 flex items-center justify-center text-foreground hover:text-primary transition-colors"
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <div className="w-8 h-8 flex items-center justify-center font-bold text-sm">
                        {item.quantity}
                      </div>
                      <button 
                        className="w-8 h-8 flex items-center justify-center text-foreground hover:text-primary transition-colors"
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                    
                    <div className="font-bold text-foreground">
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
          <div className="bg-card border border-border rounded-xl p-6 sticky top-28">
            <h2 className="text-xl font-bold mb-6 text-foreground border-b border-border pb-4">ملخص الطلب</h2>
            
            <div className="space-y-4 mb-6 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">المجموع الفرعي</span>
                <span className="font-medium text-foreground">{totalPrice} د.إ</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">الشحن</span>
                <span className="font-medium text-primary">مجاني</span>
              </div>
            </div>
            
            <div className="border-t border-border pt-4 mb-8">
              <div className="flex justify-between items-center">
                <span className="font-bold text-lg text-foreground">الإجمالي الكلي</span>
                <span className="font-bold text-2xl text-primary">{totalPrice} د.إ</span>
              </div>
              <p className="text-xs text-muted-foreground mt-2">شاملاً ضريبة القيمة المضافة</p>
            </div>
            
            <Button size="lg" className="w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded-none mb-4">
              إتمام الطلب
            </Button>
            
            <Link href="/products" className="flex items-center justify-center text-sm text-muted-foreground hover:text-primary transition-colors">
              <ArrowRight className="w-4 h-4 ml-2" />
              متابعة التسوق
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
