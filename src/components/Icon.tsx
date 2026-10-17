// 3.6 Iconografía: Lucide, trazo 2,4–3 px, extremos redondeados, sin relleno. Siempre decorativos.
import type { LucideIcon } from 'lucide-react';

export function Icon({ icon: Glyph, size = 20, stroke = 2.6 }: { icon: LucideIcon; size?: number; stroke?: number }) {
  return <Glyph aria-hidden focusable={false} size={size} strokeWidth={stroke} absoluteStrokeWidth />;
}
