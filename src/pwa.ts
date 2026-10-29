// Actualización de la app instalada (PWA).
// - Busca versión nueva al abrir, al volver a primer plano y cada 15 minutos.
// - Si la hay, la aplica sola en Inicio; en mitad de una partida espera a volver a Inicio
//   para no perder la partida con una recarga.
import { registerSW } from 'virtual:pwa-register';

const CHECK_EVERY_MS = 15 * 60 * 1000;
/** Se suscribe a los cambios de pantalla (el router de la app no dispara 'hashchange'). */
type OnNavigate = (listener: (pathname: string) => void) => void;

export function setupAppUpdates(onNavigate: OnNavigate, currentPath: () => string) {
  let pending = false;

  const updateSW = registerSW({
    immediate: true,
    onNeedRefresh() {
      pending = true;
      applyIfHome();
    },
    onRegisteredSW(_url, registration) {
      if (!registration) return;
      const check = () => {
        if (navigator.onLine) void registration.update().catch(() => {});
      };
      setInterval(check, CHECK_EVERY_MS);
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') check();
      });
    },
  });

  function applyIfHome() {
    if (pending && currentPath() === '/') void updateSW(true); // activa la versión nueva y recarga
  }
  onNavigate(() => applyIfHome());
}
