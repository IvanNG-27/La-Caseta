export type Rng = () => number;

export function shuffle<T>(items: readonly T[], rng: Rng = Math.random): T[] {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

export function pickOne<T>(items: readonly T[], rng: Rng = Math.random): T {
  return items[Math.floor(rng() * items.length)];
}

/**
 * Mazo sin repetición: se reparte en orden aleatorio y, al agotarse, se baraja de nuevo.
 * `position` es la carta k (1-based) dentro del mazo actual → "Carta k/N".
 */
export interface Deck {
  order: number[];
  position: number;
}

export const createDeck = (size: number, rng: Rng = Math.random): Deck => ({
  order: shuffle(
    Array.from({ length: size }, (_, i) => i),
    rng,
  ),
  position: 0,
});

export function drawCard(deck: Deck, rng: Rng = Math.random): { index: number; deck: Deck } {
  const current = deck.position >= deck.order.length ? createDeck(deck.order.length, rng) : deck;
  return {
    index: current.order[current.position],
    deck: { ...current, position: current.position + 1 },
  };
}
