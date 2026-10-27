// 7.4 Yo nunca — lógica pura.
import { createDeck, drawCard, type Deck, type Rng } from '../shared/random';
import { neverHaveIPhrases, type NeverHaveIPhrase } from '../../data';

export interface NeverHaveIState {
  /** Frases con las que se juega esta partida (con o sin las súper explícitas). */
  pool: readonly NeverHaveIPhrase[];
  deck: Deck;
  phrase: NeverHaveIPhrase;
  /** "FRASE N": frases jugadas (1-based). */
  number: number;
  selected: string[];
  scores: Record<string, number>;
}

/** Frases de la partida: todas, o todas menos el mazo de súper explícitas. */
export const neverHaveIPool = (includeExplicit: boolean): readonly NeverHaveIPhrase[] =>
  includeExplicit ? neverHaveIPhrases : neverHaveIPhrases.filter((p) => p.type !== 'explicita');

export function initNeverHaveI(includeExplicit = true, rng: Rng = Math.random): NeverHaveIState {
  const pool = neverHaveIPool(includeExplicit);
  const { index, deck } = drawCard(createDeck(pool.length, rng), rng);
  return { pool, deck, phrase: pool[index], number: 1, selected: [], scores: {} };
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
  // Sin repetir dentro de la sesión; si se agotan, se baraja de nuevo.
  const { index, deck } = drawCard(state.deck, rng);
  return { ...state, deck, phrase: state.pool[index], number: state.number + 1, selected: [], scores };
}
