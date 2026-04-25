import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CartProvider } from "@/lib/cart";
import { AdminAuthProvider } from "@/lib/admin-auth";
import RequireAdmin from "@/lib/RequireAdmin";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

import Home from "@/pages/home";
import Products from "@/pages/products";
import ProductDetail from "@/pages/products/[id]";
import Cart from "@/pages/cart";
import Categories from "@/pages/categories";
import Checkout from "@/pages/checkout";
import NotFound from "@/pages/not-found";

import AdminLogin from "@/pages/admin/login";
import AdminDashboard from "@/pages/admin/dashboard";
import AdminOrders from "@/pages/admin/orders";
import AdminProducts from "@/pages/admin/products";

const queryClient = new QueryClient();

function StorefrontRouter() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/products" component={Products} />
          <Route path="/products/:id" component={ProductDetail} />
          <Route path="/cart" component={Cart} />
          <Route path="/checkout" component={Checkout} />
          <Route path="/categories" component={Categories} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
    </div>
  );
}

function Router() {
  const [location] = useLocation();
  const isAdmin = location.startsWith("/admin");

  if (isAdmin) {
    return (
      <Switch>
        <Route path="/admin/login" component={AdminLogin} />
        <Route path="/admin">
          <RequireAdmin>
            <AdminDashboard />
          </RequireAdmin>
        </Route>
        <Route path="/admin/orders">
          <RequireAdmin>
            <AdminOrders />
          </RequireAdmin>
        </Route>
        <Route path="/admin/products">
          <RequireAdmin>
            <AdminProducts />
          </RequireAdmin>
        </Route>
        <Route component={AdminLogin} />
      </Switch>
    );
  }

  return <StorefrontRouter />;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AdminAuthProvider>
        <CartProvider>
          <TooltipProvider>
            <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
              <Router />
            </WouterRouter>
            <Toaster />
          </TooltipProvider>
        </CartProvider>
      </AdminAuthProvider>
    </QueryClientProvider>
  );
}

export default App;
