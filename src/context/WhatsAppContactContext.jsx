import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { WhatsAppContactSelector } from "../components/whatsAppContactSelector/WhatsAppContactSelector";
import { createWhatsAppUrl } from "../config/business";

const WhatsAppContactContext = createContext(null);

export const WhatsAppContactProvider = ({ children }) => {
  const [message, setMessage] = useState("");

  const openWhatsAppSelector = useCallback((nextMessage) => {
    if (
      typeof nextMessage !== "string" ||
      !nextMessage.trim()
    ) {
      return;
    }

    setMessage(nextMessage);
  }, []);

  const closeWhatsAppSelector = useCallback(() => {
    setMessage("");
  }, []);

  const selectWhatsAppContact = useCallback(
    (contact) => {
      if (!message) return;

      window.open(
        createWhatsAppUrl(
          message,
          contact.whatsappNumber
        ),
        "_blank",
        "noopener,noreferrer"
      );

      setMessage("");
    },
    [message]
  );

  const value = useMemo(
    () => ({
      openWhatsAppSelector,
    }),
    [openWhatsAppSelector]
  );

  return (
    <WhatsAppContactContext.Provider value={value}>
      {children}

      <WhatsAppContactSelector
        isOpen={Boolean(message)}
        onClose={closeWhatsAppSelector}
        onSelect={selectWhatsAppContact}
      />
    </WhatsAppContactContext.Provider>
  );
};

export const useWhatsAppContact = () => {
  const context = useContext(WhatsAppContactContext);

  if (!context) {
    throw new Error(
      "useWhatsAppContact debe utilizarse dentro de WhatsAppContactProvider"
    );
  }

  return context;
};