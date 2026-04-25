import { useEffect, useMemo, useState } from "react";
import { Link } from "wouter";
import {
  ShoppingBag,
  TrendingUp,
  CircleDollarSign,
  Users,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  Truck,
  PackageCheck,
} from "lucide-react";
import AdminLayout from "./AdminLayout";
import { listenOrders } from "@/lib/orders";
import { ORDER_STATUS_LABELS, type Order, type OrderStatus } from "@/lib/firebase";

const STATUS_STYLES: Record<OrderStatus, string> = {
  pending: "bg-amber-500/15 text-amber-300 border-amber-500/30",
  confirmed: "bg-cyan-500/15 text-cyan-300 border-cyan-500/30",
  shipped: "bg-violet-500/15 text-violet-300 border-violet-500/30",
  delivered: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  cancelled: "bg-red-500/15 text-red-300 border-red-500/30",
};

function formatSAR(n: number): string {
  return new Intl.NumberFormat("ar-SA", { maximumFractionDigits: 0 }).format(n);
}

function formatRelative(ts: number): string {
  const diff = Math.max(0, Date.now() - ts);
  const sec = Math.floor(diff / 1000);
  if (sec < 60) return `منذ ${sec}ث`;
  const min = Math.floor(sec / 60);
  if (min < 60) return `منذ ${min}د`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `منذ ${hr}س`;
  const day = Math.floor(hr / 24);
  return `منذ ${day}ي`;
}

export default function AdminDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = listenOrders((list) => {
      setOrders(list);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const stats = useMemo(() => {
    const total = orders.length;
    const revenue = orders
      .filter((o) => o.status !== "cancelled")
      .reduce((s, o) => s + o.total, 0);
    const pending = orders.filter((o) => o.status === "pending").length;
    const customers = new Set(
      orders.map((o) => o.customerEmail.toLowerCase()).filter(Boolean),
    ).size;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayOrders = orders.filter((o) => o.createdAt >= today.getTime()).length;

    return { total, revenue, pending, customers, todayOrders };
  }, [orders]);

  const recent = orders.slice(0, 6);

  return (
    <AdminLayout title="نظرة عامة" subtitle="ملخص النشاط في متجرك">
      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard
          label="إجمالي الإيرادات"
          value={`${formatSAR(stats.revenue)} ر.س`}
          icon={CircleDollarSign}
          tone="emerald"
          loading={loading}
        />
        <StatCard
          label="إجمالي الطلبات"
          value={String(stats.total)}
          icon={ShoppingBag}
          tone="amber"
          loading={loading}
          hint={stats.todayOrders > 0 ? `+${stats.todayOrders} اليوم` : undefined}
        />
        <StatCard
          label="بانتظار المراجعة"
          value={String(stats.pending)}
          icon={Clock}
          tone="cyan"
          loading={loading}
        />
        <StatCard
          label="عملاء فريدون"
          value={String(stats.customers)}
          icon={Users}
          tone="violet"
          loading={loading}
        />
      </div>

      {/* Funnel */}
      <div className="mt-5 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <FunnelStat
          label={ORDER_STATUS_LABELS.pending}
          count={orders.filter((o) => o.status === "pending").length}
          icon={Clock}
        />
        <FunnelStat
          label={ORDER_STATUS_LABELS.confirmed}
          count={orders.filter((o) => o.status === "confirmed").length}
          icon={CheckCircle2}
        />
        <FunnelStat
          label={ORDER_STATUS_LABELS.shipped}
          count={orders.filter((o) => o.status === "shipped").length}
          icon={Truck}
        />
        <FunnelStat
          label={ORDER_STATUS_LABELS.delivered}
          count={orders.filter((o) => o.status === "delivered").length}
          icon={PackageCheck}
        />
      </div>

      {/* Recent orders */}
      <div className="mt-7 bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-amber-400" />
            <h2 className="text-sm font-bold text-white">أحدث الطلبات</h2>
          </div>
          <Link
            href="/admin/orders"
            className="text-xs text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1"
            data-testid="link-view-all-orders"
          >
            عرض الكل
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="p-10 text-center text-slate-500 text-sm">جاري التحميل...</div>
        ) : recent.length === 0 ? (
          <div className="p-10 text-center text-slate-500 text-sm">
            لا توجد طلبات بعد. ستظهر الطلبات هنا فور وصولها.
          </div>
        ) : (
          <div className="divide-y divide-slate-800">
            {recent.map((o) => (
              <Link
                key={o.id}
                href={`/admin/orders`}
                className="flex items-center gap-3 px-5 py-3.5 hover:bg-slate-800/40 transition-colors"
                data-testid={`row-recent-order-${o.id}`}
              >
                <div className="w-11 h-11 rounded-lg bg-slate-800 overflow-hidden shrink-0">
                  {o.itemImage && (
                    <img src={o.itemImage} alt={o.itemTitle} className="w-full h-full object-cover" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-white truncate">{o.itemTitle}</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border shrink-0 ${STATUS_STYLES[o.status]}`}
                    >
                      {ORDER_STATUS_LABELS[o.status]}
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 truncate mt-0.5">
                    {o.customerName} · {o.shippingCity}
                  </div>
                </div>
                <div className="text-left shrink-0">
                  <div className="font-bold text-sm text-white">{formatSAR(o.total)} ر.س</div>
                  <div className="text-[10px] text-slate-500">{formatRelative(o.createdAt)}</div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

const TONE: Record<string, { bg: string; text: string; ring: string }> = {
  emerald: { bg: "bg-emerald-500/10", text: "text-emerald-400", ring: "border-emerald-500/30" },
  amber: { bg: "bg-amber-500/10", text: "text-amber-400", ring: "border-amber-500/30" },
  cyan: { bg: "bg-cyan-500/10", text: "text-cyan-400", ring: "border-cyan-500/30" },
  violet: { bg: "bg-violet-500/10", text: "text-violet-400", ring: "border-violet-500/30" },
};

function StatCard({
  label,
  value,
  icon: Icon,
  tone,
  loading,
  hint,
}: {
  label: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  tone: keyof typeof TONE;
  loading?: boolean;
  hint?: string;
}) {
  const t = TONE[tone];
  return (
    <div
      className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 sm:p-5"
      data-testid={`stat-${label}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="text-[11px] sm:text-xs font-bold text-slate-400 mb-1.5">{label}</div>
          <div className="text-lg sm:text-2xl font-bold text-white truncate">
            {loading ? "—" : value}
          </div>
          {hint && (
            <div className={`text-[11px] font-bold mt-1.5 ${t.text}`}>{hint}</div>
          )}
        </div>
        <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl border ${t.bg} ${t.ring} flex items-center justify-center shrink-0`}>
          <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${t.text}`} />
        </div>
      </div>
    </div>
  );
}

function FunnelStat({
  label,
  count,
  icon: Icon,
}: {
  label: string;
  count: number;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-3.5 flex items-center gap-3">
      <div className="w-8 h-8 rounded-lg bg-slate-800/80 flex items-center justify-center shrink-0">
        <Icon className="w-4 h-4 text-slate-400" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-[11px] text-slate-500 font-bold truncate">{label}</div>
        <div className="text-base font-bold text-white">{count}</div>
      </div>
    </div>
  );
}
