// Temporizador descendente del debate (7.2.3). Arranca nada más montarse.
import { useEffect, useRef, useState } from 'react';

export function useCountdown(totalSeconds: number, onFinish?: () => void): number {
  const [remaining, setRemaining] = useState(totalSeconds);
  const endAt = useRef(Date.now() + totalSeconds * 1000);
  const finished = useRef(false);

  useEffect(() => {
    const id = window.setInterval(() => {
      const left = Math.max(0, Math.ceil((endAt.current - Date.now()) / 1000));
      setRemaining(left);
      if (left === 0 && !finished.current) {
        finished.current = true;
        window.clearInterval(id);
        onFinish?.();
      }
    }, 250);
    return () => window.clearInterval(id);
  }, []);

  return remaining;
}

export const formatClock = (seconds: number): string =>
  `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;
