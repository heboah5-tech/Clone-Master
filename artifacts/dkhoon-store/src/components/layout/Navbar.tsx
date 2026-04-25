import { Link } from "wouter";
import { ShoppingBag, Search, Menu, X } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/lib/cart";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { totalItems } = useCart();

  const navLinks = [
    { name_ar: "الرئيسية", name_en: "Home", href: "/" },
    { name_ar: "المنتجات", name_en: "Products", href: "/products" },
    { name_ar: "الأقسام", name_en: "Categories", href: "/categories" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        
        {/* Right side (RTL start) - Logo */}
        <Link href="/" className="flex items-center gap-2">
          <img src="/logo.webp" alt="Dkhoon Emirates" className="h-12 w-auto" />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary relative group py-2"
            >
              <span className="block font-bold text-lg">{link.name_ar}</span>
              <span className="block text-[10px] uppercase tracking-wider text-muted-foreground/60">{link.name_en}</span>
              <span className="absolute bottom-0 left-0 w-full h-[2px] bg-primary scale-x-0 transition-transform group-hover:scale-x-100 origin-right" />
            </Link>
          ))}
        </nav>

        {/* Left side (RTL end) - Actions */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
            <Search className="h-5 w-5" />
            <span className="sr-only">Search</span>
          </Button>
          
          <Link href="/cart" className="relative group">
            <Button variant="ghost" size="icon" className="text-muted-foreground group-hover:text-primary">
              <ShoppingBag className="h-5 w-5" />
              {totalItems > 0 && (
                <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                  {totalItems}
                </span>
              )}
            </Button>
          </Link>

          {/* Mobile Menu Toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-muted-foreground"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-b border-border bg-background">
          <nav className="container mx-auto px-4 py-4 flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-between py-2 text-lg font-medium text-foreground hover:text-primary"
              >
                <span>{link.name_ar}</span>
                <span className="text-xs text-muted-foreground uppercase">{link.name_en}</span>
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
