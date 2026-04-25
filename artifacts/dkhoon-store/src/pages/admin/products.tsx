import { useMemo } from "react";
import { Package, Tag } from "lucide-react";
import AdminLayout from "./AdminLayout";
import {
  MAIN_OFFER,
  MORE_OFFERS,
  FEATURED_PERFUMES,
  BUKHOOR_ITEMS,
  type Item,
} from "@/data/offers";

interface CatalogItem extends Item {
  category: string;
  categoryStyle: string;
}

function formatSAR(n: number): string {
  return new Intl.NumberFormat("ar-SA", { maximumFractionDigits: 0 }).format(n);
}

export default function AdminProducts() {
  const items: CatalogItem[] = useMemo(
    () => [
      {
        ...MAIN_OFFER,
        category: "العرض الرئيسي",
        categoryStyle: "bg-amber-500/15 text-amber-300 border-amber-500/30",
      },
      ...MORE_OFFERS.map((o) => ({
        ...o,
        category: "عروض",
        categoryStyle: "bg-rose-500/15 text-rose-300 border-rose-500/30",
      })),
      ...FEATURED_PERFUMES.map((p) => ({
        ...p,
        category: "عطور",
        categoryStyle: "bg-violet-500/15 text-violet-300 border-violet-500/30",
      })),
      ...BUKHOOR_ITEMS.map((b) => ({
        ...b,
        category: "بخور",
        categoryStyle: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
      })),
    ],
    [],
  );

  return (
    <AdminLayout
      title="المنتجات"
      subtitle={`${items.length} منتج في الكتالوج`}
    >
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
        {items.map((item) => (
          <div
            key={`${item.category}-${item.id}`}
            className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden hover:border-slate-700 transition-colors"
            data-testid={`product-card-${item.id}`}
          >
            <div className="relative aspect-square bg-gradient-to-br from-slate-800/50 to-slate-900">
              <img
                src={item.image}
                alt={item.titleAr}
                className="w-full h-full object-contain p-2"
                loading="lazy"
              />
              <span
                className={`absolute top-2 right-2 text-[10px] font-bold px-2 py-0.5 rounded-full border ${item.categoryStyle}`}
              >
                {item.category}
              </span>
            </div>
            <div className="p-3">
              <div className="font-bold text-sm text-white truncate">{item.titleAr}</div>
              <div className="flex items-baseline gap-2 mt-1.5">
                <span className="font-bold text-amber-300">{formatSAR(item.price)}</span>
                <span className="text-[10px] text-slate-500">ر.س</span>
                {item.originalPrice && item.originalPrice > item.price && (
                  <span className="text-[11px] text-slate-500 line-through mr-auto">
                    {formatSAR(item.originalPrice)}
                  </span>
                )}
              </div>
              <div className="text-[10px] text-slate-500 mt-1.5 font-mono truncate" dir="ltr">
                {item.id}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 bg-slate-900/40 border border-slate-800 rounded-xl p-4 flex items-start gap-3 text-xs text-slate-400">
        <Tag className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
        <div>
          المنتجات معرّفة حالياً في ملف <code className="font-mono text-amber-300">offers.ts</code>.
          لجعلها قابلة للتحرير من اللوحة، يمكن لاحقاً نقلها إلى Firestore.
        </div>
      </div>
    </AdminLayout>
  );
}
