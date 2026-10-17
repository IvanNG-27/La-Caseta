// 05 · Avatar, fila de jugador y selector de jugador.
import { Check, X } from 'lucide-react';
import { initialOf, type Player } from '../games/shared/players';
import { IconButton } from './Buttons';
import { Icon } from './Icon';

/** Cuadrado 40 (listas), 34 (selector), 28 (votos), 60 (resultados). Inicial en Dela, blanca sobre tinta. */
export function Avatar({ name, size, selected = false }: { name: string; size: 28 | 34 | 40 | 60; selected?: boolean }) {
  return (
    <span
      aria-hidden
      className={['avatar', 'display', selected && 'avatar--selected'].filter(Boolean).join(' ')}
      style={{ width: size, height: size, fontSize: Math.round(size * 0.45) }}
    >
      {selected ? <Icon icon={Check} size={Math.round(size * 0.5)} /> : initialOf(name)}
    </span>
  );
}

export function PlayerRow({ player, onRemove }: { player: Player; onRemove: () => void }) {
  return (
    <li className="player-row">
      <Avatar name={player.name} size={40} />
      <span className="player-row__name">{player.name}</span>
      <IconButton variant="bare" icon={X} label={`Quitar a ${player.name}`} onClick={onRemove} />
    </li>
  );
}

export function PlayerToggle({
  player,
  points,
  selected,
  onToggle,
}: {
  player: Player;
  points: number;
  selected: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      className={['player-toggle', 'pressable', selected && 'player-toggle--selected'].filter(Boolean).join(' ')}
      onClick={onToggle}
    >
      <Avatar name={player.name} size={34} selected={selected} />
      <span className="player-toggle__text">
        <span className="player-toggle__name">{player.name}</span>
        <span className="player-toggle__points">{points === 1 ? '1 punto' : `${points} puntos`}</span>
      </span>
    </button>
  );
}
