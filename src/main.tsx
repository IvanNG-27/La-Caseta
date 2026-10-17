import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

// Fuentes incluidas en la app (funcionan sin conexión) — 3.2
import '@fontsource/dela-gothic-one/400.css';
import '@fontsource/zen-kaku-gothic-new/500.css';
import '@fontsource/zen-kaku-gothic-new/700.css';
import '@fontsource/zen-kaku-gothic-new/900.css';

// Orden de la especificación: tokens (03) → efectos (04) → componentes (05)
import './styles/tokens.css';
import './styles/base.css';
import './styles/effects.css';
import './styles/components.css';

import { App } from './App';
import { applyLanguage, applyTheme, useSettings } from './store/settings';

// Tema e idioma guardados: se aplican antes de pintar para que no parpadee, y después en cada cambio.
const applySettings = ({ theme, language }: ReturnType<typeof useSettings.getState>) => {
  applyTheme(theme);
  applyLanguage(language);
};
applySettings(useSettings.getState());
useSettings.subscribe(applySettings);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
