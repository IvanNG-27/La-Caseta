// Ajustes de la app: se guardan en el dispositivo.
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Language = 'es' | 'and' | 'va';
export type Theme = 'light' | 'dark';

// PROPUESTA (7.2.3): duración del debate de 3, 5 o 7 minutos.
export const DEBATE_MINUTES_OPTIONS = [3, 5, 7] as const;
export type DebateMinutes = (typeof DEBATE_MINUTES_OPTIONS)[number];

interface SettingsState {
  debateMinutes: DebateMinutes;
  language: Language;
  theme: Theme;
  setDebateMinutes: (minutes: DebateMinutes) => void;
  setLanguage: (language: Language) => void;
  setTheme: (theme: Theme) => void;
}

export const useSettings = create<SettingsState>()(
  persist(
    (set) => ({
      debateMinutes: 5,
      language: 'es',
      theme: 'light',
      setDebateMinutes: (debateMinutes) => set({ debateMinutes }),
      setLanguage: (language) => set({ language }),
      setTheme: (theme) => set({ theme }),
    }),
    { name: 'app-juegos/ajustes', version: 1 },
  ),
);

/** Aplica el tema al documento (tokens de color en styles/tokens.css). */
export function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
}

// Etiqueta de idioma del documento, para que los lectores de pantalla pronuncien bien.
const HTML_LANG: Record<Language, string> = { es: 'es-ES', and: 'es-ES', va: 'ca-ES-valencia' };

export function applyLanguage(language: Language) {
  document.documentElement.lang = HTML_LANG[language];
}
