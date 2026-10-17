// "Cerrar (x)" durante una partida → confirmación → Inicio (01, 7.2).
import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { useT } from '../i18n';

export function useExitConfirm(onExit?: () => void) {
  const navigate = useNavigate();
  const t = useT();
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);

  const dialog = (
    <ConfirmDialog
      open={open}
      title={t.exit.title}
      message={t.exit.message}
      confirmLabel={t.exit.confirm}
      cancelLabel={t.exit.cancel}
      onCancel={close}
      onConfirm={() => {
        onExit?.();
        navigate('/', { replace: true });
      }}
    />
  );

  return { requestExit: () => setOpen(true), dialog };
}
