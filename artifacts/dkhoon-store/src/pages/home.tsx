import { Link } from "wouter";
import ProductCard from "@/components/product/ProductCard";
import { products, categories } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function Home() {
  const featuredProducts = products.filter(p => p.isBestseller).slice(0, 4);
  const newArrivals = products.filter(p => p.isNew).slice(0, 4);

  return (
    <div className="flex flex-col gap-24 pb-24">
      {/* Hero Section */}
      <section className="relative h-[80vh] min-h-[600px] w-full flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-background/40 z-10" />
        <img 
          src="https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=2000" 
          alt="Luxury Arabic Perfume" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="container relative z-20 text-center px-4 flex flex-col items-center">
          <span className="text-primary font-bold tracking-widest uppercase mb-4 block">Dkhoon Emirates</span>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 font-serif">
            عبق الماضي، <br/>
            <span className="text-primary">أصالة الحاضر</span>
          </h1>
          <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-10">
            اكتشف مجموعتنا الحصرية من أرقى العطور والبخور المستوحاة من التراث الإماراتي.
          </p>
          <Link href="/products">
            <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 text-lg px-8 py-6 rounded-none">
              تسوق الآن
            </Button>
          </Link>
        </div>
      </section>

      {/* Categories Strip */}
      <section className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-3xl font-bold font-serif mb-2">تسوق حسب القسم</h2>
            <p className="text-muted-foreground uppercase tracking-widest text-xs">Shop by Category</p>
          </div>
          <Link href="/categories">
            <Button variant="ghost" className="group">
              عرض الكل
              <ArrowLeft className="ml-2 w-4 h-4 transition-transform group-hover:-translate-x-1" />
            </Button>
          </Link>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {categories.map(category => (
            <Link key={category.id} href={`/products?category=${category.id}`} className="group relative aspect-square overflow-hidden bg-muted rounded-lg block">
              <img src={category.image} alt={category.name_en} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-70 group-hover:opacity-100" />
              <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent flex items-end p-4">
                <div>
                  <h3 className="text-white font-bold text-lg">{category.name_ar}</h3>
                  <p className="text-primary text-xs uppercase tracking-wider">{category.name_en}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Bestsellers */}
      <section className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold font-serif mb-3">الأكثر مبيعاً</h2>
          <p className="text-primary uppercase tracking-widest text-sm">Bestsellers</p>
          <div className="h-px w-24 bg-primary mx-auto mt-6" />
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Banner */}
      <section className="container mx-auto px-4">
        <div className="relative rounded-2xl overflow-hidden bg-card border border-border flex flex-col md:flex-row items-center">
          <div className="p-8 md:p-16 flex-1 text-center md:text-right">
            <span className="text-primary font-bold tracking-widest text-sm uppercase mb-4 block">New Collection</span>
            <h2 className="text-3xl md:text-5xl font-bold font-serif mb-6">مجموعة العود الملكي</h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto md:mx-0">
              توليفة استثنائية من أندر أنواع العود ممتزجة بنفحات الزعفران والورد الطائفي لتجربة عطرية لا تنسى.
            </p>
            <Link href="/products?category=mens-perfume">
              <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                اكتشف المجموعة
              </Button>
            </Link>
          </div>
          <div className="flex-1 w-full md:w-auto">
            <img src="https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?auto=format&fit=crop&q=80&w=1000" alt="Royal Oud Collection" className="w-full h-full object-cover" />
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      {newArrivals.length > 0 && (
        <section className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold font-serif mb-2">وصل حديثاً</h2>
              <p className="text-muted-foreground uppercase tracking-widest text-xs">New Arrivals</p>
            </div>
            <Link href="/products">
              <Button variant="ghost" className="group">
                عرض الكل
                <ArrowLeft className="ml-2 w-4 h-4 transition-transform group-hover:-translate-x-1" />
              </Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {newArrivals.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
