// 05 · Botón principal, oscuro, secundario, deshabilitado y botón icono.
import { useLayoutEffect, useRef, type ButtonHTMLAttributes, type ReactNode, type Ref } from 'react';
import { ArrowRight, type LucideIcon } from 'lucide-react';
import { Icon } from './Icon';

type Variant = 'primary' | 'dark' | 'secondary';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  ref?: Ref<HTMLButtonElement>;
  variant?: Variant;
  /** Icono arrow-right a la derecha (22, separado 10). */
  arrow?: boolean;
  /** Icono a la izquierda (p. ej. rotate-ccw en "OTRA CARTA"). */
  iconStart?: LucideIcon;
  /** Reparto en fila: 1 = toda la fila, 1/3, 2/3, 1/2… */
  flex?: number;
  children: ReactNode;
}

/** Uno principal por pantalla como máximo. Texto siempre en mayúsculas y en una sola línea (8.4). */
export function Button({ variant = 'primary', arrow, iconStart, flex, className, children, style, ...rest }: ButtonProps) {
  const labelRef = useRef<HTMLSpanElement>(null);

  // 8.4: si el texto no cabe, baja 2 px; si aún no cabe, se acorta con puntos suspensivos.
  useLayoutEffect(() => {
    const el = labelRef.current;
    if (!el) return;
    el.style.fontSize = '';
    if (el.scrollWidth > el.clientWidth) {
      el.style.fontSize = `${parseFloat(getComputedStyle(el).fontSize) - 2}px`;
    }
  }, [children]);

  return (
    <button
      type="button"
      className={['btn', `btn--${variant}`, 'pressable', className].filter(Boolean).join(' ')}
      style={{ flex, ...style }}
      {...rest}
    >
      {iconStart && <Icon icon={iconStart} size={20} />}
      <span ref={labelRef} className="btn__label">
        {children}
      </span>
      {arrow && <Icon icon={ArrowRight} size={22} />}
    </button>
  );
}

/** Borde discontinuo y texto que explica por qué. No responde al toque. */
export function DisabledButton({ children }: { children: ReactNode }) {
  return (
    <button type="button" className="btn btn--disabled" disabled aria-disabled>
      {children}
    </button>
  );
}

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: LucideIcon;
  /** Nombre accesible obligatorio (8.1). */
  label: string;
  variant?: 'default' | 'header' | 'bare';
  iconSize?: number;
}

export function IconButton({ icon, label, variant = 'default', iconSize = 20, className, ...rest }: IconButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      className={['icon-btn', `icon-btn--${variant}`, 'pressable', className].filter(Boolean).join(' ')}
      {...rest}
    >
      <Icon icon={icon} size={iconSize} />
    </button>
  );
}
