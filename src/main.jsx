import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';

// Punto de entrada: monta la aplicación React dentro del elemento principal del HTML.
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
