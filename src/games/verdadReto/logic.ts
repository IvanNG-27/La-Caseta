// 7.3 Verdad o reto — lógica pura.
import { createDeck, drawCard, type Deck, type Rng } from '../shared/random';
import { truthOrDareDeck, type CardType, type TruthOrDareLevel } from '../../data';

export interface TruthOrDareState {
  level: TruthOrDareLevel;
  turn: number;
  phase: 'choose' | 'card';
  decks: Record<CardType, Deck>;
  card: { type: CardType; text: string; position: number; total: number } | null;
}

export function initTruthOrDare(level: TruthOrDareLevel = 'suave', rng: Rng = Math.random): TruthOrDareState {
  return {
    level,
    turn: 0,
    phase: 'choose',
    decks: {
      verdad: createDeck(truthOrDareDeck(level, 'verdad').length, rng),
      reto: createDeck(truthOrDareDeck(level, 'reto').length, rng),
    },
    card: null,
  };
}

/** Elegir verdad o reto, o "OTRA CARTA" (mismo mazo, mismo jugador). */
export function draw(state: TruthOrDareState, type: CardType, rng: Rng = Math.random): TruthOrDareState {
  const cards = truthOrDareDeck(state.level, type);
  const { index, deck } = drawCard(state.decks[type], rng);
  return {
    ...state,
    phase: 'card',
    decks: { ...state.decks, [type]: deck },
    card: { type, text: cards[index], position: deck.position, total: cards.length },
  };
}

/** "¡HECHO!": siguiente jugador, de vuelta a "Elegir". */
export const nextTurn = (state: TruthOrDareState, playerCount: number): TruthOrDareState => ({
  ...state,
  turn: (state.turn + 1) % playerCount,
  phase: 'choose',
  card: null,
});
