// Votación — PENDIENTE (sección 10). Falta decidir: voto secreto pasando el móvil o voto a mano alzada.
// La lógica ya está lista: basta con llamar a submitVotes({ idVotante: idVotado }).
import { Navigate, useNavigate } from 'react-router';
import { X } from 'lucide-react';
import { Pending } from './Pending';
import { Button } from '../components/Buttons';
import { useImpostor } from '../store/impostor';
import { useT } from '../i18n';
import { useExitConfirm } from '../hooks/useExitConfirm';

export function ImpostorVote() {
  const navigate = useNavigate();
  const t = useT();
  const { active, submitVotes, exit } = useImpostor();
  const { requestExit, dialog } = useExitConfirm(exit);

  if (!active) return <Navigate to="/" replace />;

  return (
    <Pending
      title={t.vote.title}
      description={t.vote.pendingText}
      action={{ icon: X, label: t.common.exitGame, onClick: requestExit }}
    >
      {/* TEMPORAL: sustituir por la votación real cuando esté diseñada. */}
      <Button
        variant="dark"
        arrow
        onClick={() => {
          submitVotes({});
          navigate('/impostor/resultados', { replace: true });
        }}
      >
        {t.vote.seeResults}
      </Button>
      {dialog}
    </Pending>
  );
}
