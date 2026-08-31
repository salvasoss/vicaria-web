import { normalizeQuantity } from "../../config/quantities";
import "./quantityPicker.scss";

export const QuantityPicker = ({ value, onChange, label = "Cantidad de cajas" }) => {
  // Centraliza botones y campo numérico; cualquier cambio pasa por la normalización segura.
  const change = (next) => onChange(normalizeQuantity(next));

  return (
    <div className="quantity-picker">
      <span className="quantity-picker__label">{label}</span>
      <div className="quantity-picker__controls">
        <button type="button" aria-label="Restar una caja" onClick={() => change(value - 1)}>−</button>
        <input
          type="number"
          min="1"
          step="1"
          inputMode="numeric"
          value={value}
          aria-label={label}
          onChange={(event) => change(event.target.value)}
        />
        <button type="button" aria-label="Agregar una caja" onClick={() => change(value + 1)}>+</button>
      </div>
    </div>
  );
};
