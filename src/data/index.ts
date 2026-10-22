// Acceso tipado al contenido. El contenido vive en content.json (7.5): se amplía sin tocar la interfaz.
import content from './content.json';

export type Category = keyof typeof content.impostor;
export type TruthOrDareLevel = keyof typeof content.verdadReto;
export type CardType = 'verdad' | 'reto';

export const CATEGORIES = Object.keys(content.impostor) as Category[];
export const DEFAULT_CATEGORY: Category = 'Comida';

/** Opción "Todas": cada ronda saca una palabra de cualquier categoría. */
export const ALL_CATEGORIES = 'Todas';
export type CategoryChoice = Category | typeof ALL_CATEGORIES;
export const CATEGORY_CHOICES: CategoryChoice[] = [...CATEGORIES, ALL_CATEGORIES];

/** En content.json cada categoría es { "palabra": "pista para el impostor" }. */
const impostorEntries = (category: Category): [string, string][] =>
  Object.entries(content.impostor[category] as Record<string, string>);

export const impostorWords = (category: Category): string[] => impostorEntries(category).map(([word]) => word);

/** Palabra con su categoría real y la pista sutil que recibe el impostor (no la categoría). */
export interface WordEntry {
  word: string;
  category: Category;
  hint: string;
}

export const impostorPool = (choice: CategoryChoice): WordEntry[] =>
  (choice === ALL_CATEGORIES ? CATEGORIES : [choice]).flatMap((category) =>
    impostorEntries(category).map(([word, hint]) => ({ word, category, hint })),
  );

export const truthOrDareDeck = (level: TruthOrDareLevel, type: CardType): readonly string[] =>
  type === 'verdad' ? content.verdadReto[level].verdades : content.verdadReto[level].retos;

export const neverHaveIPhrases: readonly string[] = content.yoNunca;
