import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.scss";
import "./pages/pages.scss";
import { CartProvider } from "./context/CartContext";
import { SiteHeader } from "./components/siteHeader/SiteHeader";
import { SiteFooter } from "./components/siteFooter/SiteFooter";
import { PageEffects } from "./components/pageEffects/PageEffects";
import { CartToast } from "./components/cartToast/CartToast";
import { FloatingWhatsApp } from "./components/floatingWhatsApp/FloatingWhatsApp";
import { HomePage } from "./pages/HomePage";
import { ProductsPage } from "./pages/ProductsPage";
import { ProductDetailPage } from "./pages/ProductDetailPage";
import { WholesalePage } from "./pages/WholesalePage";
import { AboutPage } from "./pages/AboutPage";
import { CartPage } from "./pages/CartPage";
import { NotFoundPage } from "./pages/NotFoundPage";

// Define la estructura compartida y relaciona cada URL con su página.
// BrowserRouter permite navegar sin recargar el sitio completo.
function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <div className="site-shell">
          <PageEffects />
          <SiteHeader />
          <CartToast />
          <FloatingWhatsApp />
          <main>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/productos" element={<ProductsPage />} />
              <Route path="/productos/:itemId" element={<ProductDetailPage />} />
              <Route path="/item/:itemId" element={<ProductDetailPage />} />
              <Route path="/contacto" element={<WholesalePage />} />
              <Route path="/acerca" element={<AboutPage />} />
              <Route path="/carrito" element={<CartPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>
          <SiteFooter />
        </div>
      </CartProvider>
    </BrowserRouter>
  );
}

export default App;
