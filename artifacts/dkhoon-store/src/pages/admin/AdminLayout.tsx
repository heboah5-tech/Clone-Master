import { type ReactNode } from "react";
import { Link, useLocation } from "wouter";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  LogOut,
  Sparkles,
} from "lucide-react";
import { useAdminAuth } from "@/lib/admin-auth";

interface AdminLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
}

const NAV = [
  { href: "/admin", label: "نظرة عامة", icon: LayoutDashboard, exact: true },
  { href: "/admin/orders", label: "الطلبات", icon: ShoppingBag },
  { href: "/admin/products", label: "المنتجات", icon: Package },
];

export default function AdminLayout({ children, title, subtitle }: AdminLayoutProps) {
  const [location, navigate] = useLocation();
  const { user, logout } = useAdminAuth();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex" dir="rtl">
      {/* Sidebar */}
      <aside className="hidden md:flex w-64 shrink-0 flex-col bg-slate-900 border-l border-slate-800 sticky top-0 h-screen">
        <div className="px-6 py-5 border-b border-slate-800">
          <Link href="/admin" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-500/5 border border-amber-500/30 flex items-center justify-center">
              <Sparkles className="w-4.5 h-4.5 text-amber-400" />
            </div>
            <div>
              <div className="font-bold text-white text-sm">دخوني</div>
              <div className="text-[10px] text-slate-500 font-bold tracking-wider">ADMIN PANEL</div>
            </div>
          </Link>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {NAV.map((item) => {
            const active = item.exact ? location === item.href : location.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-bold transition-colors ${
                  active
                    ? "bg-amber-500/10 text-amber-300 border border-amber-500/20"
                    : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-200 border border-transparent"
                }`}
                data-testid={`nav-${item.href.split("/").pop()}`}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-slate-800 space-y-1">
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-bold text-slate-400 hover:bg-slate-800/60 hover:text-slate-200"
          >
            <Package className="w-4 h-4" />
            عرض الموقع
          </Link>
          <button
            onClick={() => {
              logout().then(() => navigate("/admin/login"));
            }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-bold text-slate-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
            data-testid="button-admin-logout"
          >
            <LogOut className="w-4 h-4" />
            تسجيل الخروج
          </button>
          {user?.email && (
            <div className="px-3 pt-2 text-[10px] text-slate-600 truncate" dir="ltr">
              {user.email}
            </div>
          )}
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 inset-x-0 z-30 bg-slate-900/95 backdrop-blur border-b border-slate-800 flex items-center justify-between px-4 h-14">
        <Link href="/admin" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <span className="font-bold text-white text-sm">دخوني · لوحة التحكم</span>
        </Link>
        <button
          onClick={() => logout().then(() => navigate("/admin/login"))}
          className="p-2 rounded-lg text-slate-400 hover:bg-slate-800"
          aria-label="تسجيل الخروج"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>

      {/* Main */}
      <main className="flex-1 min-w-0 pt-14 md:pt-0">
        <div className="sticky top-0 md:top-0 z-20 bg-slate-950/80 backdrop-blur border-b border-slate-800">
          <div className="px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between gap-4">
            <div className="min-w-0">
              <h1 className="text-lg sm:text-xl font-bold text-white truncate">{title}</h1>
              {subtitle && (
                <p className="text-xs text-slate-400 mt-0.5 truncate">{subtitle}</p>
              )}
            </div>
          </div>
        </div>

        {/* Mobile bottom nav */}
        <div className="md:hidden fixed bottom-0 inset-x-0 z-30 bg-slate-900/95 backdrop-blur border-t border-slate-800 grid grid-cols-3 px-2 py-1">
          {NAV.map((item) => {
            const active = item.exact ? location === item.href : location.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center gap-0.5 py-2 rounded-lg text-[10px] font-bold ${
                  active ? "text-amber-300" : "text-slate-500"
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </div>

        <div className="px-4 sm:px-6 lg:px-8 py-6 pb-24 md:pb-10">{children}</div>
      </main>
    </div>
  );
}
