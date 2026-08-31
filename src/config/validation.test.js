import { expect, test } from "vitest";
import { FIELD_VALIDATION } from "./formValidation";
import { isValidQuantity, normalizeQuantity } from "./quantities";

test.each([1, 10, 23, "10"])("acepta cantidades enteras positivas: %s", (quantity) => {
  expect(isValidQuantity(quantity)).toBe(true);
});

test.each(["", 0, -1, 1.5, Infinity, "no", true, null, Number.MAX_SAFE_INTEGER + 1])(
  "rechaza cantidades inválidas: %s", (quantity) => {
    expect(isValidQuantity(quantity)).toBe(false);
  }
);

test("el selector normaliza las cantidades a cajas enteras", () => {
  expect(normalizeQuantity(2.7)).toBe(2);
  expect(normalizeQuantity(-5)).toBe(1);
  expect(normalizeQuantity(Infinity)).toBe(1);
});

test("valida nombres, números y domicilios con los patrones compartidos", () => {
  const matches = (field, value) => new RegExp(`^(?:${FIELD_VALIDATION[field].pattern})$`, "u").test(value);
  expect(matches("personName", "María-José O'Connor")).toBe(true);
  expect(matches("personName", "Juan123")).toBe(false);
  expect(matches("dni", "123456789")).toBe(true);
  expect(matches("dni", "1234567890")).toBe(false);
  expect(matches("cuit", "20123456789")).toBe(true);
  expect(matches("cuit", "20-12345678-9")).toBe(false);
  expect(matches("postalCode", "5000")).toBe(true);
  expect(matches("street", "Av. 25 de Mayo")).toBe(true);
  expect(matches("apartment", "2 / A-3")).toBe(true);
});
