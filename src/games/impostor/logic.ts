// 7.2 Impostor — lógica pura (sin interfaz), testeable.
import { pickOne, shuffle, type Rng } from '../shared/random';
import type { Player } from '../shared/players';

/** Stepper de impostores: mínimo 1, máximo ⌊(jugadores − 1) ÷ 2⌋. */
export const maxImpostors = (playerCount: number): number => Math.max(1, Math.floor((playerCount - 1) / 2));

export const clampImpostors = (requested: number, playerCount: number): number =>
  Math.min(Math.max(1, requested), maxImpostors(playerCount));

export interface RoundSetup {
  word: string;
  impostorIds: string[];
  starterId: string;
  /** Palabras ya usadas en la sesión, incluida la de esta ronda. */
  usedWords: string[];
}

/** 7.2.1 Preparar la ronda: palabra al azar (sin repetir en la sesión), impostores y quién empieza el debate. */
export function prepareRound(params: {
  players: readonly Player[];
  impostorCount: number;
  words: readonly string[];
  usedWords: readonly string[];
  rng?: Rng;
}): RoundSetup {
  const { players, words, rng = Math.random } = params;
  let available = words.filter((w) => !params.usedWords.includes(w));
  let usedWords = [...params.usedWords];
  // Si la categoría se agota, se vuelve a empezar con todas sus palabras.
  if (available.length === 0) {
    available = [...words];
    usedWords = usedWords.filter((w) => !words.includes(w));
  }
  const word = pickOne(available, rng);
  const count = clampImpostors(params.impostorCount, players.length);
  const impostorIds = shuffle(players, rng)
    .slice(0, count)
    .map((p) => p.id);
  const starterId = pickOne(players, rng).id;
  return { word, impostorIds, starterId, usedWords: [...usedWords, word] };
}

/** Votos: id de quien vota → id del votado. */
export type Votes = Record<string, string>;

export function tallyVotes(players: readonly Player[], votes: Votes): { playerId: string; votes: number }[] {
  const counts = new Map(players.map((p) => [p.id, 0]));
  for (const target of Object.values(votes)) {
    if (counts.has(target)) counts.set(target, (counts.get(target) ?? 0) + 1);
  }
  // Ordenadas de más a menos votos; a igualdad, se respeta el orden de la lista.
  return players
    .map((p) => ({ playerId: p.id, votes: counts.get(p.id) ?? 0 }))
    .sort((a, b) => b.votes - a.votes);
}

/** El más votado, o null si no hay votos o hay empate en cabeza (PROPUESTA: empate = no pillado). */
export function mostVoted(tally: readonly { playerId: string; votes: number }[]): string | null {
  if (tally.length === 0 || tally[0].votes === 0) return null;
  if (tally.length > 1 && tally[1].votes === tally[0].votes) return null;
  return tally[0].playerId;
}

export interface RoundResult {
  tally: { playerId: string; votes: number }[];
  caught: boolean;
  /** Puntos ganados en esta ronda por jugador (solo los que suman). */
  points: Record<string, number>;
}

/**
 * 7.2.5 Resultado. Pillado si el más votado es impostor.
 * +1 a cada no impostor que votó a un impostor. PROPUESTA: +2 a cada impostor si no lo pillan.
 */
export function resolveRound(players: readonly Player[], impostorIds: readonly string[], votes: Votes): RoundResult {
  const tally = tallyVotes(players, votes);
  const top = mostVoted(tally);
  const caught = top !== null && impostorIds.includes(top);
  const points: Record<string, number> = {};
  for (const [voterId, targetId] of Object.entries(votes)) {
    if (!impostorIds.includes(voterId) && impostorIds.includes(targetId)) {
      points[voterId] = (points[voterId] ?? 0) + 1;
    }
  }
  if (!caught) {
    for (const id of impostorIds) points[id] = (points[id] ?? 0) + 2;
  }
  return { tally, caught, points };
}
