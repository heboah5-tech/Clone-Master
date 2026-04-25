import { Link } from "wouter";
import { SiVisa, SiMastercard, SiApplepay } from "react-icons/si";
import { Phone, Mail, Instagram, Twitter, Facebook } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <img src="/logo.webp" alt="Dkhoon Emirates" className="h-16 w-auto mb-6 transition-all duration-500" />
            <p className="text-foreground max-w-sm font-serif text-lg leading-relaxed mb-6">
              نقدم لكم أرقى العطور والبخور المستوحاة من التراث الإماراتي الأصيل، ممزوجة بلمسات عصرية لتناسب ذوقكم الرفيع.
            </p>
            <div className="flex items-center gap-4 text-muted-foreground">
              <a href="#" className="hover:text-primary transition-colors">
                <Instagram className="w-6 h-6" />
              </a>
              <a href="#" className="hover:text-primary transition-colors">
                <Twitter className="w-6 h-6" />
              </a>
              <a href="#" className="hover:text-primary transition-colors">
                <Facebook className="w-6 h-6" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-6 text-foreground border-b-2 border-primary/20 inline-block pb-2">روابط سريعة</h3>
            <ul className="space-y-4">
              <li><Link href="/products" className="text-foreground hover:text-primary transition-colors font-medium">المنتجات</Link></li>
              <li><Link href="/categories" className="text-foreground hover:text-primary transition-colors font-medium">الأقسام</Link></li>
              <li><Link href="/cart" className="text-foreground hover:text-primary transition-colors font-medium">سلة المشتريات</Link></li>
              <li><Link href="/" className="text-foreground hover:text-primary transition-colors font-medium">تتبع طلبك</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-6 text-foreground border-b-2 border-primary/20 inline-block pb-2">تواصل معنا</h3>
            <ul className="space-y-4 text-foreground">
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-primary" />
                <span dir="ltr" className="font-bold">+971 50 123 4567</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-primary" />
                <span className="font-medium">info@dkhoonemirates.com</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-sm font-medium text-foreground">
            © {new Date().getFullYear()} دخون الاماراتية. جميع الحقوق محفوظة.
          </p>
          <div className="flex items-center gap-4 text-2xl text-muted-foreground">
            <SiVisa className="hover:text-foreground transition-colors" />
            <SiMastercard className="hover:text-foreground transition-colors" />
            <SiApplepay className="hover:text-foreground transition-colors" />
          </div>
        </div>
      </div>
    </footer>
  );
}