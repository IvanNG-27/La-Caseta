// 7.4 Yo nunca — lógica pura.
import { createDeck, drawCard, type Deck, type Rng } from '../shared/random';
import { neverHaveIPhrases } from '../../data';

export interface NeverHaveIState {
  deck: Deck;
  phrase: string;
  /** "FRASE N": frases jugadas (1-based). */
  number: number;
  selected: string[];
  scores: Record<string, number>;
}

export function initNeverHaveI(rng: Rng = Math.random): NeverHaveIState {
  const { index, deck } = drawCard(createDeck(neverHaveIPhrases.length, rng), rng);
  return { deck, phrase: neverHaveIPhrases[index], number: 1, selected: [], scores: {} };
}

export const toggleSelected = (state: NeverHaveIState, playerId: string): NeverHaveIState => ({
  ...state,
  selected: state.selected.includes(playerId)
    ? state.selected.filter((id) => id !== playerId)
    : [...state.selected, playerId],
});

/** "SIGUIENTE FRASE": +1 a cada marcado, se limpia la selección y se pasa a la siguiente frase. */
export function nextPhrase(state: NeverHaveIState, rng: Rng = Math.random): NeverHaveIState {
  const scores = { ...state.scores };
  for (const id of state.selected) scores[id] = (scores[id] ?? 0) + 1;
  // Sin repetir dentro de la sesión; si se agotan, se baraja de nuevo (hasta tener más contenido).
  const { index, deck } = drawCard(state.deck, rng);
  return { deck, phrase: neverHaveIPhrases[index], number: state.number + 1, selected: [], scores };
}
