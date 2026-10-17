// Acceso tipado al contenido. El contenido vive en content.json (7.5): se amplía sin tocar la interfaz.
import content from './content.json';

export type Category = keyof typeof content.impostor;
export type TruthOrDareLevel = keyof typeof content.verdadReto;
export type CardType = 'verdad' | 'reto';

export const CATEGORIES = Object.keys(content.impostor) as Category[];
export const DEFAULT_CATEGORY: Category = 'Comida';

export const impostorWords = (category: Category): readonly string[] => content.impostor[category];

export const truthOrDareDeck = (level: TruthOrDareLevel, type: CardType): readonly string[] =>
  type === 'verdad' ? content.verdadReto[level].verdades : content.verdadReto[level].retos;

export const neverHaveIPhrases: readonly string[] = content.yoNunca;
