import { expect, test } from "vitest";
import { createWhatsAppUrl } from "./business";
import { isValidQuantity } from "./quantities";
import { FIELD_VALIDATION, validateForm, clearFieldValidity } from "./formValidation";
import { CONTENT_SECURITY_POLICY, SECURITY_HEADERS } from "../../config/security";

test("el mensaje no puede cambiar el destino ni los parámetros de WhatsApp", () => {
  const message = '<script>alert(1)</script> &phone=0000000#fragmento\nDirección: Córdoba';
  const url = new URL(createWhatsAppUrl(message));
  expect(url.origin).toBe("https://wa.me");
  expect(url.pathname).toBe("/5493515382948");
  expect([...url.searchParams.keys()]).toEqual(["text"]);
  expect(url.searchParams.get("text")).toBe(message);
  expect(url.hash).toBe("");
});

test.each(["0x10", "1e3", "10.5", " 10 ", "<script>", "9007199254740992"])(
  "rechaza representaciones ambiguas o inválidas de cantidades: %s", (value) => {
    expect(isValidQuantity(value)).toBe(false);
  }
);

test("rechaza campos obligatorios con espacios y permite corregirlos", () => {
  const form = document.createElement("form");
  const field = document.createElement("input");
  Object.assign(field, FIELD_VALIDATION.personName, { required: true, value: "   " });
  form.append(field);
  expect(validateForm(form)).toBe(false);
  field.value = "María Pérez";
  clearFieldValidity({ target: field });
  expect(validateForm(form)).toBe(true);
});

test("controla límites también en valores asignados por código", () => {
  const form = document.createElement("form");
  const field = document.createElement("textarea");
  Object.assign(field, FIELD_VALIDATION.notes, { value: "A".repeat(501) });
  form.append(field);
  expect(validateForm(form)).toBe(false);
  field.value = "Pedido 123: llamar por la mañana.";
  expect(validateForm(form)).toBe(true);
});

test("la política limita scripts propios y bloquea objetos y formularios externos", () => {
  expect(CONTENT_SECURITY_POLICY).toContain("script-src 'self'");
  expect(CONTENT_SECURITY_POLICY).not.toMatch(/unsafe-inline|unsafe-eval/);
  expect(CONTENT_SECURITY_POLICY).toContain("object-src 'none'");
  expect(CONTENT_SECURITY_POLICY).toContain("form-action 'none'");
  expect(SECURITY_HEADERS["Content-Security-Policy"]).toContain("frame-ancestors 'none'");
  expect(SECURITY_HEADERS["Referrer-Policy"]).toBe("no-referrer");
});
