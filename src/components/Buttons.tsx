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
  /** Versión corta del texto, para cuando el completo no cabe ni bajando 2 px (8.4: "o se acorta"). */
  shortLabel?: string;
  children: ReactNode;
}

const fits = (el: HTMLElement) => el.scrollWidth <= el.clientWidth;

/** 8.4: intenta el texto a su tamaño y, si no cabe, 2 px más pequeño. */
function tryFit(el: HTMLElement): boolean {
  el.hidden = false;
  el.style.fontSize = '';
  if (fits(el)) return true;
  el.style.fontSize = `${parseFloat(getComputedStyle(el).fontSize) - 2}px`;
  return fits(el);
}

/** Uno principal por pantalla como máximo. Texto siempre en mayúsculas y en una sola línea (8.4). */
export function Button({
  variant = 'primary',
  arrow,
  iconStart,
  flex,
  shortLabel,
  className,
  children,
  style,
  ref: externalRef,
  ...rest
}: ButtonProps) {
  const ref = useRef<HTMLButtonElement | null>(null);
  // Referencia propia (para medir) + la que llegue de fuera (p. ej. foco del diálogo de salida)
  const setRefs = (node: HTMLButtonElement | null) => {
    ref.current = node;
    if (typeof externalRef === 'function') externalRef(node);
    else if (externalRef) (externalRef as { current: HTMLButtonElement | null }).current = node;
  };
  const fullRef = useRef<HTMLSpanElement>(null);
  const shortRef = useRef<HTMLSpanElement>(null);

  // 8.4: texto completo → 2 px menos → versión corta → 2 px menos → puntos suspensivos.
  useLayoutEffect(() => {
    const full = fullRef.current;
    if (!full) return;
    const fit = () => {
      const short = shortRef.current;
      if (short) short.hidden = true;
      if (tryFit(full) || !short) return;
      full.hidden = true;
      tryFit(short);
    };
    fit();
    const ro = new ResizeObserver(fit);
    if (ref.current) ro.observe(ref.current);
    return () => ro.disconnect();
  }, [children, shortLabel]);

  return (
    <button
      ref={setRefs}
      type="button"
      className={['btn', `btn--${variant}`, 'pressable', className].filter(Boolean).join(' ')}
      style={{ flex, ...style }}
      // Con texto corto visible, el nombre accesible sigue siendo el completo.
      aria-label={shortLabel && typeof children === 'string' ? children : undefined}
      {...rest}
    >
      {iconStart && <Icon icon={iconStart} size={20} />}
      <span ref={fullRef} className="btn__label">
        {children}
      </span>
      {shortLabel && (
        <span ref={shortRef} className="btn__label" hidden>
          {shortLabel}
        </span>
      )}
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
