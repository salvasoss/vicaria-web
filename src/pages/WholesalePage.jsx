import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { createWhatsAppUrl } from "../config/business";
import { FIELD_VALIDATION, sanitizeDigits, validateForm, clearFieldValidity } from "../config/formValidation";
import { isValidQuantity } from "../config/quantities";
import { products, WHOLESALE_MIN_BOXES } from "../mock/vicariaProducts";

// Recupera las cantidades enviadas desde el carrito y descarta parámetros manipulados.
const createInitialQuantities = (searchParams) =>
  Object.fromEntries(
    products.map((product) => {
      const requestedQuantity = searchParams.get(`cantidad_${product.id}`);
      const validQuantity = isValidQuantity(requestedQuantity);

      return [product.id, validQuantity ? String(Number(requestedQuantity)) : ""];
    })
  );

export const WholesalePage = () => {
  const [searchParams] = useSearchParams();
  const [quantities, setQuantities] = useState(() => createInitialQuantities(searchParams));
  const [error, setError] = useState("");
  const [wasValidated, setWasValidated] = useState(false);
  const [formError, setFormError] = useState("");
  const importedFromCart = searchParams.get("origen") === "carrito";

  // Incluye todos los productos pedidos desde una caja, una vez alcanzado el mínimo general.
  const selectedProducts = products.filter(
    (product) => Number(quantities[product.id]) >= 1
  );

  // La compra es mayorista solo si un mismo producto tiene diez cajas o más.
  const hasWholesaleMinimum = products.some(
    (product) => Number(quantities[product.id]) >= WHOLESALE_MIN_BOXES
  );

  const hasInvalidQuantity = products.some((product) => {
    const rawValue = quantities[product.id];
    return rawValue !== "" && !isValidQuantity(rawValue);
  });

  const submit = (event) => {
    // Bloquea el envío si faltan datos, hay cantidades inválidas o no se cumple el mínimo.
    event.preventDefault();
    const formElement = event.currentTarget;
    setWasValidated(true);

    if (hasInvalidQuantity) {
      setError("Las cantidades seleccionadas deben ser números enteros desde 1 caja.");
    } else if (!hasWholesaleMinimum) {
      setError(`Ingresá al menos ${WHOLESALE_MIN_BOXES} cajas de un mismo producto.`);
    } else {
      setError("");
    }

    if (!validateForm(formElement) || hasInvalidQuantity || !hasWholesaleMinimum) {
      setFormError("Completá los campos obligatorios marcados en rojo antes de continuar.");
      formElement.querySelector(":invalid")?.focus();
      return;
    }

    setFormError("");
    const form = new FormData(formElement);
    const lines = selectedProducts.map((product) => {
      const quantity = Number(quantities[product.id]);
      return `• ${product.name}: ${quantity} cajas`;
    });
    // Ordena comercio, contacto y productos en un único mensaje revisable de WhatsApp.
    const message = [
      "SOLICITUD MAYORISTA · VICARIA",
      "",
      "DATOS DEL COMERCIO",
      `Comercio: ${form.get("businessName")}`,
      `Rubro: ${form.get("businessType")}`,
      `CUIT: ${form.get("cuit") || "No informado"}`,
      `Persona de contacto: ${form.get("name")}`,
      `Teléfono: ${form.get("phone")}`,
      `Email: ${form.get("email") || "No informado"}`,
      `Ubicación: ${form.get("city")}, ${form.get("province")}`,
      "",
      "PRODUCTOS Y CANTIDADES",
      ...lines,
      "",
      `Modalidad: ${form.get("delivery")}`,
      `Observaciones: ${form.get("notes") || "Sin observaciones"}`,
      "",
      "Quisiera recibir la cotización mayorista y coordinar la entrega.",
    ].join("\n");

    window.open(createWhatsAppUrl(message), "_blank", "noopener,noreferrer");
  };

  return (
    <>
      <section className="page-hero wholesale-hero">
        <div className="container">
          <h1 className="page-title">Comprá Vicaria<br /><span className="text-yellow-on-dark">al por mayor.</span></h1>
          <p className="page-intro">
            El pedido mínimo mayorista es de <strong className="text-yellow-on-dark">10 cajas del mismo producto</strong>.
            Al alcanzar ese mínimo, podés sumar la cantidad que quieras de los demás productos.
          </p>
        </div>
      </section>

      <section className="section section--soft">
        <div className="container wholesale-layout">
          <aside className="wholesale-aside">
            <h2>Un canal directo para hacer crecer tu negocio.</h2>
            <ul className="check-list">
              <li>Compra mínima: 10 cajas de un producto.</li>
              <li>Luego podés sumar desde 1 caja de las otras variedades.</li>
              <li>Precios mayoristas a coordinar.</li>
              <li>Envíos a todo el país.</li>
              <li>Atención directa por WhatsApp.</li>
              <li>Productos con más de 70 años de trayectoria.</li>
            </ul>
          </aside>

          <form className={`wholesale-form ${wasValidated ? "form--validated" : ""}`} onSubmit={submit} onInput={clearFieldValidity} noValidate>
            <div className="form-heading">
              <span>Solicitud mayorista</span>
              <h2>Contanos sobre tu pedido</h2>
              <p>Los campos marcados con * son obligatorios.</p>
            </div>

            {importedFromCart && selectedProducts.length > 0 && (
              <div className="cart-import-notice" role="status">
                <strong>Pedido cargado desde tu carrito</strong>
                <p>Ya completamos las cantidades mayoristas. Podés revisarlas antes de enviar la solicitud.</p>
              </div>
            )}

            <div className="form-grid">
              <div className="field"><label htmlFor="businessName">Nombre del comercio *</label><input id="businessName" name="businessName" required {...FIELD_VALIDATION.businessName} /></div>
              <div className="field"><label htmlFor="businessType">Tipo de negocio *</label><select id="businessType" name="businessType" required defaultValue=""><option value="" disabled>Seleccionar</option><option>Casa de repuestos</option><option>Distribuidora</option><option>Taller mecánico</option><option>Lubricentro</option><option>Otro</option></select></div>
              <div className="field"><label htmlFor="wholesaleName">Nombre y apellido *</label><input id="wholesaleName" name="name" required {...FIELD_VALIDATION.personName} /></div>
              <div className="field"><label htmlFor="cuit">CUIT</label><input id="cuit" name="cuit" onInput={sanitizeDigits} {...FIELD_VALIDATION.cuit} /><small className="field-hint">11 números, sin guiones.</small></div>
              <div className="field"><label htmlFor="wholesalePhone">Teléfono *</label><input id="wholesalePhone" name="phone" required onInput={sanitizeDigits} {...FIELD_VALIDATION.phone} /><small className="field-hint">Entre 8 y 15 números, sin espacios.</small></div>
              <div className="field"><label htmlFor="wholesaleEmail">Email</label><input id="wholesaleEmail" name="email" {...FIELD_VALIDATION.email} /></div>
              <div className="field"><label htmlFor="province">Provincia *</label><input id="province" name="province" required {...FIELD_VALIDATION.location} /></div>
              <div className="field"><label htmlFor="city">Localidad *</label><input id="city" name="city" required {...FIELD_VALIDATION.location} /></div>
            </div>

            <fieldset className={`product-quantities ${error ? "product-quantities--invalid" : ""}`}>
              <legend>Productos y cantidades</legend>
              <p>Ingresá 10 cajas o más de al menos un producto. Después podés sumar desde 1 caja de los demás.</p>
              {products.map((product) => {
                const rawValue = quantities[product.id];
                const quantityIsInvalid = rawValue !== "" && !isValidQuantity(rawValue);

                return (
                  <label key={product.id} htmlFor={`quantity-${product.id}`}>
                    <span><img src={product.image} alt="" /><strong>{product.name}</strong></span>
                    <span className="wholesale-quantity-field">
                      <input
                        id={`quantity-${product.id}`}
                        type="number"
                        min="1"
                        step="1"
                        inputMode="numeric"
                        placeholder="Cantidad"
                        aria-label={`Cantidad de cajas de ${product.name}`}
                        aria-invalid={quantityIsInvalid}
                        className={quantityIsInvalid ? "quantity-input--invalid" : ""}
                        value={rawValue}
                        onChange={(event) => {
                          setQuantities((current) => ({ ...current, [product.id]: event.target.value }));
                          setError("");
                        }}
                      />
                      <small>cajas</small>
                    </span>
                  </label>
                );
              })}
              {hasWholesaleMinimum && (
                <div className="wholesale-minimum-reached" role="status">
                  <strong>Mínimo mayorista alcanzado</strong>
                  <p>Ya podés agregar desde 1 caja de cualquiera de los otros productos.</p>
                </div>
              )}
              {error && <p className="form-error" role="alert">{error}</p>}
            </fieldset>

            <div className="form-grid">
              <div className="field field--full"><label htmlFor="delivery">Entrega *</label><select id="delivery" name="delivery" required><option>Necesito envío</option><option>Quiero consultar retiro</option><option>A coordinar</option></select></div>
              <div className="field field--full"><label htmlFor="wholesaleNotes">Observaciones</label><textarea id="wholesaleNotes" name="notes" placeholder="Contanos cualquier detalle relevante para la cotización." {...FIELD_VALIDATION.notes} /></div>
            </div>
            {formError && <p className="form-submit-error" role="alert">{formError}</p>}
            <button className="button button--green button--block" type="submit">Enviar solicitud por WhatsApp</button>
            <p className="form-note">Al continuar se abrirá WhatsApp con la solicitud completa. Podrás revisar el mensaje antes de enviarlo.</p>
            <p className="form-note">Esta web no guarda tus datos personales. Al continuar, se compartirán con WhatsApp para preparar el mensaje.</p>
          </form>
        </div>
      </section>
    </>
  );
};
