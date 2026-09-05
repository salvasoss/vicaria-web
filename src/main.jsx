import React from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import App from './App.jsx';

// Hidrata el HTML prerenderizado; en desarrollo monta React desde cero.
const container = document.getElementById('root');
const hasPrerenderedContent = container.hasChildNodes();
const application = (
  <React.StrictMode>
    <App hydrateCartFromStorage={!hasPrerenderedContent} />
  </React.StrictMode>
);

if (hasPrerenderedContent) {
  hydrateRoot(container, application);
} else {
  createRoot(container).render(application);
}
