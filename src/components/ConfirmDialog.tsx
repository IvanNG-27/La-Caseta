// PROPUESTA (sección 10): confirmar salida de la partida con estilo de viñeta.
// Sin transparencias de color: el fondo es trama.
import { useEffect, useRef } from 'react';
import { Button } from './Buttons';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({ open, title, message, confirmLabel, cancelLabel, onConfirm, onCancel }: ConfirmDialogProps) {
  const cancelRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    cancelRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onCancel();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onCancel]);

  if (!open) return null;
  return (
    <div className="dialog tone" role="presentation">
      <div className="panel dialog__panel" role="alertdialog" aria-modal="true" aria-labelledby="dialog-title" aria-describedby="dialog-msg">
        <h2 id="dialog-title" className="display dialog__title">
          {title}
        </h2>
        <p id="dialog-msg" className="dialog__msg">
          {message}
        </p>
        <Button variant="primary" onClick={onConfirm}>
          {confirmLabel}
        </Button>
        <Button variant="secondary" onClick={onCancel} ref={cancelRef}>
          {cancelLabel}
        </Button>
      </div>
    </div>
  );
}
