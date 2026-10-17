// 05 · Cabecera: viñeta de fondo tinta, 58–60 de alto.
import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';
import { IconButton } from './Buttons';

interface HeaderProps {
  title: ReactNode;
  subtitle?: ReactNode;
  /** 16 en partidas e Inicio; 20 en Jugadores y Resultados. */
  titleSize?: 16 | 20;
  /** h1 cuando la cabecera es el título principal de la pantalla (8.1). */
  titleAs?: 'h1' | 'p';
  height?: 58 | 60;
  action?: { icon: LucideIcon; label: string; onClick: () => void };
  /** Indicador ("2/4", "RONDA 1", "FRASE 3"), sello u otro control. */
  right?: ReactNode;
}

export function Header({ title, subtitle, titleSize = 16, titleAs: Title = 'p', height = 58, action, right }: HeaderProps) {
  return (
    <header className="header" style={{ height }}>
      {action && <IconButton variant="header" icon={action.icon} label={action.label} onClick={action.onClick} />}
      <div className="header__titles">
        <Title className="display header__title" style={{ fontSize: titleSize }}>
          {title}
        </Title>
        {subtitle && <p className="header__subtitle">{subtitle}</p>}
      </div>
      {right}
    </header>
  );
}

export function HeaderIndicator({ children, label }: { children: ReactNode; label?: string }) {
  return (
    <span className="header__indicator display" aria-label={label}>
      {children}
    </span>
  );
}
