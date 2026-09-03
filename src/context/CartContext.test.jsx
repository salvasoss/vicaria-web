import { afterEach, beforeEach, expect, test, vi } from "vitest";
import { act } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { CartProvider, useCart, useCartToast } from "./CartContext";

const CartProbe = ({ onRender = () => {} }) => {
  const cart = useCart();
  onRender();
  return (
    <>
      <output data-testid="count">{cart.itemCount}</output>
      <output data-testid="total">{cart.total}</output>
      <button onClick={() => cart.addItem(2)}>Agregar</button>
      <button onClick={() => cart.addItem(999)}>Producto eliminado</button>
      <button onClick={() => cart.updateQuantity(2, 1)}>Misma cantidad</button>
    </>
  );
};

const ToastProbe = () => {
  const { toast } = useCartToast();
  return <output data-testid="toast">{toast}</output>;
};

beforeEach(() => window.localStorage.clear());
afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
});

test("recupera sólo productos vigentes y cantidades válidas, agrupando duplicados", () => {
  window.localStorage.setItem("vicaria-cart", JSON.stringify([
    null,
    { productId: 999, quantity: 10 },
    { productId: 2, quantity: 2 },
    { productId: 2, quantity: "3" },
    { productId: 3, quantity: -1 },
    { productId: 4, quantity: 1.5 },
  ]));
  render(<CartProvider><CartProbe /></CartProvider>);
  expect(screen.getByTestId("count")).toHaveTextContent("5");
  expect(screen.getByTestId("total")).toHaveTextContent("468000");
  expect(JSON.parse(window.localStorage.getItem("vicaria-cart"))).toEqual([
    { productId: 2, quantity: 5 },
  ]);
});

test.each(["no es JSON", "{}", "null"])("tolera almacenamiento inválido: %s", (saved) => {
  window.localStorage.setItem("vicaria-cart", saved);
  render(<CartProvider><CartProbe /></CartProvider>);
  expect(screen.getByTestId("count")).toHaveTextContent("0");
  fireEvent.click(screen.getByText("Producto eliminado"));
  expect(screen.getByTestId("count")).toHaveTextContent("0");
});

test("funciona aunque el navegador no permita guardar el carrito", () => {
  vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
    throw new Error("Almacenamiento no disponible");
  });
  render(<CartProvider><CartProbe /></CartProvider>);
  fireEvent.click(screen.getByText("Agregar"));
  expect(screen.getByTestId("count")).toHaveTextContent("1");
});

test("ignora nombres, precios y datos personales inyectados en el carrito guardado", () => {
  window.localStorage.setItem("vicaria-cart", JSON.stringify([
    { productId: 2, quantity: 2, price: 1, name: "<script>alert(1)</script>", dni: "12345678" },
  ]));
  render(<CartProvider><CartProbe /></CartProvider>);
  expect(screen.getByTestId("total")).toHaveTextContent("187200");
  expect(JSON.parse(window.localStorage.getItem("vicaria-cart"))).toEqual([
    { productId: 2, quantity: 2 },
  ]);
});

test("calcula el precio vigente de Limpia Radiadores", () => {
  window.localStorage.setItem("vicaria-cart", JSON.stringify([
    { productId: 1, quantity: 2 },
  ]));
  const PendingPriceProbe = () => {
    const cart = useCart();
    return <><output data-testid="pending">{String(cart.hasPendingPrice)}</output><output data-testid="pending-subtotal">{String(cart.cartDetails[0].subtotal)}</output></>;
  };
  render(<CartProvider><PendingPriceProbe /></CartProvider>);
  expect(screen.getByTestId("pending")).toHaveTextContent("false");
  expect(screen.getByTestId("pending-subtotal")).toHaveTextContent("187200");
});

test("cerrar el aviso no vuelve a renderizar los consumidores del carrito", () => {
  vi.useFakeTimers();
  const onRender = vi.fn();
  render(<CartProvider><CartProbe onRender={onRender} /><ToastProbe /></CartProvider>);
  fireEvent.click(screen.getByText("Agregar"));
  expect(screen.getByTestId("toast")).toHaveTextContent("agregada al carrito");
  const rendersAfterAdd = onRender.mock.calls.length;
  act(() => vi.advanceTimersByTime(2200));
  expect(screen.getByTestId("toast")).toBeEmptyDOMElement();
  expect(onRender).toHaveBeenCalledTimes(rendersAfterAdd);
  fireEvent.click(screen.getByText("Misma cantidad"));
  expect(onRender).toHaveBeenCalledTimes(rendersAfterAdd);
});
