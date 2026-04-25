import { Link } from "wouter";
import { categories } from "@/lib/data";

export default function Categories() {
  return (
    <div className="container mx-auto px-4 py-12 md:py-24">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold font-serif mb-4 text-foreground">أقسام المتجر</h1>
        <p className="text-primary uppercase tracking-widest text-sm">Our Collections</p>
        <div className="h-px w-24 bg-primary mx-auto mt-8" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {categories.map((category) => (
          <Link 
            key={category.id} 
            href={`/products?category=${category.id}`}
            className="group relative aspect-[4/3] rounded-2xl overflow-hidden bg-muted border border-border hover:border-primary/50 transition-all block"
          >
            <img 
              src={category.image} 
              alt={category.name_en} 
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
            
            <div className="absolute inset-0 flex flex-col items-center justify-end p-8 text-center">
              <h2 className="text-3xl font-bold text-white mb-2 font-serif transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">{category.name_ar}</h2>
              <p className="text-primary uppercase tracking-widest text-xs transform opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 delay-100">
                {category.name_en}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
