import { Link } from "wouter";
import ProductCard from "@/components/product/ProductCard";
import { useGetFeatured, useListCategories } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";

export default function Home() {
  const { data: featuredData, isLoading: isFeaturedLoading } = useGetFeatured();
  const { data: categories = [], isLoading: isCategoriesLoading } = useListCategories();

  if (isFeaturedLoading || isCategoriesLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const { heroBanners = [], featuredProducts = [], newArrivals = [], bestsellers = [] } = featuredData || {};

  return (
    <div className="flex flex-col gap-12 md:gap-24 pb-24">
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[500px] w-full flex items-center justify-center overflow-hidden bg-foreground">
        <div className="absolute inset-0 bg-black/60 z-10" />
        <img 
          src={heroBanners[0]?.imageUrl || "/products/hero-banner.png"} 
          alt={heroBanners[0]?.titleAr || "Luxury Arabic Perfume"} 
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div className="container relative z-20 text-center px-4 flex flex-col items-center">
          <span className="text-secondary font-bold tracking-widest uppercase mb-4 block text-lg shadow-sm">
            {heroBanners[0]?.subtitleAr || "خصم 75% على مجموعة مختارة"}
          </span>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 font-serif leading-tight">
            {heroBanners[0]?.titleAr || "عبق الماضي، أصالة الحاضر"}
          </h1>
          <Link href="/products">
            <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 text-lg px-8 py-6 rounded-none mt-4 font-bold tracking-wide">
              تسوق الآن
            </Button>
          </Link>
        </div>
      </section>

      {/* Categories Strip */}
      {categories.length > 0 && (
        <section className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-bold font-serif">تسوق حسب القسم</h2>
            <Link href="/categories" className="text-sm font-bold text-muted-foreground hover:text-primary flex items-center group">
              عرض الكل
              <ArrowLeft className="ml-2 w-4 h-4 transition-transform group-hover:-translate-x-1" />
            </Link>
          </div>
          
          <div className="grid grid-cols-3 md:grid-cols-5 gap-3 md:gap-6">
            {categories.slice(0, 5).map(category => (
              <Link key={category.id} href={`/products?category=${category.id}`} className="group relative aspect-square overflow-hidden bg-card border border-border/50 rounded-xl block shadow-sm hover:border-primary/30 transition-all">
                <img src={category.imageUrl || "/products/oud-perfume.png"} alt={category.nameAr} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-3 md:p-4">
                  <div className="w-full text-center">
                    <h3 className="text-white font-bold text-sm md:text-lg leading-tight">{category.nameAr}</h3>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Bestsellers */}
      {bestsellers.length > 0 && (
        <section className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-bold font-serif border-b-2 border-primary pb-2 inline-block">الأكثر مبيعاً</h2>
            <Link href="/products" className="text-sm font-bold text-muted-foreground hover:text-primary flex items-center group">
              المزيد
              <ArrowLeft className="ml-2 w-4 h-4 transition-transform group-hover:-translate-x-1" />
            </Link>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
            {bestsellers.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* New Arrivals */}
      {newArrivals.length > 0 && (
        <section className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-bold font-serif border-b-2 border-primary pb-2 inline-block">وصل حديثاً</h2>
            <Link href="/products" className="text-sm font-bold text-muted-foreground hover:text-primary flex items-center group">
              المزيد
              <ArrowLeft className="ml-2 w-4 h-4 transition-transform group-hover:-translate-x-1" />
            </Link>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
            {newArrivals.slice(0, 4).map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* Featured Banner */}
      <section className="container mx-auto px-4">
        <div className="relative rounded-2xl overflow-hidden bg-card border border-border flex flex-col md:flex-row items-center shadow-sm">
          <div className="p-8 md:p-12 flex-1 text-center md:text-right">
            <span className="text-primary font-bold tracking-widest text-xs md:text-sm uppercase mb-4 block">New Collection</span>
            <h2 className="text-3xl md:text-4xl font-bold font-serif mb-4 leading-tight">مجموعة العود الملكي</h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto md:mx-0 text-sm md:text-base leading-relaxed">
              توليفة استثنائية من أندر أنواع العود ممتزجة بنفحات الزعفران والورد الطائفي لتجربة عطرية لا تنسى.
            </p>
            <Link href="/products">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold px-8">
                اكتشف المجموعة
              </Button>
            </Link>
          </div>
          <div className="flex-1 w-full md:w-auto h-64 md:h-auto">
            <img src="/products/bridal-set.png" alt="Royal Oud Collection" className="w-full h-full object-cover" />
          </div>
        </div>
      </section>
      
      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <section className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-bold font-serif border-b-2 border-primary pb-2 inline-block">مميز</h2>
            <Link href="/products" className="text-sm font-bold text-muted-foreground hover:text-primary flex items-center group">
              المزيد
              <ArrowLeft className="ml-2 w-4 h-4 transition-transform group-hover:-translate-x-1" />
            </Link>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
            {featuredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

    </div>
  );
}