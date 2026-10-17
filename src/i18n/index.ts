import { useSettings, type Language } from '../store/settings';
import { es, type Dict } from './es';
import { and } from './and';
import { va } from './va';

const DICTS: Record<Language, Dict> = { es, and, va };

/** Textos de la interfaz en el idioma elegido en Ajustes. */
export const useT = (): Dict => DICTS[useSettings((s) => s.language)];

export type { Dict };
