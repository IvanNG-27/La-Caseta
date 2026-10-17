// Partida de Impostor en curso (en memoria; se pierde al salir de la partida).
import { create } from 'zustand';
import { impostorWords, type Category } from '../data';
import { prepareRound, resolveAccusation, type RoundResult } from '../games/impostor/logic';
import type { Player } from '../games/shared/players';

/** Estados de 6.3: A · Tapada, B/C · Revelado (palabra o impostor), D · Debate. */
export type ImpostorPhase = 'hidden' | 'revealed' | 'debate' | 'voting' | 'results';

interface ImpostorState {
  active: boolean;
  players: Player[];
  category: Category;
  impostorCount: number;
  round: number;
  word: string;
  impostorIds: string[];
  starterId: string;
  usedWords: string[];
  turn: number;
  phase: ImpostorPhase;
  result: RoundResult | null;
  /** Marcador acumulado de la sesión. */
  scores: Record<string, number>;

  startGame: (players: Player[], impostorCount: number, category: Category) => void;
  reveal: () => void;
  hideAndPass: () => void;
  goToVoting: () => void;
  /** Votación hablada: el grupo acusa a un jugador. */
  accuse: (accusedId: string) => void;
  nextRound: () => void;
  exit: () => void;
}

const initial = {
  active: false,
  players: [] as Player[],
  category: 'Comida' as Category,
  impostorCount: 1,
  round: 0,
  word: '',
  impostorIds: [] as string[],
  starterId: '',
  usedWords: [] as string[],
  turn: 0,
  phase: 'hidden' as ImpostorPhase,
  result: null,
  scores: {} as Record<string, number>,
};

export const useImpostor = create<ImpostorState>()((set, get) => {
  const newRound = (round: number) => {
    const { players, impostorCount, category, usedWords } = get();
    const setup = prepareRound({ players, impostorCount, words: impostorWords(category), usedWords });
    set({ ...setup, round, turn: 0, phase: 'hidden', result: null });
  };

  return {
    ...initial,
    startGame: (players, impostorCount, category) => {
      set({ ...initial, active: true, players, impostorCount, category });
      newRound(1);
    },
    // A → B o C (cambio instantáneo, 3.5)
    reveal: () => set({ phase: 'revealed' }),
    // B/C → A (i + 1), o D tras el último
    hideAndPass: () => {
      const { turn, players } = get();
      if (turn + 1 >= players.length) set({ phase: 'debate' });
      else set({ turn: turn + 1, phase: 'hidden' });
    },
    goToVoting: () => set({ phase: 'voting' }),
    accuse: (accusedId) => {
      const { players, impostorIds, scores } = get();
      const result = resolveAccusation(players, impostorIds, accusedId);
      const nextScores = { ...scores };
      for (const [id, pts] of Object.entries(result.points)) nextScores[id] = (nextScores[id] ?? 0) + pts;
      set({ result, scores: nextScores, phase: 'results' });
    },
    // "OTRA RONDA": mismos jugadores, ajustes y marcador; la ronda sube en 1.
    nextRound: () => newRound(get().round + 1),
    exit: () => set(initial),
  };
});
