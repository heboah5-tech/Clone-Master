import { useEffect, useMemo, useState } from "react";
import {
  Search,
  Trash2,
  Mail,
  Phone,
  MapPin,
  X,
  Loader2,
  Filter,
  ShoppingBag,
} from "lucide-react";
import AdminLayout from "./AdminLayout";
import { deleteOrder, listenOrders, updateOrderStatus } from "@/lib/orders";
import { ORDER_STATUS_LABELS, type Order, type OrderStatus } from "@/lib/firebase";

const STATUS_STYLES: Record<OrderStatus, string> = {
  pending: "bg-amber-500/15 text-amber-300 border-amber-500/30",
  confirmed: "bg-cyan-500/15 text-cyan-300 border-cyan-500/30",
  shipped: "bg-violet-500/15 text-violet-300 border-violet-500/30",
  delivered: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  cancelled: "bg-red-500/15 text-red-300 border-red-500/30",
};

const STATUS_OPTIONS: OrderStatus[] = ["pending", "confirmed", "shipped", "delivered", "cancelled"];

function formatSAR(n: number): string {
  return new Intl.NumberFormat("ar-SA", { maximumFractionDigits: 0 }).format(n);
}

function formatDateTime(ts: number): string {
  try {
    return new Date(ts).toLocaleString("ar-SA", {
      dateStyle: "short",
      timeStyle: "short",
    });
  } catch {
    return "—";
  }
}

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "all">("all");
  const [selected, setSelected] = useState<Order | null>(null);
  const [busy, setBusy] = useState<string | null>(null);

  useEffect(() => {
    const unsub = listenOrders((list) => {
      setOrders(list);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return orders.filter((o) => {
      if (statusFilter !== "all" && o.status !== statusFilter) return false;
      if (!q) return true;
      return (
        o.orderNumber.toLowerCase().includes(q) ||
        o.customerName.toLowerCase().includes(q) ||
        o.customerEmail.toLowerCase().includes(q) ||
        o.customerPhone.toLowerCase().includes(q) ||
        o.itemTitle.toLowerCase().includes(q) ||
        o.shippingCity.toLowerCase().includes(q)
      );
    });
  }, [orders, search, statusFilter]);

  const handleStatusChange = async (id: string, newStatus: OrderStatus) => {
    setBusy(id);
    try {
      await updateOrderStatus(id, newStatus);
      setSelected((s) => (s && s.id === id ? { ...s, status: newStatus } : s));
    } catch (e) {
      console.error(e);
      alert("تعذر تحديث حالة الطلب");
    } finally {
      setBusy(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("هل تريد حذف هذا الطلب؟")) return;
    setBusy(id);
    try {
      await deleteOrder(id);
      setSelected((s) => (s && s.id === id ? null : s));
    } catch (e) {
      console.error(e);
      alert("تعذر حذف الطلب");
    } finally {
      setBusy(null);
    }
  };

  return (
    <AdminLayout title="الطلبات" subtitle={`${filtered.length} من أصل ${orders.length} طلب`}>
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-2.5 mb-4">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="بحث برقم الطلب، الاسم، الجوال، المنتج..."
            className="w-full h-10 bg-slate-900/60 border border-slate-800 rounded-lg pr-9 pl-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-500/40"
            data-testid="input-orders-search"
          />
        </div>
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <Filter className="w-4 h-4 text-slate-500 shrink-0" />
          <FilterChip
            label="الكل"
            active={statusFilter === "all"}
            onClick={() => setStatusFilter("all")}
            count={orders.length}
          />
          {STATUS_OPTIONS.map((s) => (
            <FilterChip
              key={s}
              label={ORDER_STATUS_LABELS[s]}
              active={statusFilter === s}
              onClick={() => setStatusFilter(s)}
              count={orders.filter((o) => o.status === s).length}
            />
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-12 flex flex-col items-center gap-3 text-slate-500">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="text-sm">جاري التحميل...</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 flex flex-col items-center gap-3 text-slate-500">
            <ShoppingBag className="w-8 h-8 opacity-40" />
            <span className="text-sm">
              {orders.length === 0 ? "لا توجد طلبات بعد" : "لا توجد نتائج"}
            </span>
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-900/80 border-b border-slate-800">
                  <tr className="text-right text-[11px] font-bold text-slate-400 uppercase">
                    <th className="px-4 py-3">المنتج</th>
                    <th className="px-4 py-3">العميل</th>
                    <th className="px-4 py-3">المدينة</th>
                    <th className="px-4 py-3">المبلغ</th>
                    <th className="px-4 py-3">الحالة</th>
                    <th className="px-4 py-3">التاريخ</th>
                    <th className="px-4 py-3 w-10"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {filtered.map((o) => (
                    <tr
                      key={o.id}
                      onClick={() => setSelected(o)}
                      className="hover:bg-slate-800/40 cursor-pointer transition-colors"
                      data-testid={`row-order-${o.id}`}
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-slate-800 overflow-hidden shrink-0">
                            {o.itemImage && (
                              <img src={o.itemImage} alt="" className="w-full h-full object-cover" />
                            )}
                          </div>
                          <div className="min-w-0">
                            <div className="font-bold text-white truncate max-w-[200px]">
                              {o.itemTitle}
                            </div>
                            <div className="text-[11px] text-slate-500 font-mono">
                              {o.orderNumber}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-bold text-slate-200 truncate max-w-[160px]">
                          {o.customerName}
                        </div>
                        <div className="text-[11px] text-slate-500 truncate max-w-[160px]" dir="ltr">
                          {o.customerPhone}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-slate-300">{o.shippingCity}</td>
                      <td className="px-4 py-3">
                        <span className="font-bold text-white">{formatSAR(o.total)}</span>
                        <span className="text-[11px] text-slate-500 mr-1">ر.س</span>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${STATUS_STYLES[o.status]}`}
                        >
                          {ORDER_STATUS_LABELS[o.status]}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-[11px] text-slate-400 whitespace-nowrap">
                        {formatDateTime(o.createdAt)}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(o.id);
                          }}
                          disabled={busy === o.id}
                          className="text-slate-500 hover:text-red-400 p-1.5 rounded-lg hover:bg-red-500/10 disabled:opacity-50"
                          aria-label="حذف"
                          data-testid={`button-delete-${o.id}`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="md:hidden divide-y divide-slate-800">
              {filtered.map((o) => (
                <button
                  key={o.id}
                  onClick={() => setSelected(o)}
                  className="w-full text-right p-4 hover:bg-slate-800/40 transition-colors"
                  data-testid={`card-order-${o.id}`}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-11 h-11 rounded-lg bg-slate-800 overflow-hidden shrink-0">
                      {o.itemImage && (
                        <img src={o.itemImage} alt="" className="w-full h-full object-cover" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-white text-sm truncate flex-1">
                          {o.itemTitle}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full border shrink-0 ${STATUS_STYLES[o.status]}`}
                        >
                          {ORDER_STATUS_LABELS[o.status]}
                        </span>
                      </div>
                      <div className="text-xs text-slate-400 truncate">
                        {o.customerName} · {o.shippingCity}
                      </div>
                      <div className="flex items-center justify-between mt-1.5">
                        <span className="text-[11px] text-slate-500 font-mono">{o.orderNumber}</span>
                        <span className="font-bold text-white text-sm">
                          {formatSAR(o.total)} ر.س
                        </span>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Detail drawer */}
      {selected && (
        <OrderDrawer
          order={selected}
          onClose={() => setSelected(null)}
          onStatusChange={handleStatusChange}
          onDelete={handleDelete}
          busy={busy === selected.id}
        />
      )}
    </AdminLayout>
  );
}

function FilterChip({
  label,
  active,
  onClick,
  count,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  count: number;
}) {
  return (
    <button
      onClick={onClick}
      className={`shrink-0 px-3 h-8 rounded-full text-xs font-bold border transition-colors flex items-center gap-1.5 ${
        active
          ? "bg-amber-500/15 text-amber-300 border-amber-500/30"
          : "bg-slate-900/60 text-slate-400 border-slate-800 hover:text-slate-200"
      }`}
      data-testid={`filter-${label}`}
    >
      {label}
      <span className={`text-[10px] ${active ? "text-amber-400/70" : "text-slate-500"}`}>
        ({count})
      </span>
    </button>
  );
}

function OrderDrawer({
  order,
  onClose,
  onStatusChange,
  onDelete,
  busy,
}: {
  order: Order;
  onClose: () => void;
  onStatusChange: (id: string, status: OrderStatus) => void;
  onDelete: (id: string) => void;
  busy: boolean;
}) {
  return (
    <div className="fixed inset-0 z-50 flex" dir="rtl">
      <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative ml-auto w-full max-w-md bg-slate-900 border-l border-slate-800 h-full overflow-y-auto shadow-2xl">
        <div className="sticky top-0 z-10 bg-slate-900/95 backdrop-blur border-b border-slate-800 px-5 py-4 flex items-center justify-between">
          <div className="min-w-0">
            <div className="text-[11px] text-slate-500 font-bold">رقم الطلب</div>
            <div className="font-mono font-bold text-white text-sm truncate">
              {order.orderNumber}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white"
            aria-label="إغلاق"
            data-testid="button-close-drawer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-5">
          {/* Item */}
          <section>
            <div className="text-[11px] font-bold text-slate-500 uppercase mb-2">المنتج</div>
            <div className="flex items-center gap-3 bg-slate-950/60 border border-slate-800 rounded-xl p-3">
              <div className="w-14 h-14 rounded-lg bg-slate-800 overflow-hidden shrink-0">
                {order.itemImage && (
                  <img src={order.itemImage} alt="" className="w-full h-full object-cover" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-white text-sm truncate">{order.itemTitle}</div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  الكمية: {order.quantity} · {formatSAR(order.unitPrice)} ر.س للوحدة
                </div>
              </div>
              <div className="text-left shrink-0">
                <div className="font-bold text-amber-300 text-base">
                  {formatSAR(order.total)} ر.س
                </div>
              </div>
            </div>
          </section>

          {/* Customer */}
          <section>
            <div className="text-[11px] font-bold text-slate-500 uppercase mb-2">العميل</div>
            <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-3 space-y-2.5">
              <div className="font-bold text-white text-sm">{order.customerName}</div>
              <DetailRow icon={Mail} value={order.customerEmail} dir="ltr" />
              <DetailRow icon={Phone} value={order.customerPhone} dir="ltr" />
              <DetailRow
                icon={MapPin}
                value={`${order.shippingAddress}، ${order.shippingCity}`}
              />
            </div>
          </section>

          {/* Status */}
          <section>
            <div className="text-[11px] font-bold text-slate-500 uppercase mb-2">الحالة</div>
            <div className="grid grid-cols-2 gap-2">
              {STATUS_OPTIONS.map((s) => {
                const active = order.status === s;
                return (
                  <button
                    key={s}
                    onClick={() => onStatusChange(order.id, s)}
                    disabled={busy || active}
                    className={`px-3 py-2.5 rounded-lg text-xs font-bold border transition-colors ${
                      active
                        ? STATUS_STYLES[s] + " opacity-100"
                        : "bg-slate-950/40 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-slate-200"
                    } disabled:cursor-default`}
                    data-testid={`button-status-${s}`}
                  >
                    {ORDER_STATUS_LABELS[s]}
                  </button>
                );
              })}
            </div>
          </section>

          <section className="text-[11px] text-slate-500 space-y-1">
            <div>أنشئ في: {formatDateTime(order.createdAt)}</div>
            <div>آخر تحديث: {formatDateTime(order.updatedAt)}</div>
          </section>

          <button
            onClick={() => onDelete(order.id)}
            disabled={busy}
            className="w-full h-11 rounded-lg border border-red-500/30 bg-red-500/10 text-red-300 hover:bg-red-500/20 font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-50"
            data-testid="button-drawer-delete"
          >
            {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
            حذف الطلب
          </button>
        </div>
      </div>
    </div>
  );
}

function DetailRow({
  icon: Icon,
  value,
  dir,
}: {
  icon: React.ComponentType<{ className?: string }>;
  value: string;
  dir?: "ltr" | "rtl";
}) {
  return (
    <div className="flex items-center gap-2.5 text-xs">
      <Icon className="w-3.5 h-3.5 text-slate-500 shrink-0" />
      <span className="text-slate-300 truncate" dir={dir}>
        {value || "—"}
      </span>
    </div>
  );
}
