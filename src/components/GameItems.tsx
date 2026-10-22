// 05 · Progreso de reparto, celda de marcador y tarjeta de juego.
import type { ReactNode } from 'react';
import { ArrowRight } from 'lucide-react';
import { Icon } from './Icon';
import { FitText } from './FitText';
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

export function ScoreCell({ name, roundPoints, total }: { name: string; roundPoints: number; total: number }) {
  const t = useT();
  return (
    <li className="score-cell">
      <span className="score-cell__text">
        <FitText max={15} min={11} display={false} className="score-cell__name">
          {name}
        </FitText>
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
        {/* 8.4: si el título no cabe en su columna, la letra se reduce en vez de invadir la ilustración. */}
        <FitText max={titleSize} min={20} className="game-card__title">
          {title}
        </FitText>
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
