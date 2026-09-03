import { afterEach, beforeEach, expect, test, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import App from "./App.jsx";
import { products, WHOLESALE_MIN_BOXES } from "./mock/vicariaProducts";

beforeEach(() => {
  window.localStorage.clear();
  window.history.pushState({}, "", "/");
});

afterEach(() => vi.restoreAllMocks());

test("muestra el llamado principal de Vicaria", () => {
  render(<App />);
  expect(
    screen.getByRole("heading", { name: /más de 70 años cuidando/i })
  ).toBeInTheDocument();
  expect(screen.getByRole("link", { name: /comprar productos/i })).toBeInTheDocument();
  expect(screen.getByRole("link", { name: /consultar a vicaria por whatsapp/i })).toBeInTheDocument();
  expect(screen.getByRole("link", { name: "LINKEALO" })).toHaveAttribute(
    "href",
    "https://www.instagram.com/linkealo.arg"
  );
  expect(screen.getByRole("link", { name: "TR_WEB_STUDIO" })).toHaveAttribute(
    "href",
    "https://www.trwebstudio.website/"
  );
});

test("mantiene el mínimo mayorista y muestra los cuatro productos vigentes", () => {
  expect(WHOLESALE_MIN_BOXES).toBe(10);
  expect(products).toHaveLength(4);
  expect(products.map((product) => product.name)).toEqual([
    "Limpia Radiadores", "Sella Grietas FK20", "Sella Grietas Súper", "Sella Grietas",
  ]);
  expect(products[0].price).toBe(93600);
  expect(products[0].boxContent).toBe("24 unidades");
});

test("mantiene el formulario minorista y agrega la opción mayorista desde 10 cajas", () => {
  window.localStorage.setItem(
    "vicaria-cart",
    JSON.stringify([
      { productId: products[0].id, quantity: WHOLESALE_MIN_BOXES },
      { productId: products[1].id, quantity: 2 },
    ])
  );
  window.history.pushState({}, "", "/carrito");

  render(<App />);

  const wholesaleLink = screen.getByRole("link", { name: "COMPRA MAYORISTA" });
  expect(wholesaleLink).toBeInTheDocument();
  expect(screen.getByText(/tu pedido ya califica como mayorista/i)).toBeInTheDocument();
  expect(wholesaleLink.getAttribute("href")).toContain(`cantidad_${products[0].id}=10`);
  expect(wholesaleLink.getAttribute("href")).toContain(`cantidad_${products[1].id}=2`);
  expect(screen.getByRole("heading", { name: /datos del cliente y entrega/i })).toBeInTheDocument();

  fireEvent.click(screen.getAllByRole("button", { name: /restar una caja/i })[0]);

  expect(screen.queryByRole("link", { name: "COMPRA MAYORISTA" })).not.toBeInTheDocument();
  expect(screen.getByText(/te falta 1 caja.*canal mayorista/i)).toBeInTheDocument();
  expect(screen.getByRole("heading", { name: /datos del cliente y entrega/i })).toBeInTheDocument();
});

test("habilita cantidades menores en otros productos cuando uno alcanza 10 cajas", () => {
  window.history.pushState({}, "", "/contacto");
  render(<App />);

  const mainQuantity = screen.getByLabelText(`Cantidad de cajas de ${products[0].name}`);
  const additionalQuantity = screen.getByLabelText(`Cantidad de cajas de ${products[1].name}`);

  fireEvent.change(mainQuantity, { target: { value: "10" } });
  fireEvent.change(additionalQuantity, { target: { value: "2" } });

  expect(screen.getByText("Mínimo mayorista alcanzado")).toBeInTheDocument();
  expect(additionalQuantity).toHaveValue(2);
  expect(additionalQuantity).toHaveAttribute("min", "1");
});

test("aplica límites numéricos a CUIT, teléfono, DNI y código postal", () => {
  window.history.pushState({}, "", "/contacto");
  const { unmount } = render(<App />);

  expect(screen.getByLabelText("CUIT")).toHaveAttribute("pattern", "[0-9]{11}");
  expect(screen.getByLabelText(/teléfono/i)).toHaveAttribute("maxlength", "15");

  unmount();
  window.localStorage.setItem(
    "vicaria-cart",
    JSON.stringify([{ productId: products[0].id, quantity: 1 }])
  );
  window.history.pushState({}, "", "/carrito");
  render(<App />);

  const dni = screen.getByLabelText(/DNI/);
  const postalCode = screen.getByLabelText(/Código postal/);
  expect(dni).toHaveAttribute("pattern", "[0-9]{7,9}");
  expect(dni).toHaveAttribute("maxlength", "9");
  expect(postalCode).toHaveAttribute("pattern", "[0-9]{4}");

  fireEvent.input(dni, { target: { value: "12A34B567890" } });
  expect(dni).toHaveValue("123456789");
});

test("muestra el acceso mayorista y los otros productos en cada detalle", () => {
  window.history.pushState({}, "", `/productos/${products[0].id}`);

  render(<App />);

  expect(
    screen.getByRole("link", { name: /necesitás precio mayorista.*solicitá una cotización/i })
  ).toBeInTheDocument();
  expect(screen.getByText(/compra mayorista desde 10 cajas/i)).toBeInTheDocument();
  expect(screen.getByRole("heading", { name: /productos relacionados/i })).toBeInTheDocument();
  products.slice(1).forEach((product) => {
    expect(screen.getAllByRole("link", { name: product.name }).length).toBeGreaterThan(0);
  });
});

test("traslada todo el carrito al formulario mayorista sin perder cantidades", () => {
  window.localStorage.setItem("vicaria-cart", JSON.stringify([
    { productId: 2, quantity: 10 }, { productId: 3, quantity: 2 },
  ]));
  window.history.pushState({}, "", "/carrito");
  render(<App />);
  fireEvent.click(screen.getByRole("link", { name: "COMPRA MAYORISTA" }));
  expect(screen.getByText("Pedido cargado desde tu carrito")).toBeInTheDocument();
  expect(screen.getByLabelText(`Cantidad de cajas de ${products[1].name}`)).toHaveValue(10);
  expect(screen.getByLabelText(`Cantidad de cajas de ${products[2].name}`)).toHaveValue(2);
});

test("descarta cantidades manipuladas en los parámetros del formulario mayorista", () => {
  window.history.pushState({}, "", "/contacto?cantidad_2=0x10&cantidad_3=1e3&cantidad_4=9007199254740992");
  render(<App />);
  products.forEach((product) => {
    expect(screen.getByLabelText(`Cantidad de cajas de ${product.name}`)).toHaveValue(null);
  });
  expect(screen.queryByText("Mínimo mayorista alcanzado")).not.toBeInTheDocument();
});

test("bloquea pedidos minoristas incompletos y prepara un único mensaje válido", () => {
  const open = vi.spyOn(window, "open").mockImplementation(() => null);
  window.localStorage.setItem("vicaria-cart", JSON.stringify([{ productId: 2, quantity: 1 }]));
  window.history.pushState({}, "", "/carrito");
  render(<App />);
  const submit = screen.getByRole("button", { name: /enviar pedido completo/i });
  fireEvent.click(submit);
  expect(open).not.toHaveBeenCalled();
  expect(screen.getByLabelText(/Nombre y apellido/).closest("form")).toHaveClass("form--validated");

  fireEvent.change(screen.getByLabelText(/Nombre y apellido/), { target: { value: "María Pérez" } });
  fireEvent.change(screen.getByLabelText(/Teléfono/), { target: { value: "3543531070" } });
  fireEvent.change(screen.getByLabelText(/DNI/), { target: { value: "12345678" } });
  fireEvent.change(screen.getByLabelText(/Provincia/), { target: { value: "Córdoba" } });
  fireEvent.change(screen.getByLabelText(/Localidad/), { target: { value: "Córdoba" } });
  fireEvent.change(screen.getByLabelText(/Código postal/), { target: { value: "5000" } });
  fireEvent.change(screen.getByLabelText(/Calle/), { target: { value: "Av. 25 de Mayo" } });
  fireEvent.change(screen.getByLabelText(/^Número/), { target: { value: "123" } });
  fireEvent.click(submit);
  expect(open).toHaveBeenCalledTimes(1);
  const url = new URL(open.mock.calls[0][0]);
  expect(url.pathname).toBe("/5493515382948");
  const message = url.searchParams.get("text");
  expect(message).toContain("Sella Grietas FK20: 1 caja");
  expect(message).toContain("Dirección: Av. 25 de Mayo 123");
  expect(message).toContain("DNI: 12345678");
  expect(message).not.toMatch(/promo|bonifica|excepci/i);
  expect(open.mock.calls[0].slice(1)).toEqual(["_blank", "noopener,noreferrer"]);
  expect(JSON.parse(window.localStorage.getItem("vicaria-cart"))).toEqual([
    { productId: 2, quantity: 1 },
  ]);
});

test("el mínimo mayorista se exige por producto, no por suma del pedido", () => {
  const open = vi.spyOn(window, "open").mockImplementation(() => null);
  window.history.pushState({}, "", "/contacto");
  render(<App />);
  const fill = (label, value) => fireEvent.change(screen.getByLabelText(label), { target: { value } });
  fill(/Nombre del comercio/, "Repuestos Centro");
  fill(/Tipo de negocio/, "Casa de repuestos");
  fill(/Nombre y apellido/, "Juan Pérez");
  fill(/Teléfono/, "3543531070");
  fill(/Provincia/, "Córdoba");
  fill(/Localidad/, "Córdoba");
  fill(`Cantidad de cajas de ${products[0].name}`, "5");
  fill(`Cantidad de cajas de ${products[1].name}`, "5");
  const submit = screen.getByRole("button", { name: /enviar solicitud/i });
  fireEvent.click(submit);
  expect(open).not.toHaveBeenCalled();
  expect(screen.getByText("Ingresá al menos 10 cajas de un mismo producto.")).toBeInTheDocument();
  fill(`Cantidad de cajas de ${products[0].name}`, "10");
  fill(`Cantidad de cajas de ${products[1].name}`, "2");
  fireEvent.click(submit);
  expect(open).toHaveBeenCalledTimes(1);
  const message = new URL(open.mock.calls[0][0]).searchParams.get("text");
  expect(message).toContain("Limpia Radiadores: 10 cajas");
  expect(message).toContain("Sella Grietas FK20: 2 cajas");
  expect(message).not.toMatch(/promo|bonifica|excepci/i);
});

test.each([
  ["/Productos", /productos vicaria/i],
  ["/Contacto", /comprá vicaria.*al por mayor/i],
  ["/acerca", /una historia que empezó/i],
  ["/clientes", /esta página no existe/i],
  ["/item/2", /^Sella Grietas FK20$/],
  ["/no-existe", /esta página no existe/i],
])(
  "mantiene navegables las rutas: %s", (route, heading) => {
    window.history.pushState({}, "", route);
    render(<App />);
    expect(screen.getByRole("heading", { name: heading })).toBeInTheDocument();
  }
);

test("elimina Clientes de la navegación", () => {
  render(<App />);
  expect(screen.queryByRole("link", { name: "Clientes" })).not.toBeInTheDocument();
});

test("anima y permite cerrar con Escape el menú hamburguesa", () => {
  const previousMatchMedia = window.matchMedia;
  window.matchMedia = vi.fn(() => ({
    matches: true,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  }));
  try {
    render(<App />);
    const button = screen.getByRole("button", { name: "Abrir menú" });
    const navigation = screen.getByRole("navigation", { hidden: true });
    expect(navigation).toHaveAttribute("aria-hidden", "true");
    fireEvent.click(button);
    expect(button).toHaveClass("menu-button--open");
    expect(navigation).toHaveClass("main-nav--open");
    expect(navigation).not.toHaveAttribute("aria-hidden");
    fireEvent.keyDown(window, { key: "Escape" });
    expect(button).not.toHaveClass("menu-button--open");
  } finally {
    window.matchMedia = previousMatchMedia;
  }
});

test("mantiene el video principal en reproducción automática y sin sonido", () => {
  const { container } = render(<App />);
  const video = container.querySelector("video");
  expect(video).toHaveAttribute("autoplay");
  expect(video).toHaveAttribute("loop");
  expect(video).toHaveProperty("muted", true);
  expect(video.querySelector("source")).toHaveAttribute("src", "/videos/videofondo.mp4");
});
