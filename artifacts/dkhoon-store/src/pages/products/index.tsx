import { useState } from "react";
import { useLocation, useSearch } from "wouter";
import ProductCard from "@/components/product/ProductCard";
import { products, categories } from "@/lib/data";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, SlidersHorizontal, X } from "lucide-react";

export default function Products() {
  const searchString = useSearch();
  const searchParams = new URLSearchParams(searchString);
  const initialCategory = searchParams.get("category") || "all";
  
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const filteredProducts = products.filter(product => {
    const matchesCategory = activeCategory === "all" || product.category === activeCategory;
    const matchesSearch = product.name_ar.includes(searchQuery) || 
                          product.name_en.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Page Header */}
      <div className="mb-12 text-center md:text-right">
        <h1 className="text-4xl font-bold font-serif mb-3">جميع المنتجات</h1>
        <p className="text-muted-foreground uppercase tracking-widest text-sm">All Products</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Mobile Filter Toggle */}
        <div className="md:hidden flex gap-2">
          <Button variant="outline" className="flex-1" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            <SlidersHorizontal className="w-4 h-4 ml-2" />
            التصنيفات
          </Button>
          <div className="relative flex-1">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="ابحث..." 
              className="pr-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Sidebar */}
        <aside className={`md:w-64 shrink-0 ${isSidebarOpen ? 'block' : 'hidden'} md:block space-y-8`}>
          <div className="hidden md:block relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="ابحث عن عطر..." 
              className="pr-9 bg-card border-border"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4 pb-2 border-b border-border text-foreground">الأقسام</h3>
            <ul className="space-y-2">
              <li>
                <button
                  className={`w-full text-right py-1 transition-colors ${activeCategory === 'all' ? 'text-primary font-bold' : 'text-muted-foreground hover:text-foreground'}`}
                  onClick={() => { setActiveCategory('all'); setIsSidebarOpen(false); }}
                >
                  الكل
                </button>
              </li>
              {categories.map(category => (
                <li key={category.id}>
                  <button
                    className={`w-full text-right py-1 transition-colors ${activeCategory === category.id ? 'text-primary font-bold' : 'text-muted-foreground hover:text-foreground'}`}
                    onClick={() => { setActiveCategory(category.id); setIsSidebarOpen(false); }}
                  >
                    {category.name_ar}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Product Grid */}
        <main className="flex-1">
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-24 bg-card border border-border rounded-lg">
              <p className="text-muted-foreground text-lg">لا توجد منتجات تطابق بحثك.</p>
              <Button variant="link" className="mt-4 text-primary" onClick={() => {setSearchQuery(""); setActiveCategory("all");}}>
                إعادة ضبط البحث
              </Button>
            </div>
          )}
        </main>

      </div>
    </div>
  );
}
