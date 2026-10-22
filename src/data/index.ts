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

export const impostorWords = (category: Category): readonly string[] => content.impostor[category];

/** Palabra con su categoría real (con "Todas", la pista del impostor es la categoría de la palabra). */
export interface WordEntry {
  word: string;
  category: Category;
}

export const impostorPool = (choice: CategoryChoice): WordEntry[] =>
  (choice === ALL_CATEGORIES ? CATEGORIES : [choice]).flatMap((category) =>
    impostorWords(category).map((word) => ({ word, category })),
  );

export const truthOrDareDeck = (level: TruthOrDareLevel, type: CardType): readonly string[] =>
  type === 'verdad' ? content.verdadReto[level].verdades : content.verdadReto[level].retos;

export const neverHaveIPhrases: readonly string[] = content.yoNunca;
