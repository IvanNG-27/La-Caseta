// 7.1 Jugadores: lista común a los tres juegos; el orden de alta es el orden de los turnos.
export interface Player {
  id: string;
  name: string;
}

export const MAX_PLAYERS = 12; // PROPUESTA
export const MAX_NAME_LENGTH = 16; // PROPUESTA

export type GameId = 'impostor' | 'verdad-o-reto' | 'yo-nunca';

export const MIN_PLAYERS: Record<GameId, number> = {
  impostor: 3,
  'verdad-o-reto': 2,
  'yo-nunca': 3,
};

export const GAME_PATH: Record<GameId, string> = {
  impostor: '/impostor',
  'verdad-o-reto': '/verdad-o-reto',
  'yo-nunca': '/yo-nunca',
};

/** El avatar es la inicial del nombre en mayúscula. */
export const initialOf = (name: string): string => name.trim().charAt(0).toLocaleUpperCase('es-ES');

export type AddPlayerError = 'empty' | 'duplicate' | 'full';

export function validateNewPlayer(players: readonly Player[], rawName: string): AddPlayerError | null {
  const name = rawName.trim();
  if (!name) return 'empty';
  if (players.length >= MAX_PLAYERS) return 'full';
  const key = name.toLocaleLowerCase('es-ES');
  if (players.some((p) => p.name.toLocaleLowerCase('es-ES') === key)) return 'duplicate';
  return null;
}
