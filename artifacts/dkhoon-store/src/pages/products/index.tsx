import { useEffect, useState } from "react";
import { useSearch } from "wouter";
import ProductCard from "@/components/product/ProductCard";
import { useListProducts, useListCategories } from "@workspace/api-client-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, SlidersHorizontal, Loader2 } from "lucide-react";

export default function Products() {
  const searchString = useSearch();
  const searchParams = new URLSearchParams(searchString);
  const initialCategory = searchParams.get("category");
  
  const [activeCategoryId, setActiveCategoryId] = useState<number | undefined>(
    initialCategory ? parseInt(initialCategory) : undefined
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Debounce search query
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  const { data: categories = [], isLoading: isCategoriesLoading } = useListCategories();
  
  const { data: products = [], isLoading: isProductsLoading } = useListProducts({
    categoryId: activeCategoryId,
    search: debouncedQuery || undefined,
  });

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      {/* Page Header */}
      <div className="mb-8 text-center md:text-right border-b border-border/50 pb-6">
        <h1 className="text-3xl md:text-4xl font-bold font-serif mb-2">جميع المنتجات</h1>
        <p className="text-muted-foreground text-sm font-medium">تسوق من تشكيلتنا الواسعة من العطور والبخور</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Mobile Filter Toggle */}
        <div className="md:hidden flex gap-3">
          <Button variant="outline" className="flex-1 font-bold border-primary/20 text-foreground" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            <SlidersHorizontal className="w-4 h-4 ml-2 text-primary" />
            التصنيفات
          </Button>
          <div className="relative flex-1">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="ابحث..." 
              className="pr-9 font-medium"
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
              className="pr-9 bg-card border-border font-medium shadow-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="bg-card p-5 rounded-xl border border-border shadow-sm">
            <h3 className="font-bold text-lg mb-4 pb-2 border-b border-border text-foreground">الأقسام</h3>
            {isCategoriesLoading ? (
              <div className="flex justify-center p-4"><Loader2 className="w-5 h-5 animate-spin text-primary" /></div>
            ) : (
              <ul className="space-y-1">
                <li>
                  <button
                    className={`w-full text-right py-2 px-3 rounded-md transition-colors font-medium text-sm ${!activeCategoryId ? 'bg-primary/10 text-primary font-bold' : 'text-foreground hover:bg-muted'}`}
                    onClick={() => { setActiveCategoryId(undefined); setIsSidebarOpen(false); }}
                  >
                    الكل
                  </button>
                </li>
                {categories.map(category => (
                  <li key={category.id}>
                    <button
                      className={`w-full text-right py-2 px-3 rounded-md transition-colors font-medium text-sm flex justify-between items-center ${activeCategoryId === category.id ? 'bg-primary/10 text-primary font-bold' : 'text-foreground hover:bg-muted'}`}
                      onClick={() => { setActiveCategoryId(category.id); setIsSidebarOpen(false); }}
                    >
                      <span>{category.nameAr}</span>
                      <span className="text-[10px] bg-muted px-2 py-0.5 rounded-full text-muted-foreground font-bold">{category.productCount}</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </aside>

        {/* Product Grid */}
        <main className="flex-1">
          {isProductsLoading ? (
            <div className="flex items-center justify-center min-h-[400px]">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
              {products.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-24 bg-card border border-border rounded-xl shadow-sm">
              <p className="text-muted-foreground text-lg font-medium">لا توجد منتجات تطابق بحثك.</p>
              <Button variant="outline" className="mt-6 font-bold border-primary text-primary hover:bg-primary hover:text-primary-foreground" onClick={() => {setSearchQuery(""); setActiveCategoryId(undefined);}}>
                إعرض كل المنتجات
              </Button>
            </div>
          )}
        </main>

      </div>
    </div>
  );
}