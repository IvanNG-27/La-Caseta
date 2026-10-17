// "Cerrar (x)" durante una partida → confirmación → Inicio (01, 7.2).
import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router';
import { ConfirmDialog } from '../components/ConfirmDialog';

export function useExitConfirm(onExit?: () => void) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);

  const dialog = (
    <ConfirmDialog
      open={open}
      title="¿Salir de la partida?"
      message="Se perderá el progreso."
      confirmLabel="Salir"
      cancelLabel="Seguir jugando"
      onCancel={close}
      onConfirm={() => {
        onExit?.();
        navigate('/', { replace: true });
      }}
    />
  );

  return { requestExit: () => setOpen(true), dialog };
}
