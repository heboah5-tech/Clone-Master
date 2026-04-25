import { useEffect, type ReactNode } from "react";
import { useLocation } from "wouter";
import { Loader2 } from "lucide-react";
import { useAdminAuth } from "./admin-auth";

export default function RequireAdmin({ children }: { children: ReactNode }) {
  const { user, loading } = useAdminAuth();
  const [, navigate] = useLocation();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/admin/login");
    }
  }, [user, loading, navigate]);

  if (loading || !user) {
    return (
      <div
        className="min-h-screen bg-slate-950 flex items-center justify-center"
        dir="rtl"
      >
        <Loader2 className="w-6 h-6 animate-spin text-amber-400" />
      </div>
    );
  }

  return <>{children}</>;
}
