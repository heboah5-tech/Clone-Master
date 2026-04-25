import { Link } from "wouter";
import { useListCategories } from "@workspace/api-client-react";
import { Loader2 } from "lucide-react";

export default function Categories() {
  const { data: categories = [], isLoading } = useListCategories();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-16 bg-background">
      <div className="text-center mb-12 border-b border-border/50 pb-8">
        <h1 className="text-3xl md:text-5xl font-bold font-serif mb-3 text-foreground">أقسام المتجر</h1>
        <p className="text-muted-foreground font-medium text-sm">تصفح مجموعاتنا المتنوعة من العطور والبخور</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
        {categories.map((category) => (
          <Link 
            key={category.id} 
            href={`/products?category=${category.id}`}
            className="group relative aspect-[4/3] rounded-2xl overflow-hidden bg-card border border-border shadow-sm hover:border-primary/50 hover:shadow-md transition-all block"
          >
            <img 
              src={category.imageUrl || "/products/hero-banner.png"} 
              alt={category.nameAr} 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
            
            <div className="absolute inset-0 flex flex-col items-center justify-end p-6 text-center">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-2 font-serif transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">{category.nameAr}</h2>
              <span className="bg-primary/90 text-primary-foreground text-xs font-bold px-3 py-1 rounded-full opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 delay-75">
                تصفح المنتجات
              </span>
            </div>
            
            <div className="absolute top-4 left-4 bg-background/90 backdrop-blur-sm text-foreground text-xs font-bold px-2.5 py-1 rounded-full shadow-sm">
              {category.productCount} منتج
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}