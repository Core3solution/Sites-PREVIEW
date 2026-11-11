import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { App } from './App';
import { site } from './site.config';
import { applyTheme } from './core/lib/theme';

// Aplica as cores antes do primeiro paint para evitar "piscar" de tema.
applyTheme(site.brand.theme);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App config={site} />
  </StrictMode>,
);
