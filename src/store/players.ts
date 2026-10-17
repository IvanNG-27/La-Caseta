// Jugadores y ajustes de Impostor: se guardan en el dispositivo (6.2, 7.1).
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { DEFAULT_CATEGORY, type Category } from '../data';
import { MAX_NAME_LENGTH, validateNewPlayer, type AddPlayerError, type Player } from '../games/shared/players';
import { clampImpostors } from '../games/impostor/logic';

interface PlayersState {
  players: Player[];
  impostorCount: number;
  category: Category;
  addPlayer: (name: string) => AddPlayerError | null;
  removePlayer: (id: string) => void;
  setImpostorCount: (count: number) => void;
  setCategory: (category: Category) => void;
}

const newId = () => (crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`);

export const usePlayers = create<PlayersState>()(
  persist(
    (set, get) => ({
      players: [],
      impostorCount: 1,
      category: DEFAULT_CATEGORY,
      addPlayer: (rawName) => {
        const error = validateNewPlayer(get().players, rawName);
        if (error) return error;
        const name = rawName.trim().slice(0, MAX_NAME_LENGTH);
        set((s) => ({ players: [...s.players, { id: newId(), name }] }));
        return null;
      },
      removePlayer: (id) =>
        set((s) => {
          const players = s.players.filter((p) => p.id !== id);
          return { players, impostorCount: clampImpostors(s.impostorCount, players.length) };
        }),
      setImpostorCount: (count) => set((s) => ({ impostorCount: clampImpostors(count, s.players.length) })),
      setCategory: (category) => set({ category }),
    }),
    // PROPUESTA: en nativo puede migrarse a @capacitor/preferences; localStorage persiste en el WebView.
    { name: 'app-juegos/jugadores', version: 1 },
  ),
);
