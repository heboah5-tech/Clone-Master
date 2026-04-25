import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  CreditCard,
  Lock,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Truck,
  Package,
  Check,
} from "lucide-react";

const OFFER = {
  titleAr: "باقة فخامة دخوني",
  price: 395,
  originalPrice: 1580,
  image: "/products/featured-offer.jpg",
};

const SHIPPING = 0;

type Step = 1 | 2;

export default function Checkout() {
  const { toast } = useToast();
  const [step, setStep] = useState<Step>(1);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    cardName: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
  });

  const update = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    if (key === "cardNumber") {
      value = value
        .replace(/\D/g, "")
        .slice(0, 16)
        .replace(/(.{4})/g, "$1 ")
        .trim();
    }
    if (key === "expiry") {
      value = value.replace(/\D/g, "").slice(0, 4);
      if (value.length > 2) value = `${value.slice(0, 2)}/${value.slice(2)}`;
    }
    if (key === "cvv") {
      value = value.replace(/\D/g, "").slice(0, 4);
    }
    if (key === "phone") {
      value = value.replace(/[^\d+]/g, "").slice(0, 15);
    }
    setForm((f) => ({ ...f, [key]: value }));
  };

  const total = OFFER.price + SHIPPING;
  const saved = OFFER.originalPrice - OFFER.price;

  const validateStep1 = () => {
    const fields: (keyof typeof form)[] = ["fullName", "email", "phone", "address", "city"];
    for (const k of fields) {
      if (!form[k].trim()) {
        toast({ title: "حقول ناقصة", description: "يرجى تعبئة جميع حقول الشحن." });
        return false;
      }
    }
    if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      toast({ title: "بريد إلكتروني غير صحيح", description: "يرجى إدخال بريد إلكتروني صالح." });
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    const fields: (keyof typeof form)[] = ["cardName", "cardNumber", "expiry", "cvv"];
    for (const k of fields) {
      if (!form[k].trim()) {
        toast({ title: "حقول ناقصة", description: "يرجى تعبئة جميع حقول الدفع." });
        return false;
      }
    }
    if (form.cardNumber.replace(/\s/g, "").length < 13) {
      toast({ title: "رقم البطاقة غير صحيح", description: "يرجى إدخال رقم بطاقة صالح." });
      return false;
    }
    return true;
  };

  const goToPayment = () => {
    if (!validateStep1()) return;
    setStep(2);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goBack = () => {
    setStep(1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const submitOrder = () => {
    if (!validateStep2()) return;
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
    }, 900);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) goToPayment();
    else submitOrder();
  };

  if (submitted) {
    return (
      <div className="container mx-auto px-4 py-10 sm:py-16 max-w-lg">
        <div className="bg-card rounded-3xl border border-border/40 shadow-xl p-7 sm:p-12 text-center flex flex-col items-center gap-5">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-emerald-100 flex items-center justify-center ring-8 ring-emerald-50">
            <CheckCircle2 className="w-12 h-12 sm:w-14 sm:h-14 text-emerald-600" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
            تم استلام طلبك بنجاح
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            شكراً {form.fullName.split(" ")[0]}، سنقوم بتجهيز وشحن طلبك خلال 24 ساعة.
          </p>
          <div className="w-full bg-muted/40 rounded-xl p-4 text-sm text-foreground/80 font-bold flex justify-between border border-border/40">
            <span>رقم الطلب</span>
            <span className="text-primary">#{Math.floor(Math.random() * 90000 + 10000)}</span>
          </div>
          <Link href="/" className="w-full">
            <Button size="lg" className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-bold rounded-xl py-6">
              العودة للرئيسية
              <ArrowRight className="w-4 h-4 mr-2" />
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-background to-[#efe6d5] min-h-screen pb-32 lg:pb-12">
      <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-10 max-w-5xl">
        {/* Header */}
        <div className="mb-5 sm:mb-7 text-center sm:text-right">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-1">
            إتمام الشراء
          </h1>
          <p className="text-muted-foreground text-xs sm:text-sm font-medium">
            خطوتان فقط لإتمام طلبك
          </p>
        </div>

        {/* Stepper */}
        <Stepper step={step} />

        {/* Mobile order preview */}
        <div className="lg:hidden mb-5 mt-5 bg-card rounded-2xl border border-border/40 shadow-sm overflow-hidden">
          <div className="flex items-center gap-3 p-3">
            <div className="w-16 h-16 bg-[#f3ece1] rounded-xl overflow-hidden shrink-0 border border-border/40">
              <img src={OFFER.image} alt={OFFER.titleAr} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-sm text-foreground truncate">{OFFER.titleAr}</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">الكمية: 1</p>
            </div>
            <div className="text-left">
              <div className="text-base font-bold text-primary">ر.س {total}</div>
              <div className="text-[10px] text-emerald-600 font-bold">وفّر {saved}</div>
            </div>
          </div>
        </div>

        <form onSubmit={handleFormSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-8 mt-5">
          {/* Form column */}
          <div className="lg:col-span-2 space-y-5 sm:space-y-6">
            {step === 1 && (
              <section className="bg-card border border-border/40 rounded-2xl shadow-sm p-5 sm:p-6">
                <h2 className="text-base sm:text-lg font-bold mb-4 sm:mb-5 text-foreground border-b border-border/50 pb-3 flex items-center gap-2">
                  <Truck className="w-5 h-5 text-primary" />
                  معلومات الشحن
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="sm:col-span-2">
                    <Label htmlFor="fullName" className="font-bold mb-1.5 block text-sm">الاسم الكامل</Label>
                    <Input
                      id="fullName"
                      value={form.fullName}
                      onChange={update("fullName")}
                      placeholder="محمد عبدالله"
                      className="h-11 sm:h-12 text-base"
                      data-testid="input-fullName"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email" className="font-bold mb-1.5 block text-sm">البريد الإلكتروني</Label>
                    <Input
                      id="email"
                      type="email"
                      value={form.email}
                      onChange={update("email")}
                      placeholder="you@example.com"
                      dir="ltr"
                      className="h-11 sm:h-12 text-base"
                      data-testid="input-email"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone" className="font-bold mb-1.5 block text-sm">رقم الجوال</Label>
                    <Input
                      id="phone"
                      value={form.phone}
                      onChange={update("phone")}
                      placeholder="+966 5x xxx xxxx"
                      dir="ltr"
                      className="h-11 sm:h-12 text-base"
                      data-testid="input-phone"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <Label htmlFor="address" className="font-bold mb-1.5 block text-sm">العنوان</Label>
                    <Input
                      id="address"
                      value={form.address}
                      onChange={update("address")}
                      placeholder="الحي، الشارع، رقم المبنى"
                      className="h-11 sm:h-12 text-base"
                      data-testid="input-address"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <Label htmlFor="city" className="font-bold mb-1.5 block text-sm">المدينة</Label>
                    <Input
                      id="city"
                      value={form.city}
                      onChange={update("city")}
                      placeholder="الرياض"
                      className="h-11 sm:h-12 text-base"
                      data-testid="input-city"
                    />
                  </div>
                </div>

                {/* Step 1 desktop button */}
                <div className="hidden lg:flex justify-end mt-6 pt-5 border-t border-border/50">
                  <Button
                    type="button"
                    onClick={goToPayment}
                    size="lg"
                    className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold px-8 rounded-xl"
                    data-testid="button-continue-to-payment"
                  >
                    المتابعة للدفع
                    <ArrowLeft className="w-4 h-4 mr-2" />
                  </Button>
                </div>
              </section>
            )}

            {step === 2 && (
              <>
                {/* Shipping summary */}
                <section className="bg-card border border-border/40 rounded-2xl shadow-sm p-4 sm:p-5">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                        <Check className="w-5 h-5 text-emerald-600" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs text-muted-foreground font-bold">تم حفظ بيانات الشحن</p>
                        <p className="text-sm font-bold text-foreground truncate">
                          {form.fullName} · {form.city}
                        </p>
                        <p className="text-[11px] text-muted-foreground truncate">{form.address}</p>
                      </div>
                    </div>
                    <Button
                      type="button"
                      onClick={goBack}
                      variant="ghost"
                      size="sm"
                      className="text-primary hover:text-primary hover:bg-primary/5 font-bold shrink-0"
                      data-testid="button-edit-shipping"
                    >
                      تعديل
                    </Button>
                  </div>
                </section>

                <section className="bg-card border border-border/40 rounded-2xl shadow-sm p-5 sm:p-6">
                  <div className="flex items-center justify-between mb-4 sm:mb-5 border-b border-border/50 pb-3 gap-2">
                    <h2 className="text-base sm:text-lg font-bold text-foreground flex items-center gap-2">
                      <CreditCard className="w-5 h-5 text-primary" />
                      بيانات الدفع
                    </h2>
                    <span className="text-[10px] sm:text-xs text-emerald-700 bg-emerald-50 px-2 py-1 rounded-full flex items-center gap-1 font-bold border border-emerald-100">
                      <Lock className="w-3 h-3" />
                      آمن ومشفّر
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div className="sm:col-span-2">
                      <Label htmlFor="cardName" className="font-bold mb-1.5 block text-sm">الاسم على البطاقة</Label>
                      <Input
                        id="cardName"
                        value={form.cardName}
                        onChange={update("cardName")}
                        placeholder="MOHAMMED ALI"
                        dir="ltr"
                        className="h-11 sm:h-12 text-base"
                        data-testid="input-cardName"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <Label htmlFor="cardNumber" className="font-bold mb-1.5 block text-sm">رقم البطاقة</Label>
                      <div className="relative">
                        <Input
                          id="cardNumber"
                          value={form.cardNumber}
                          onChange={update("cardNumber")}
                          placeholder="0000 0000 0000 0000"
                          dir="ltr"
                          inputMode="numeric"
                          className="h-11 sm:h-12 text-base pl-10 tracking-wider"
                          data-testid="input-cardNumber"
                        />
                        <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="expiry" className="font-bold mb-1.5 block text-sm">تاريخ الانتهاء</Label>
                      <Input
                        id="expiry"
                        value={form.expiry}
                        onChange={update("expiry")}
                        placeholder="MM/YY"
                        dir="ltr"
                        inputMode="numeric"
                        className="h-11 sm:h-12 text-base"
                        data-testid="input-expiry"
                      />
                    </div>
                    <div>
                      <Label htmlFor="cvv" className="font-bold mb-1.5 block text-sm">CVV</Label>
                      <Input
                        id="cvv"
                        value={form.cvv}
                        onChange={update("cvv")}
                        placeholder="123"
                        dir="ltr"
                        inputMode="numeric"
                        type="password"
                        className="h-11 sm:h-12 text-base"
                        data-testid="input-cvv"
                      />
                    </div>
                  </div>

                  {/* Step 2 desktop buttons */}
                  <div className="hidden lg:flex justify-between items-center mt-6 pt-5 border-t border-border/50">
                    <Button
                      type="button"
                      onClick={goBack}
                      variant="ghost"
                      size="lg"
                      className="font-bold"
                      data-testid="button-back-to-shipping"
                    >
                      <ArrowRight className="w-4 h-4 ml-2" />
                      رجوع
                    </Button>
                    <Button
                      type="button"
                      onClick={submitOrder}
                      disabled={submitting}
                      size="lg"
                      className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold px-8 rounded-xl disabled:opacity-70"
                      data-testid="button-pay-now"
                    >
                      {submitting ? "جاري المعالجة..." : `ادفع ر.س ${total}`}
                    </Button>
                  </div>
                </section>
              </>
            )}
          </div>

          {/* Summary - desktop */}
          <aside className="hidden lg:block lg:col-span-1">
            <div className="bg-card border border-border/40 rounded-2xl shadow-sm p-6 sticky top-28">
              <h2 className="text-lg font-bold text-foreground border-b border-border/50 pb-3 mb-5 flex items-center gap-2">
                <Package className="w-5 h-5 text-primary" />
                ملخص الطلب
              </h2>

              <div className="flex gap-4 items-center mb-5 pb-5 border-b border-border/50">
                <div className="w-20 h-20 bg-[#f3ece1] rounded-xl overflow-hidden shrink-0 border border-border/40">
                  <img src={OFFER.image} alt={OFFER.titleAr} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-sm text-foreground line-clamp-2">{OFFER.titleAr}</p>
                  <p className="text-xs text-muted-foreground mt-1">الكمية: 1</p>
                </div>
              </div>

              <div className="space-y-3 text-sm font-medium text-foreground/80 mb-5">
                <div className="flex justify-between">
                  <span>السعر الأصلي</span>
                  <span className="text-muted-foreground line-through">ر.س {OFFER.originalPrice}</span>
                </div>
                <div className="flex justify-between">
                  <span>المجموع الفرعي</span>
                  <span className="text-foreground font-bold">ر.س {OFFER.price}</span>
                </div>
                <div className="flex justify-between">
                  <span>الشحن</span>
                  <span className="text-primary font-bold">مجاني</span>
                </div>
                <div className="flex justify-between text-emerald-600">
                  <span className="font-bold">وفرت</span>
                  <span className="font-bold">ر.س {saved}</span>
                </div>
              </div>

              <div className="bg-muted/40 -mx-6 px-6 py-4 border-t border-border/50">
                <div className="flex justify-between items-end">
                  <span className="font-bold text-lg text-foreground">الإجمالي</span>
                  <span className="font-bold text-2xl text-primary">ر.س {total}</span>
                </div>
                <p className="text-[11px] text-muted-foreground font-medium mt-1">
                  السعر شامل ضريبة القيمة المضافة
                </p>
              </div>

              <div className="flex items-center justify-center gap-1.5 mt-4 text-xs text-muted-foreground font-bold">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                معاملاتك محمية بتشفير SSL
              </div>
            </div>
          </aside>
        </form>
      </div>

      {/* Sticky mobile action bar */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-card/95 backdrop-blur border-t border-border shadow-2xl px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        {step === 1 ? (
          <>
            <div className="flex items-center justify-between mb-2">
              <div>
                <div className="text-[11px] text-muted-foreground font-bold">الإجمالي</div>
                <div className="text-xl font-bold text-primary leading-tight">ر.س {total}</div>
              </div>
              <div className="text-[10px] text-muted-foreground font-bold">الخطوة 1 من 2</div>
            </div>
            <Button
              type="button"
              onClick={goToPayment}
              size="lg"
              className="w-full bg-gradient-to-br from-primary to-[#5a1414] text-primary-foreground font-bold text-base rounded-xl shadow-lg shadow-primary/25 active:scale-[0.99] py-6"
              data-testid="button-continue-to-payment-mobile"
            >
              المتابعة للدفع
              <ArrowLeft className="w-4 h-4 mr-2" />
            </Button>
          </>
        ) : (
          <>
            <div className="flex items-center justify-between mb-2">
              <div>
                <div className="text-[11px] text-muted-foreground font-bold">الإجمالي</div>
                <div className="text-xl font-bold text-primary leading-tight">ر.س {total}</div>
              </div>
              <button
                type="button"
                onClick={goBack}
                className="text-xs text-primary hover:underline font-bold flex items-center gap-1"
                data-testid="button-back-to-shipping-mobile"
              >
                <ArrowRight className="w-3.5 h-3.5" />
                رجوع
              </button>
            </div>
            <Button
              type="button"
              onClick={submitOrder}
              disabled={submitting}
              size="lg"
              className="w-full bg-gradient-to-br from-primary to-[#5a1414] text-primary-foreground font-bold text-base rounded-xl shadow-lg shadow-primary/25 active:scale-[0.99] disabled:opacity-70 py-6"
              data-testid="button-pay-now-mobile"
            >
              {submitting ? "جاري المعالجة..." : `ادفع ر.س ${total} الآن`}
            </Button>
          </>
        )}
      </div>
    </div>
  );
}

function Stepper({ step }: { step: Step }) {
  const steps = [
    { n: 1, label: "الشحن", icon: Truck },
    { n: 2, label: "الدفع", icon: CreditCard },
  ];
  return (
    <div className="flex items-center justify-center gap-2 sm:gap-4 max-w-md mx-auto">
      {steps.map((s, idx) => {
        const isActive = step === s.n;
        const isDone = step > s.n;
        const Icon = s.icon;
        return (
          <div key={s.n} className="flex items-center gap-2 sm:gap-4 flex-1">
            <div className="flex flex-col items-center gap-1.5 flex-1">
              <div
                className={`w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center font-bold text-sm transition-all border-2 ${
                  isDone
                    ? "bg-emerald-600 border-emerald-600 text-white"
                    : isActive
                    ? "bg-primary border-primary text-primary-foreground shadow-md shadow-primary/30 scale-105"
                    : "bg-card border-border text-muted-foreground"
                }`}
              >
                {isDone ? <Check className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
              </div>
              <span
                className={`text-xs sm:text-sm font-bold ${
                  isActive ? "text-primary" : isDone ? "text-emerald-700" : "text-muted-foreground"
                }`}
              >
                {s.label}
              </span>
            </div>
            {idx < steps.length - 1 && (
              <div
                className={`h-[2px] flex-1 rounded transition-colors -mt-6 ${
                  step > s.n ? "bg-emerald-600" : "bg-border"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
