import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <img src="/logo.webp" alt="Dkhoon Emirates" className="h-16 w-auto mb-6 grayscale hover:grayscale-0 transition-all duration-500" />
            <p className="text-muted-foreground max-w-sm font-serif">
              نقدم لكم أرقى العطور والبخور المستوحاة من التراث الإماراتي الأصيل، ممزوجة بلمسات عصرية لتناسب ذوقكم الرفيع.
            </p>
            <p className="text-xs text-muted-foreground/60 mt-2 uppercase tracking-widest font-sans">
              Offering the finest perfumes and incense inspired by authentic Emirati heritage.
            </p>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-4 text-foreground">روابط سريعة <span className="block text-[10px] text-muted-foreground font-normal tracking-wider uppercase mt-1">Quick Links</span></h3>
            <ul className="space-y-3">
              <li><Link href="/products" className="text-muted-foreground hover:text-primary transition-colors">المنتجات (Products)</Link></li>
              <li><Link href="/categories" className="text-muted-foreground hover:text-primary transition-colors">الأقسام (Categories)</Link></li>
              <li><Link href="/cart" className="text-muted-foreground hover:text-primary transition-colors">سلة المشتريات (Cart)</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-4 text-foreground">تواصل معنا <span className="block text-[10px] text-muted-foreground font-normal tracking-wider uppercase mt-1">Contact Us</span></h3>
            <ul className="space-y-3 text-muted-foreground">
              <li className="flex items-center gap-2"><span dir="ltr">+971 50 123 4567</span></li>
              <li className="flex items-center gap-2">info@dkhoonemirates.com</li>
              <li className="flex items-center gap-2">دبي، الإمارات العربية المتحدة</li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} دخون الاماراتية. جميع الحقوق محفوظة.
          </p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>Dkhoon Emirates. All rights reserved.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
