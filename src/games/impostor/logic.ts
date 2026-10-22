// 7.2 Impostor — lógica pura (sin interfaz), testeable.
import { pickOne, shuffle, type Rng } from '../shared/random';
import type { Player } from '../shared/players';

/** Stepper de impostores: mínimo 1, máximo ⌊(jugadores − 1) ÷ 2⌋. */
export const maxImpostors = (playerCount: number): number => Math.max(1, Math.floor((playerCount - 1) / 2));

export const clampImpostors = (requested: number, playerCount: number): number =>
  Math.min(Math.max(1, requested), maxImpostors(playerCount));

export interface RoundSetup<C extends string = string> {
  word: string;
  /** Categoría real de la palabra: es la pista del impostor (con "Todas" varía en cada ronda). */
  wordCategory: C;
  impostorIds: string[];
  starterId: string;
  /** Palabras ya usadas en la sesión, incluida la de esta ronda. */
  usedWords: string[];
}

/** 7.2.1 Preparar la ronda: palabra al azar (sin repetir en la sesión), impostores y quién empieza el debate. */
export function prepareRound<C extends string>(params: {
  players: readonly Player[];
  impostorCount: number;
  /** Palabras posibles con su categoría (una categoría, o todas). */
  pool: readonly { word: string; category: C }[];
  usedWords: readonly string[];
  rng?: Rng;
}): RoundSetup<C> {
  const { players, pool, rng = Math.random } = params;
  let available = pool.filter((e) => !params.usedWords.includes(e.word));
  let usedWords = [...params.usedWords];
  // Si se agotan las palabras posibles, se vuelve a empezar con todas.
  if (available.length === 0) {
    available = [...pool];
    usedWords = usedWords.filter((w) => !pool.some((e) => e.word === w));
  }
  const { word, category } = pickOne(available, rng);
  const count = clampImpostors(params.impostorCount, players.length);
  const impostorIds = shuffle(players, rng)
    .slice(0, count)
    .map((p) => p.id);
  const starterId = pickOne(players, rng).id;
  return { word, wordCategory: category, impostorIds, starterId, usedWords: [...usedWords, word] };
}

export interface RoundResult {
  /** Jugador al que el grupo ha acusado tras hablarlo. */
  accusedId: string;
  caught: boolean;
  /** Puntos ganados en esta ronda por jugador (solo los que suman). */
  points: Record<string, number>;
}

/**
 * 7.2.5 Resultado. La votación es una reunión hablada: el grupo acusa a un solo jugador.
 * Pillado si el acusado es impostor → +1 a cada inocente. Si no → +2 a cada impostor (PROPUESTA).
 */
export function resolveAccusation(
  players: readonly Player[],
  impostorIds: readonly string[],
  accusedId: string,
): RoundResult {
  const caught = impostorIds.includes(accusedId);
  const points: Record<string, number> = {};
  if (caught) {
    for (const p of players) if (!impostorIds.includes(p.id)) points[p.id] = 1;
  } else {
    for (const id of impostorIds) points[id] = 2;
  }
  return { accusedId, caught, points };
}
