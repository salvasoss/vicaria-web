// Reúne las reglas de todos los formularios para mantener validaciones consistentes.
export const FIELD_VALIDATION = {
  businessName: {
    type: "text",
    minLength: 2,
    maxLength: 100,
    title: "Ingresá un nombre de comercio de entre 2 y 100 caracteres.",
  },
  personName: {
    type: "text",
    minLength: 2,
    maxLength: 80,
    pattern: "[A-Za-zÁÉÍÓÚáéíóúÑñÜü' \\-]{2,80}",
    title: "Ingresá solamente letras, espacios, apóstrofes o guiones.",
  },
  cuit: {
    type: "text",
    inputMode: "numeric",
    maxLength: 11,
    pattern: "[0-9]{11}",
    title: "El CUIT debe contener exactamente 11 números, sin guiones.",
  },
  phone: {
    type: "tel",
    inputMode: "numeric",
    maxLength: 15,
    pattern: "[0-9]{8,15}",
    title: "Ingresá entre 8 y 15 números, sin espacios ni símbolos.",
  },
  email: {
    type: "email",
    maxLength: 120,
    title: "Ingresá un correo electrónico válido.",
  },
  location: {
    type: "text",
    minLength: 2,
    maxLength: 60,
    pattern: "[A-Za-zÁÉÍÓÚáéíóúÑñÜü' \\-]{2,60}",
    title: "Ingresá solamente letras, espacios, apóstrofes o guiones.",
  },
  dni: {
    type: "text",
    inputMode: "numeric",
    maxLength: 9,
    pattern: "[0-9]{7,9}",
    title: "El DNI debe contener entre 7 y 9 números.",
  },
  postalCode: {
    type: "text",
    inputMode: "numeric",
    maxLength: 4,
    pattern: "[0-9]{4}",
    title: "El código postal debe contener exactamente 4 números.",
  },
  street: {
    type: "text",
    minLength: 2,
    maxLength: 100,
    pattern: "[A-Za-zÁÉÍÓÚáéíóúÑñÜü0-9.' \\-]{2,100}",
    title: "Ingresá un nombre de calle válido.",
  },
  addressNumber: {
    type: "text",
    inputMode: "numeric",
    maxLength: 6,
    pattern: "[0-9]{1,6}",
    title: "Ingresá un número de domicilio de hasta 6 cifras.",
  },
  apartment: {
    type: "text",
    maxLength: 20,
    pattern: "[A-Za-z0-9 .\\/\\-]{0,20}",
    title: "Ingresá hasta 20 letras o números.",
  },
  notes: {
    maxLength: 500,
  },
};

export const sanitizeDigits = (event) => {
  // Elimina letras y símbolos de campos numéricos y respeta su longitud máxima.
  const input = event.currentTarget;
  const maxLength = input.maxLength > 0 ? input.maxLength : undefined;
  input.value = input.value.replace(/\D/g, "").slice(0, maxLength);
};

// Valida campos obligatorios y longitudes, incluso si un valor fue asignado por código.
// Estas reglas evitan errores de carga, pero no autentican al cliente.
export const validateForm = (form) => {
  for (const field of form.elements) {
    if (!(field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement)) continue;
    field.setCustomValidity("");
    const value = field.value.trim();
    if (field.required && !value) {
      field.setCustomValidity("Completá este campo.");
    } else if (value && field.minLength > 0 && value.length < field.minLength) {
      field.setCustomValidity(`Ingresá al menos ${field.minLength} caracteres.`);
    } else if (field.maxLength >= 0 && field.value.length > field.maxLength) {
      field.setCustomValidity(`Ingresá hasta ${field.maxLength} caracteres.`);
    }
  }
  return form.checkValidity();
};

export const clearFieldValidity = (event) => {
  // Borra el error personalizado mientras el cliente corrige el campo.
  event.target.setCustomValidity?.("");
};
