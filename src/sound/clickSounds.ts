// Efectos de sonido al pulsar botones: cada pulsación suena uno de src/assets/sonidos al azar.
// Para añadir sonidos basta con dejar más archivos en esa carpeta.
import { useSettings } from '../store/settings';

const urls = Object.values(
  import.meta.glob('../assets/sonidos/*.{mp3,m4a,ogg,wav}', { eager: true, query: '?url', import: 'default' }),
) as string[];

type AudioContextCtor = typeof AudioContext;

let ctx: AudioContext | null = null;
let buffers: AudioBuffer[] = [];
let loading: Promise<void> | null = null;
let current: AudioBufferSourceNode | null = null;
let last = -1;

function audioContext(): AudioContext | null {
  if (!ctx) {
    const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: AudioContextCtor }).webkitAudioContext;
    if (!Ctor) return null;
    ctx = new Ctor();
  }
  return ctx;
}

/** Descarga y decodifica los sonidos una sola vez, para que luego suenen sin retraso. */
function preload(): Promise<void> {
  const c = audioContext();
  if (!c || urls.length === 0) return Promise.resolve();
  loading ??= Promise.all(
    urls.map(async (url) => {
      try {
        const res = await fetch(url);
        return await c.decodeAudioData(await res.arrayBuffer());
      } catch {
        return null; // un archivo roto no debe impedir que suenen los demás
      }
    }),
  ).then((decoded) => {
    buffers = decoded.filter((b): b is AudioBuffer => b !== null);
  });
  return loading;
}

/** Elige un sonido al azar, sin repetir el último si hay más de uno. */
function pick(): AudioBuffer {
  let i = Math.floor(Math.random() * buffers.length);
  if (buffers.length > 1 && i === last) i = (i + 1 + Math.floor(Math.random() * (buffers.length - 1))) % buffers.length;
  last = i;
  return buffers[i];
}

export function playClick() {
  const c = audioContext();
  if (!c) return;
  // En iPhone el audio solo se desbloquea dentro de un toque: se reanuda aquí.
  if (c.state === 'suspended') void c.resume();
  if (buffers.length === 0) {
    void preload();
    return;
  }
  // Corta el anterior para que, al pulsar rápido, no se amontonen y se oigan limpios.
  current?.stop();
  const source = c.createBufferSource();
  source.buffer = pick();
  source.connect(c.destination);
  source.start();
  current = source;
}

const CLICKABLE = 'button, a[href], [role="button"], [role="radio"]';

/**
 * Activa los sonidos en toda la app: escucha los toques sobre cualquier botón.
 * Escucha en fase de burbuja en `document`, después de React, así que al activar el sonido
 * en Ajustes ya suena ese mismo toque, y al desactivarlo ya no.
 */
export function installClickSounds() {
  if (useSettings.getState().sound) void preload();
  useSettings.subscribe((s, prev) => {
    if (s.sound && !prev.sound) void preload();
  });
  document.addEventListener('click', (e) => {
    if (!useSettings.getState().sound) return;
    const el = (e.target as Element | null)?.closest(CLICKABLE);
    if (!el || el.matches(':disabled, [aria-disabled="true"]')) return;
    playClick();
  });
}
