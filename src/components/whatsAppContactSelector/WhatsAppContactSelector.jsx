import { useEffect, useId, useRef } from "react";
import { WHATSAPP_CONTACTS } from "../../config/business";
import "./whatsAppContactSelector.scss";

export const WhatsAppContactSelector = ({
  isOpen,
  onClose,
  onSelect,
}) => {
  const titleId = useId();
  const closeButtonRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return undefined;

    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };

    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);
    closeButtonRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
      previousFocus?.focus?.();
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="whatsapp-selector__overlay"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        className="whatsapp-selector"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <button
          ref={closeButtonRef}
          className="whatsapp-selector__close"
          type="button"
          onClick={onClose}
          aria-label="Cerrar selector de contacto"
        >
          ×
        </button>

        <div className="whatsapp-selector__heading">
          <span>Contacto directo</span>

          <h2 id={titleId}>
            ¿Con quién querés comunicarte?
          </h2>

          <p>
            Elegí una persona para continuar con tu mensaje por
            WhatsApp.
          </p>
        </div>

        <div className="whatsapp-selector__options">
          {WHATSAPP_CONTACTS.map((contact) => (
            <button
              className="whatsapp-selector__contact"
              type="button"
              key={contact.id}
              onClick={() => onSelect(contact)}
            >
              <img
                src="/img/whatsapp.png"
                alt=""
                width="48"
                height="48"
              />

              <span>
                <strong>{contact.name}</strong>
                <small>{contact.whatsappDisplay}</small>
              </span>

              <b aria-hidden="true">→</b>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
};