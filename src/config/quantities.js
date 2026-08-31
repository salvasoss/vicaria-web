// Solo acepta cajas enteras positivas y evita formatos ambiguos como 1e3 o 0x10.
export const isValidQuantity = (value) =>
  (typeof value === "number" || (typeof value === "string" && /^[0-9]+$/.test(value)))
  && Number.isSafeInteger(Number(value)) && Number(value) >= 1;

export const normalizeQuantity = (value) => {
  // Corrige lo recibido por los selectores y usa una caja como valor seguro mínimo.
  const quantity = Math.trunc(Number(value));
  return isValidQuantity(quantity) ? quantity : 1;
};
