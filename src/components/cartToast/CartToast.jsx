import { useCartToast } from "../../context/CartContext";
import "./cartToast.scss";

export const CartToast = () => {
  // Informa que el producto fue agregado y permite cerrar el aviso antes del autocierre.
  const { toast, dismissToast } = useCartToast();

  return (
    <div
      className={`cart-toast ${toast ? "cart-toast--visible" : ""}`}
      role="status"
      aria-live="polite"
      aria-atomic="true"
    >
      <span className="cart-toast__check" aria-hidden="true">✓</span>
      <p>{toast}</p>
      <button type="button" onClick={dismissToast} aria-label="Cerrar mensaje" tabIndex={toast ? 0 : -1}>×</button>
    </div>
  );
};
