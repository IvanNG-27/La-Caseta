// Viñeta: unidad básica de composición (glosario, 02.1).
import type { CSSProperties, ElementType, ReactNode } from 'react';
import { FocusLines } from './fx';

type Background = 'paper' | 'ink' | 'tone' | 'tone-dense' | 'speed';

const BG_CLASS: Record<Background, string> = {
  paper: '',
  ink: 'panel--inverted',
  tone: 'tone',
  'tone-dense': 'tone--dense',
  speed: 'speed-lines',
};

export interface PanelProps {
  as?: ElementType;
  background?: Background;
  /** Líneas de enfoque (4.2). En viñetas `ink` se usan las invertidas (4.2b). */
  focusLines?: boolean;
  /** Viñeta inclinada (4.9). Solo una por pantalla. */
  skew?: boolean;
  grow?: boolean;
  height?: number;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
  [key: string]: unknown;
}

export function Panel({
  as: Tag = 'section',
  background = 'paper',
  focusLines = false,
  skew = false,
  grow = false,
  height,
  className,
  style,
  children,
  ...rest
}: PanelProps) {
  const classes = ['panel', BG_CLASS[background], grow && 'grow', skew && 'skew', className].filter(Boolean).join(' ');
  const content = (
    <>
      {focusLines && <FocusLines inverted={background === 'ink'} />}
      {children}
    </>
  );
  return (
    <Tag className={classes} style={{ height, flex: height ? 'none' : undefined, ...style }} {...rest}>
      {skew ? <div className="skew__content panel__skew-content">{content}</div> : content}
    </Tag>
  );
}
