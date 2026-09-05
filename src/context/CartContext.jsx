import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { products } from "../mock/vicariaProducts";
import { isValidQuantity, normalizeQuantity } from "../config/quantities";

const STORAGE_KEY = "vicaria-cart";
const CartContext = createContext(null);
const CartToastContext = createContext(null);
const productsById = new Map(products.map((product) => [product.id, product]));

// Recupera solo productos y cantidades válidas; los precios siempre salen del catálogo.
// Así, datos viejos o manipulados del navegador no modifican el pedido real.
const loadCart = () => {
  try {
    const savedCart = window.localStorage.getItem(STORAGE_KEY);
    const parsedCart = savedCart ? JSON.parse(savedCart) : [];
    if (!Array.isArray(parsedCart)) return [];

    const quantities = new Map();
    parsedCart.forEach((item) => {
      if (!item || !productsById.has(item.productId) || !isValidQuantity(item.quantity)) return;
      const quantity = (quantities.get(item.productId) || 0) + Number(item.quantity);
      if (isValidQuantity(quantity)) quantities.set(item.productId, quantity);
    });
    return Array.from(quantities, ([productId, quantity]) => ({ productId, quantity }));
  } catch {
    return [];
  }
};

export const CartProvider = ({ children, hydrateFromStorage = true }) => {
  const [cart, setCart] = useState(() => (hydrateFromStorage ? loadCart() : []));
  const [isStorageReady, setIsStorageReady] = useState(hydrateFromStorage);
  const [toast, setToast] = useState(null);
  const toastTimer = useRef(null);

  useEffect(() => {
    // Carga el carrito después de hidratar para que el HTML inicial sea estable y rastreable.
    if (hydrateFromStorage) return;
    setCart(loadCart());
    setIsStorageReady(true);
  }, [hydrateFromStorage]);

  useEffect(() => {
    // Persiste el carrito; los datos personales de los formularios nunca se guardan acá.
    if (!isStorageReady) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    } catch {
      // El carrito sigue funcionando si el navegador bloquea el almacenamiento.
    }
  }, [cart, isStorageReady]);

  useEffect(() => () => window.clearTimeout(toastTimer.current), []);

  const showToast = useCallback((message) => {
    // Reinicia el temporizador para mostrar una sola confirmación breve por vez.
    window.clearTimeout(toastTimer.current);
    setToast(message);
    toastTimer.current = window.setTimeout(() => setToast(null), 2200);
  }, []);

  const addItem = useCallback((productId, quantity = 1) => {
    // Agrega un producto vigente o acumula cajas si ya estaba en el carrito.
    const product = productsById.get(productId);
    if (!product) return;
    const safeQuantity = normalizeQuantity(quantity);
    setCart((current) => {
      const existing = current.find((item) => item.productId === productId);
      if (existing) {
        if (!isValidQuantity(existing.quantity + safeQuantity)) return current;
        return current.map((item) =>
          item.productId === productId
            ? { ...item, quantity: item.quantity + safeQuantity }
            : item
        );
      }
      return [...current, { productId, quantity: safeQuantity }];
    });
    showToast(`${safeQuantity} caja${safeQuantity === 1 ? "" : "s"} de ${product.name} agregada${safeQuantity === 1 ? "" : "s"} al carrito`);
  }, [showToast]);

  const updateQuantity = useCallback((productId, quantity) => {
    // Mantiene cantidades válidas al editar desde los botones o el campo numérico.
    const safeQuantity = normalizeQuantity(quantity);
    setCart((current) => {
      const existing = current.find((item) => item.productId === productId);
      if (!existing || existing.quantity === safeQuantity) return current;
      return current.map((item) =>
        item.productId === productId ? { ...item, quantity: safeQuantity } : item
      );
    });
  }, []);

  const removeItem = useCallback((productId) => {
    // Retira solo el producto indicado y conserva el resto del pedido.
    setCart((current) => current.filter((item) => item.productId !== productId));
  }, []);

  const value = useMemo(() => {
    // Calcula subtotales con datos confiables y detecta productos sin precio publicado.
    const cartDetails = cart.map((item) => {
      const product = productsById.get(item.productId);
      return {
        ...item,
        product,
        subtotal: product.price === null ? null : product.price * item.quantity,
      };
    });
    return {
      cartDetails,
      itemCount: cartDetails.reduce((sum, item) => sum + item.quantity, 0),
      total: cartDetails.reduce((sum, item) => sum + (item.subtotal || 0), 0),
      hasPendingPrice: cartDetails.some((item) => item.subtotal === null),
      addItem,
      updateQuantity,
      removeItem,
    };
  }, [cart, addItem, updateQuantity, removeItem]);

  const dismissToast = useCallback(() => {
    window.clearTimeout(toastTimer.current);
    setToast(null);
  }, []);
  const toastValue = useMemo(() => ({ toast, dismissToast }), [toast, dismissToast]);

  return (
    <CartContext.Provider value={value}>
      <CartToastContext.Provider value={toastValue}>
        {children}
      </CartToastContext.Provider>
    </CartContext.Provider>
  );
};

export const useCart = () => {
  // Expone el estado y las acciones únicamente dentro del proveedor del carrito.
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart debe utilizarse dentro de CartProvider");
  return context;
};

export const useCartToast = () => {
  // Separa el aviso visual para que cerrarlo no vuelva a renderizar todo el carrito.
  const context = useContext(CartToastContext);
  if (!context) throw new Error("useCartToast debe utilizarse dentro de CartProvider");
  return context;
};
