// 05 · Avatar, fila de jugador y selector de jugador.
import { Check, X } from 'lucide-react';
import { initialOf, type Player } from '../games/shared/players';
import { IconButton } from './Buttons';
import { Icon } from './Icon';
import { useT } from '../i18n';
import { FitText } from './FitText';

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
  const t = useT();
  return (
    <li className="player-row">
      <Avatar name={player.name} size={40} />
      <span className="player-row__name">{player.name}</span>
      <IconButton variant="bare" icon={X} label={t.players.remove(player.name)} onClick={onRemove} />
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
  /** Puntos bajo el nombre (Yo nunca). Sin valor, no se muestran. */
  points?: number;
  selected: boolean;
  onToggle: () => void;
}) {
  const t = useT();
  return (
    <button
      type="button"
      aria-pressed={selected}
      className={['player-toggle', 'pressable', selected && 'player-toggle--selected'].filter(Boolean).join(' ')}
      onClick={onToggle}
    >
      <Avatar name={player.name} size={34} selected={selected} />
      <span className="player-toggle__text">
        {/* 8.4 / 09: nombres de hasta 12 caracteres sin cortarse en la rejilla de 2 columnas */}
        <FitText max={16} min={11} display={false} className="player-toggle__name">
          {player.name}
        </FitText>
        {points !== undefined && <span className="player-toggle__points">{t.common.points(points)}</span>}
      </span>
    </button>
  );
}
