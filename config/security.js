// Autoriza únicamente recursos propios y bloquea código inline, objetos y formularios externos.
export const CONTENT_SECURITY_POLICY = [
  "default-src 'none'",
  "script-src 'self'",
  "style-src 'self'",
  "img-src 'self' data:",
  "media-src 'self'",
  "font-src 'self'",
  "connect-src 'self'",
  "object-src 'none'",
  "base-uri 'none'",
  "form-action 'none'",
].join("; ");

// Cabeceras defensivas que el hosting debe devolver junto con la web publicada.
export const SECURITY_HEADERS = {
  "Content-Security-Policy": `${CONTENT_SECURITY_POLICY}; frame-ancestors 'none'`,
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "Referrer-Policy": "no-referrer",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=(), payment=()",
};

// Convierte la configuración anterior al formato _headers utilizado por hosts compatibles.
export const renderHeadersFile = () =>
  `/*\n${Object.entries(SECURITY_HEADERS).map(([key, value]) => `  ${key}: ${value}`).join("\n")}\n`;
