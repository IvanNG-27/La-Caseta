// 8.4 Nombres largos en titulares Dela: reducir hasta un mínimo de 32; si aún no caben, puntos suspensivos.
import { useLayoutEffect, useRef, useState, type ElementType, type ReactNode } from 'react';

interface FitTextProps {
  as?: ElementType;
  max: number;
  min?: number;
  className?: string;
  children: ReactNode;
}

export function FitText({ as: Tag = 'span', max, min = 32, className, children }: FitTextProps) {
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
    const ro = new ResizeObserver(fit);
    ro.observe(el.parentElement ?? el);
    return () => ro.disconnect();
  }, [max, min, children]);

  return (
    <Tag ref={ref} className={['fit-text', 'display', className].filter(Boolean).join(' ')} style={{ fontSize: size }}>
      {children}
    </Tag>
  );
}
