import { useEffect, useState, type FormEvent } from "react";
import { useLocation } from "wouter";
import { Lock, Mail, AlertCircle, Loader2 } from "lucide-react";
import { useAdminAuth } from "@/lib/admin-auth";

export default function AdminLogin() {
  const [, navigate] = useLocation();
  const { user, loading, login, configured } = useAdminAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && user) {
      navigate("/admin");
    }
  }, [user, loading, navigate]);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await login(email.trim(), password);
      navigate("/admin");
    } catch (err) {
      const code = (err as { code?: string })?.code ?? "";
      if (code === "auth/invalid-credential" || code === "auth/wrong-password" || code === "auth/user-not-found") {
        setError("بيانات الدخول غير صحيحة");
      } else if (code === "auth/too-many-requests") {
        setError("محاولات كثيرة، حاول لاحقاً");
      } else if (code === "auth/configuration-not-found" || code === "auth/operation-not-allowed") {
        setError("يجب تفعيل تسجيل الدخول بالبريد في إعدادات Firebase");
      } else {
        setError("تعذر تسجيل الدخول، حاول مرة أخرى");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4 py-10" dir="rtl">
      <div className="w-full max-w-md">
        <div className="text-center mb-7">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500/20 to-amber-500/5 border border-amber-500/30 mb-4">
            <Lock className="w-7 h-7 text-amber-400" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-1">لوحة تحكم دخوني</h1>
          <p className="text-sm text-slate-400">تسجيل دخول المدير</p>
        </div>

        {!configured && (
          <div className="mb-5 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3.5 text-amber-200 text-sm flex items-start gap-2">
            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
            <span>إعدادات Firebase غير مكتملة. تأكد من إضافة المفاتيح.</span>
          </div>
        )}

        <form
          onSubmit={onSubmit}
          className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 shadow-2xl backdrop-blur"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1.5">البريد الإلكتروني</label>
              <div className="relative">
                <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  dir="ltr"
                  placeholder="admin@example.com"
                  className="w-full h-11 bg-slate-950 border border-slate-800 rounded-lg pr-9 pl-3 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/30"
                  data-testid="input-admin-email"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1.5">كلمة المرور</label>
              <div className="relative">
                <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  dir="ltr"
                  placeholder="••••••••"
                  className="w-full h-11 bg-slate-950 border border-slate-800 rounded-lg pr-9 pl-3 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/30"
                  data-testid="input-admin-password"
                />
              </div>
            </div>

            {error && (
              <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-red-300 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={submitting || !configured}
              className="w-full h-11 rounded-lg bg-gradient-to-br from-amber-500 to-amber-600 text-slate-950 font-bold text-sm hover:from-amber-400 hover:to-amber-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              data-testid="button-admin-login"
            >
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              {submitting ? "جاري الدخول..." : "تسجيل الدخول"}
            </button>
          </div>
        </form>

        <p className="text-center text-xs text-slate-500 mt-5">
          لإنشاء حساب مدير، أضفه من قسم Authentication في Firebase Console.
        </p>
      </div>
    </div>
  );
}
