// 8.4 Nombres largos en titulares Dela: reducir hasta un mínimo de 32; si aún no caben, puntos suspensivos.
import { useLayoutEffect, useRef, useState, type ElementType, type ReactNode } from 'react';

interface FitTextProps {
  as?: ElementType;
  max: number;
  min?: number;
  /** Dela Gothic One en mayúsculas (titulares). false = conserva la fuente del contexto. */
  display?: boolean;
  className?: string;
  children: ReactNode;
}

export function FitText({ as: Tag = 'span', max, min = 32, display = true, className, children }: FitTextProps) {
  const ref = useRef<HTMLElement>(null);
  const [size, setSize] = useState(max);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const fit = () => {
      let s = max;
      el.style.fontSize = `${s}px`;
      while (s > min && el.scrollWidth > el.clientWidth) {
        s -= 2;
        el.style.fontSize = `${s}px`;
      }
      setSize(Math.max(s, min));
    };
    fit();
    // Recalcular cuando llegan las fuentes: medir con la fuente de reserva daría otro ancho.
    let active = true;
    document.fonts?.ready.then(() => active && fit());
    const ro = new ResizeObserver(fit);
    ro.observe(el.parentElement ?? el);
    return () => {
      active = false;
      ro.disconnect();
    };
  }, [max, min, children]);

  return (
    <Tag
      ref={ref}
      className={['fit-text', display && 'display', className].filter(Boolean).join(' ')}
      style={{ fontSize: size }}
    >
      {children}
    </Tag>
  );
}
