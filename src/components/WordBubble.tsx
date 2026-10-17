// Bocadillo elíptico de la palabra secreta (6.3 · B, 4.5).
// En vez de un relleno fijo, mide la palabra con la fuente real y calcula letra, líneas y elipse
// para que la palabra entera quede dentro de la curva, sea corta ("GTA") o larga ("Murciélago").
import { useLayoutEffect, useRef, useState, type CSSProperties } from 'react';

const MAX_SIZE = 46; // display-l (3.2)
const MIN_SIZE = 22;
const LINE_HEIGHT = 1.05;
const BORDER = 3;
/** Palabra corta: el texto ocupa el 72 % del ancho, como el relleno 34 · 40 del diseño. */
const SHORT_FILL = 0.72;
/** Las esquinas de la tinta de las letras no pasan del 95 % del radio de la elipse (0,95² ≈ 0,9). */
const CORNER_LIMIT = 0.9;
/** El texto ocupa como mucho el 86 % del ancho de la elipse (0,86² ≈ 0,74): aire en los extremos. */
const MAX_HORIZONTAL = 0.74;
const MIN_HEIGHT = 104;
const MAX_HEIGHT = 230;
const MIN_ASPECT = 0.42;
/** Una sola línea si así la letra llega a este tamaño; si no, se prueba en dos líneas. */
const GOOD_ONE_LINE = 36;
const TAIL_AT = 0.35; // cola cerca del centro inferior, a un 35 % desde la izquierda (4.5)

interface Layout {
  size: number;
  lines: string[];
  width: number;
  height: number;
  /** Desplazamiento vertical para que la tinta (no la caja de línea) quede en el centro de la elipse. */
  shiftY: number;
}

/** Formas de partir la palabra: entera, o en dos líneas por un espacio o tras un guion. */
function splits(word: string): string[][] {
  const options = [[word]];
  for (let i = 1; i < word.length; i++) {
    if (word[i] === ' ') options.push([word.slice(0, i), word.slice(i + 1)]);
    else if (word[i - 1] === '-') options.push([word.slice(0, i), word.slice(i)]);
  }
  return options;
}

let canvas: HTMLCanvasElement | null = null;
/**
 * Ancho de avance, alto de tinta (sin el hueco de la fuente) y posición de la tinta dentro de la
 * caja de línea CSS de una línea en mayúsculas.
 */
function measure(text: string, size: number) {
  canvas ??= document.createElement('canvas');
  const ctx = canvas.getContext('2d')!;
  ctx.font = `400 ${size}px "Dela Gothic One"`;
  const m = ctx.measureText(text.toLocaleUpperCase('es-ES'));
  // En CSS el área de contenido de la fuente va centrada en la caja de línea; la línea base cae en:
  const lineBox = size * LINE_HEIGHT;
  const baseline = (lineBox - (m.fontBoundingBoxAscent + m.fontBoundingBoxDescent)) / 2 + m.fontBoundingBoxAscent;
  return {
    width: m.width,
    ink: m.actualBoundingBoxAscent + m.actualBoundingBoxDescent,
    inkTop: baseline - m.actualBoundingBoxAscent,
    inkBottom: baseline + m.actualBoundingBoxDescent,
  };
}

/** Mayor tamaño de letra con el que estas líneas caben en una elipse de, como mucho, `maxWidth`. */
function fit(lines: string[], maxWidth: number): Layout | null {
  const innerMax = maxWidth - 2 * BORDER;
  for (let size = MAX_SIZE; size >= MIN_SIZE; size--) {
    const metrics = lines.map((l) => measure(l, size));
    const tw = Math.max(...metrics.map((m) => m.width));
    const innerW = Math.min(innerMax, tw / SHORT_FILL);
    const horizontal = (tw / innerW) ** 2;
    if (horizontal > MAX_HORIZONTAL) continue;
    // Alto de la tinta: líneas intermedias completas + tinta de la primera y la última
    const inkHeight = (lines.length - 1) * size * LINE_HEIGHT + Math.max(...metrics.map((m) => m.ink));
    // Esquina de la tinta dentro de la elipse: (tw/W)² + (tinta/H)² ≤ límite
    const innerH = Math.max(
      inkHeight / Math.sqrt(CORNER_LIMIT - horizontal),
      lines.length * size * LINE_HEIGHT, // las cajas de línea caben enteras
      MIN_HEIGHT - 2 * BORDER,
      innerW * MIN_ASPECT,
    );
    if (innerH > MAX_HEIGHT) continue;
    // Centro de la tinta respecto al centro del bloque de líneas
    const lineBox = size * LINE_HEIGHT;
    const inkTop = metrics[0].inkTop;
    const inkBottom = (lines.length - 1) * lineBox + metrics[metrics.length - 1].inkBottom;
    const shiftY = (lines.length * lineBox) / 2 - (inkTop + inkBottom) / 2;
    return { size, lines, width: innerW + 2 * BORDER, height: innerH + 2 * BORDER, shiftY };
  }
  return null;
}

function layoutFor(word: string, maxWidth: number): Layout {
  const [single, ...multi] = splits(word);
  const one = fit(single, maxWidth);
  if (one && one.size >= GOOD_ONE_LINE) return one;
  const best = multi
    .map((lines) => fit(lines, maxWidth))
    .filter((l): l is Layout => l !== null)
    .sort((a, b) => b.size - a.size)[0];
  if (one && (!best || one.size >= best.size)) return one;
  // Último recurso (no debería pasar con el contenido actual): letra mínima a todo el ancho.
  return best ?? { size: MIN_SIZE, lines: single, width: maxWidth, height: MIN_HEIGHT, shiftY: 0 };
}

export function WordBubble({ word }: { word: string }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [layout, setLayout] = useState<Layout | null>(null);

  useLayoutEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    let active = true;
    const update = () => active && setLayout(layoutFor(word, wrap.clientWidth));
    update();
    // Medir con la fuente de reserva daría otro ancho: se recalcula cuando Dela Gothic está lista.
    document.fonts?.load(`400 ${MAX_SIZE}px "Dela Gothic One"`, word.toLocaleUpperCase('es-ES')).then(update);
    const ro = new ResizeObserver(update);
    ro.observe(wrap);
    return () => {
      active = false;
      ro.disconnect();
    };
  }, [word]);

  // La cola se apoya en la curva: a un 35 % del ancho, el borde inferior de la elipse está algo más arriba.
  const tailLift = layout ? (layout.height / 2) * (1 - Math.sqrt(1 - (1 - 2 * TAIL_AT) ** 2)) : 0;

  return (
    <div ref={wrapRef} className="word-bubble">
      {layout && (
        <div
          className="bubble bubble--ellipse bubble--tail-down word-bubble__shape"
          style={
            {
              width: layout.width,
              height: layout.height,
              '--tail-x': `${TAIL_AT * 100}%`,
              '--tail-lift': `${tailLift}px`,
            } as CSSProperties
          }
        >
          <p
            className="display word-bubble__text"
            style={{ fontSize: layout.size, transform: `translateY(${layout.shiftY.toFixed(1)}px)` }}
          >
            {layout.lines.map((line, i) => (
              <span key={i}>{line}</span>
            ))}
          </p>
        </div>
      )}
    </div>
  );
}
