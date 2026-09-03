import { useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { QuantityPicker } from "../components/quantityPicker/QuantityPicker";
import { createWhatsAppUrl } from "../config/business";
import { FIELD_VALIDATION, sanitizeDigits, validateForm, clearFieldValidity } from "../config/formValidation";
import { useCart } from "../context/CartContext";
import { formatPrice, getBoxContent, WHOLESALE_MIN_BOXES } from "../mock/vicariaProducts";

export const CartPage = () => {
  const { cartDetails, total, hasPendingPrice, updateQuantity, removeItem } = useCart();
  const prefersReducedMotion = useReducedMotion();
  const [delivery, setDelivery] = useState("Necesito envío");
  const [wasValidated, setWasValidated] = useState(false);
  const [formError, setFormError] = useState("");

  if (!cartDetails.length) {
    return (
      <section className="section section--soft">
        <div className="container empty-state">
          <h2>El carrito está vacío.</h2>
          <p>Explorá nuestros productos y agregá al menos una caja para comenzar tu pedido.</p>
          <Link className="button button--red" to="/productos">Ver productos</Link>
        </div>
      </section>
    );
  }

  // Muestra la alternativa mayorista cuando un mismo producto alcanza diez cajas.
  const hasWholesaleItem = cartDetails.some(
    ({ quantity }) => quantity >= WHOLESALE_MIN_BOXES
  );

  // Usa el producto con más cajas para mostrar el progreso hacia el canal mayorista.
  const closestWholesaleItem = cartDetails.reduce((closest, item) =>
    item.quantity > closest.quantity ? item : closest
  );
  const boxesUntilWholesale = Math.max(
    WHOLESALE_MIN_BOXES - closestWholesaleItem.quantity,
    0
  );

  // Traslada todos los productos al formulario mayorista mediante parámetros validados allí.
  const wholesaleParams = new URLSearchParams({ origen: "carrito" });
  cartDetails.forEach(({ product, quantity }) => {
    wholesaleParams.set(`cantidad_${product.id}`, String(quantity));
  });
  const wholesaleUrl = `/contacto?${wholesaleParams.toString()}`;

  const submit = (event) => {
    // Detiene el pedido minorista hasta que los campos obligatorios sean válidos.
    event.preventDefault();
    const formElement = event.currentTarget;
    setWasValidated(true);

    if (!validateForm(formElement)) {
      setFormError("Completá los campos obligatorios marcados en rojo antes de continuar.");
      formElement.querySelector(":invalid")?.focus();
      return;
    }

    setFormError("");
    const form = new FormData(formElement);
    const productLines = cartDetails.map(({ product, quantity, subtotal }) =>
      `• ${product.name}: ${quantity} caja${quantity === 1 ? "" : "s"} (${formatPrice(subtotal)})`
    );

    // Solo incorpora domicilio y código postal cuando el cliente solicita envío.
    const shippingLines = delivery === "Necesito envío"
      ? [
          `Provincia: ${form.get("province")}`,
          `Localidad: ${form.get("city")}`,
          `Código postal: ${form.get("postalCode")}`,
          `Dirección: ${form.get("address")} ${form.get("addressNumber")}`,
          `Piso/departamento: ${form.get("apartment") || "No corresponde"}`,
        ]
      : ["Entrega: Retiro o punto de encuentro a coordinar"];

    // Combina productos, total y datos del cliente en un único mensaje de WhatsApp.
    const message = [
      "PEDIDO WEB · VICARIA",
      "",
      "PRODUCTOS",
      ...productLines,
      "",
      `TOTAL ESTIMADO: ${formatPrice(total)}${hasPendingPrice ? " + producto(s) con precio a confirmar" : ""}`,
      "",
      "DATOS DEL CLIENTE",
      `Nombre: ${form.get("name")}`,
      `Teléfono: ${form.get("phone")}`,
      `Email: ${form.get("email") || "No informado"}`,
      `DNI: ${form.get("document")}`,
      "",
      "DATOS DE ENTREGA",
      `Modalidad: ${delivery}`,
      ...shippingLines,
      "",
      `Observaciones: ${form.get("notes") || "Sin observaciones"}`,
      "",
      "Quisiera coordinar el pago y confirmar el pedido.",
    ].join("\n");

    window.open(createWhatsAppUrl(message), "_blank", "noopener,noreferrer");
  };

  return (
    <>
      <section className="page-hero cart-hero"><div className="container"><h1 className="page-title">Tu <span className="text-yellow-on-dark">pedido</span></h1><p className="page-intro">Revisá las cajas, completá tus datos y envianos <strong className="text-yellow-on-dark">todo en un único mensaje</strong> de WhatsApp.</p></div></section>
      <section className="section section--soft">
        <div className="container checkout-layout">
          <div className="cart-panel">
            <div className="checkout-heading"><h2>Productos seleccionados</h2><Link to="/productos">Seguir comprando</Link></div>
            <div className="cart-items">
              <AnimatePresence mode="popLayout" initial={false}>
                {cartDetails.map(({ product, quantity }) => (
                  <motion.article
                    className="cart-item"
                    key={product.id}
                    layout={!prefersReducedMotion}
                    style={{ overflow: "hidden" }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={prefersReducedMotion
                      ? { opacity: 0 }
                      : { opacity: 0, height: 0, paddingTop: 0, paddingBottom: 0, borderBottomWidth: 0 }}
                    transition={{ duration: prefersReducedMotion ? 0.12 : 0.32, ease: [0.23, 1, 0.32, 1] }}
                  >
                    <div className="cart-item__image"><img src={product.image} alt={`Caja de ${product.name}`} /></div>
                    <div className="cart-item__info">
                      <span>{product.category}</span>
                      <h3>{product.name}</h3>
                      <p>{formatPrice(product.price)}</p>
                      {getBoxContent(product) && <small>{getBoxContent(product)} por caja</small>}
                    </div>
                    <QuantityPicker value={quantity} onChange={(value) => updateQuantity(product.id, value)} label="Cajas" />
                    <button className="remove-button" type="button" onClick={() => removeItem(product.id)} aria-label={`Eliminar ${product.name}`}>Eliminar</button>
                  </motion.article>
                ))}
              </AnimatePresence>
            </div>
            <div className="cart-total">
              <span>Total estimado minorista</span>
              <div>
                <strong>{formatPrice(total)}</strong>
                {hasPendingPrice && <small> + producto con precio a confirmar</small>}
              </div>
            </div>

            {!hasWholesaleItem && (
              <div className="cart-wholesale-progress" role="status">
                <strong>
                  {boxesUntilWholesale === 1
                    ? `Te falta 1 caja de ${closestWholesaleItem.product.name} para acceder al canal mayorista`
                    : `Te faltan ${boxesUntilWholesale} cajas de ${closestWholesaleItem.product.name} para acceder al canal mayorista`}
                </strong>
                <p>
                  Al llegar a {WHOLESALE_MIN_BOXES} cajas de un mismo producto, podés solicitar
                  descuentos por volumen, beneficios comerciales y una cotización personalizada.
                </p>
              </div>
            )}

            {hasWholesaleItem && (
              <div className="cart-wholesale-callout">
                <div>
                  <strong>¡Tu pedido ya califica como mayorista!</strong>
                  <p>
                    Alcanzaste las {WHOLESALE_MIN_BOXES} cajas de {closestWholesaleItem.product.name}.
                    Podés solicitar descuentos por volumen, beneficios comerciales y una cotización
                    personalizada con todos los productos del carrito.
                  </p>
                </div>
                <Link className="button button--green button--block" to={wholesaleUrl}>
                  COMPRA MAYORISTA
                </Link>
              </div>
            )}
          </div>

          <form
            className={`checkout-form ${wasValidated ? "form--validated" : ""}`}
            onSubmit={submit}
            onInput={clearFieldValidity}
            noValidate
          >
            <div className="checkout-heading"><div><span>Paso final</span><h2>Datos del cliente y entrega</h2></div></div>
            <div className="form-grid">
              <div className="field"><label htmlFor="checkoutName">Nombre y apellido *</label><input id="checkoutName" name="name" required {...FIELD_VALIDATION.personName} /></div>
              <div className="field"><label htmlFor="checkoutPhone">Teléfono *</label><input id="checkoutPhone" name="phone" required onInput={sanitizeDigits} {...FIELD_VALIDATION.phone} /><small className="field-hint">Entre 8 y 15 números, sin espacios.</small></div>
              <div className="field"><label htmlFor="checkoutEmail">Email</label><input id="checkoutEmail" name="email" {...FIELD_VALIDATION.email} /></div>
              <div className="field"><label htmlFor="checkoutDocument">DNI *</label><input id="checkoutDocument" name="document" required onInput={sanitizeDigits} {...FIELD_VALIDATION.dni} /><small className="field-hint">Entre 7 y 9 números.</small></div>
              <div className="field field--full"><label htmlFor="checkoutDelivery">Modalidad de entrega *</label><select id="checkoutDelivery" name="delivery" value={delivery} onChange={(event) => setDelivery(event.target.value)}><option>Necesito envío</option><option>Quiero consultar retiro</option></select></div>
              <div className={`delivery-fields${delivery === "Necesito envío" ? " delivery-fields--open" : ""}`}>
                <div className="delivery-fields__inner">
                  <div className="field"><label htmlFor="checkoutProvince">Provincia *</label><input id="checkoutProvince" name="province" required={delivery === "Necesito envío"} {...FIELD_VALIDATION.location} /></div>
                  <div className="field"><label htmlFor="checkoutCity">Localidad *</label><input id="checkoutCity" name="city" required={delivery === "Necesito envío"} {...FIELD_VALIDATION.location} /></div>
                  <div className="field"><label htmlFor="checkoutPostal">Código postal *</label><input id="checkoutPostal" name="postalCode" required={delivery === "Necesito envío"} onInput={sanitizeDigits} {...FIELD_VALIDATION.postalCode} /><small className="field-hint">4 números.</small></div>
                  <div className="field"><label htmlFor="checkoutAddress">Calle *</label><input id="checkoutAddress" name="address" required={delivery === "Necesito envío"} {...FIELD_VALIDATION.street} /></div>
                  <div className="field"><label htmlFor="checkoutNumber">Número *</label><input id="checkoutNumber" name="addressNumber" required={delivery === "Necesito envío"} onInput={sanitizeDigits} {...FIELD_VALIDATION.addressNumber} /></div>
                  <div className="field"><label htmlFor="checkoutApartment">Piso / departamento</label><input id="checkoutApartment" name="apartment" {...FIELD_VALIDATION.apartment} /></div>
                </div>
              </div>
              <div className="field field--full"><label htmlFor="checkoutNotes">Observaciones</label><textarea id="checkoutNotes" name="notes" placeholder="Referencias del domicilio, horario u otra información útil." {...FIELD_VALIDATION.notes} /></div>
            </div>
            {formError && <p className="form-submit-error" role="alert">{formError}</p>}
            <button className="button button--green button--block" type="submit">Enviar pedido completo por WhatsApp</button>
            <p className="form-note">No se realizará ningún cobro desde la web. El pago y el envío se coordinan personalmente por WhatsApp.</p>
            <p className="form-note">Esta web no guarda tus datos personales. Al continuar, se compartirán con WhatsApp para preparar el mensaje.</p>
          </form>
        </div>
      </section>
    </>
  );
};
