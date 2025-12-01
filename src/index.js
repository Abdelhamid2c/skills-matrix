/**
 * Point d'entrée de l'application React
 * Initialise et monte l'application dans le DOM
 */

import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';

// Récupération de l'élément root du DOM
const container = document.getElementById('root');
const root = createRoot(container);

// Rendu de l'application
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
