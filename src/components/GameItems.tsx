// 05 · Progreso de reparto, barra de votos, celda de marcador y tarjeta de juego.
import type { ReactNode } from 'react';
import { ArrowRight } from 'lucide-react';
import { Avatar } from './PlayerItems';
import { Icon } from './Icon';
import { useT } from '../i18n';

/** Un segmento por jugador. Hechos: tinta. Actual: rojo. Pendientes: papel. También se muestra "k/N" en la cabecera (8.2). */
export function ProgressSegments({ total, current }: { total: number; current: number }) {
  return (
    <div className="progress" aria-hidden>
      {Array.from({ length: total }, (_, i) => (
        <span
          key={i}
          className={['progress__seg', i < current && 'progress__seg--done', i === current && 'progress__seg--current']
            .filter(Boolean)
            .join(' ')}
        />
      ))}
    </div>
  );
}

export function VoteBar({ name, votes, total, top }: { name: string; votes: number; total: number; top: boolean }) {
  const t = useT();
  const pct = total > 0 ? (votes / total) * 100 : 0;
  return (
    <li className="vote-row">
      <Avatar name={name} size={28} />
      <span className="vote-row__name">{name}</span>
      <span className="vote-row__bar tone--fine" aria-hidden>
        <span className={top ? 'vote-row__fill vote-row__fill--top' : 'vote-row__fill'} style={{ width: `${pct}%` }} />
      </span>
      <span className="vote-row__count">{t.common.votes(votes)}</span>
    </li>
  );
}

export function ScoreCell({ name, roundPoints, total }: { name: string; roundPoints: number; total: number }) {
  const t = useT();
  return (
    <li className="score-cell">
      <span className="score-cell__text">
        <span className="score-cell__name">{name}</span>
        {roundPoints > 0 ? (
          <span className="score-cell__tag">{t.results.thisRound(roundPoints)}</span>
        ) : (
          <span className="score-cell__none">{t.results.noPoints}</span>
        )}
      </span>
      <span className="score-cell__total display">{total}</span>
    </li>
  );
}

interface GameCardProps {
  tag: string;
  title: ReactNode;
  description: string;
  illustration: ReactNode;
  layout: 'row' | 'column';
  titleSize: number;
  onClick: () => void;
  skew?: boolean;
  className?: string;
}

/** Viñeta enlace: toda la tarjeta es pulsable. */
export function GameCard({ tag, title, description, illustration, layout, titleSize, onClick, skew, className }: GameCardProps) {
  const body = (
    <>
      <span className="game-card__text">
        <span className="game-card__tag">{tag}</span>
        <span className="game-card__title display" style={{ fontSize: titleSize }}>
          {title}
        </span>
        <span className="game-card__desc">{description}</span>
      </span>
      <span className="game-card__art" aria-hidden>
        {illustration}
      </span>
      <span className="game-card__arrow" aria-hidden>
        <Icon icon={ArrowRight} size={20} stroke={3} />
      </span>
    </>
  );
  return (
    <button
      type="button"
      className={['panel', 'game-card', `game-card--${layout}`, 'pressable', 'pressable--large', skew && 'skew', className]
        .filter(Boolean)
        .join(' ')}
      onClick={onClick}
    >
      {skew ? <span className="skew__content game-card__inner">{body}</span> : body}
    </button>
  );
}

export function IconCircle({ children, size = 70 }: { children: ReactNode; size?: number }) {
  return (
    <span className="icon-circle" style={{ width: size, height: size }}>
      {children}
    </span>
  );
}
