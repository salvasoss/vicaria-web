import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { CONTENT_SECURITY_POLICY, renderHeadersFile } from "./config/security.js";

export default defineConfig({
  plugins: [
    react(),
    // Durante la compilación agrega la CSP al HTML y genera las cabeceras de producción.
    {
      name: "vicaria-production-security",
      apply: "build",
      transformIndexHtml: {
        order: "post",
        handler: () => [{
          tag: "meta",
          attrs: { "http-equiv": "Content-Security-Policy", content: CONTENT_SECURITY_POLICY },
          injectTo: "head-prepend",
        }],
      },
      generateBundle() {
        this.emitFile({ type: "asset", fileName: "_headers", source: renderHeadersFile() });
      },
    },
  ],
  server: {
    // Limita el servidor de desarrollo a esta computadora y al puerto conocido del proyecto.
    host: "127.0.0.1",
    port: 3000,
    strictPort: true,
    cors: false,
    allowedHosts: ["localhost"],
    forwardConsole: false,
    fs: { strict: true },
  },
  // Produce solo archivos publicables y evita exponer mapas del código fuente.
  build: { outDir: "build", sourcemap: false },
  test: {
    // Simula el navegador para comprobar rutas, formularios y carrito sin enviar pedidos reales.
    environment: "jsdom",
    environmentOptions: { jsdom: { url: "http://localhost:3000/", pretendToBeVisual: true } },
    setupFiles: ["./src/setupTests.js"],
    include: ["src/**/*.test.{js,jsx}"],
  },
});
