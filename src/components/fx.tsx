// Sección 04 como componentes. Toda la decoración va con aria-hidden (8.1).
import type { CSSProperties, ReactNode } from 'react';

const cx = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(' ');

/** 4.2 / 4.2b Líneas de enfoque: capa recortada por la viñeta contenedora (.panel). */
export function FocusLines({ inverted = false }: { inverted?: boolean }) {
  return <span aria-hidden className={cx('fx fx-focus', inverted && 'fx-focus--inverted')} />;
}

/** 4.4 Estallido. Tamaños usados: 310×150 (Inicio), 280×170 (Tapada), 300×140 (Debate). */
export function Burst({
  width,
  height,
  children,
  className,
}: {
  width: number;
  height: number;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cx('burst', className)} style={{ width, height }}>
      <div className="burst__text">{children}</div>
    </div>
  );
}

/** 4.5 Bocadillo de diálogo. `tailX` = posición horizontal de la cola (px o %). */
export function Bubble({
  children,
  tail,
  tailX,
  ellipse = false,
  className,
  style,
}: {
  children: ReactNode;
  tail: 'up' | 'down';
  tailX?: string;
  ellipse?: boolean;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <div
      className={cx('bubble', `bubble--tail-${tail}`, ellipse && 'bubble--ellipse', className)}
      style={{ ...style, ...(tailX ? ({ '--tail-x': tailX } as CSSProperties) : null) }}
    >
      {children}
    </div>
  );
}

/** 4.6 Caja de narración, pegada a la esquina superior izquierda de la viñeta. */
export function Caption({ children, className }: { children: ReactNode; className?: string }) {
  return <p className={cx('caption', className)}>{children}</p>;
}

type SfxTone = 'paper' | 'red' | 'ink' | 'red-on-ink';

const SFX_COLORS: Record<SfxTone, { fill: string; stroke: string }> = {
  paper: { fill: 'var(--paper)', stroke: 'var(--ink)' },
  red: { fill: 'var(--accent)', stroke: 'var(--ink)' },
  ink: { fill: 'var(--ink)', stroke: 'var(--paper)' },
  'red-on-ink': { fill: 'var(--accent)', stroke: 'var(--paper)' },
};

/** 4.7 Onomatopeya. Decoración pura: siempre en una esquina y oculta a lectores de pantalla. */
export function Sfx({
  text,
  size,
  tone = 'paper',
  rotate = 0,
  vertical = false,
  style,
}: {
  text: string;
  size: number;
  tone?: SfxTone;
  rotate?: number;
  vertical?: boolean;
  style?: CSSProperties;
}) {
  const { fill, stroke } = SFX_COLORS[tone];
  return (
    <span
      aria-hidden
      className={cx('sfx', vertical && 'sfx--vertical')}
      style={
        {
          fontSize: size,
          '--sfx-fill': fill,
          '--sfx-stroke': stroke,
          '--sfx-rotate': `${rotate}deg`,
          ...style,
        } as CSSProperties
      }
    >
      {text}
    </span>
  );
}

/** 4.8 Sello: etiqueta corta girada entre −8° y +8°. */
export function Stamp({
  children,
  variant = 'red',
  rotate = 0,
  size = 13,
  onInk = false,
  border = 2,
  className,
  style,
}: {
  children: ReactNode;
  variant?: 'red' | 'outline';
  rotate?: number;
  size?: number;
  /** Variante roja sobre fondo negro → borde papel. */
  onInk?: boolean;
  border?: 2 | 3;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <span
      className={cx('stamp', `stamp--${variant}`, className)}
      style={
        {
          fontSize: size,
          '--stamp-rotate': `${rotate}deg`,
          '--stamp-border': `${border}px`,
          '--stamp-border-color': onInk ? 'var(--paper)' : 'var(--ink)',
          ...style,
        } as CSSProperties
      }
    >
      {children}
    </span>
  );
}
