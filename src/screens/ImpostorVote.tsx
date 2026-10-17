// Votación — PENDIENTE (sección 10). Falta decidir: voto secreto pasando el móvil o voto a mano alzada.
// La lógica ya está lista: basta con llamar a submitVotes({ idVotante: idVotado }).
import { Navigate, useNavigate } from 'react-router';
import { X } from 'lucide-react';
import { Pending } from './Pending';
import { Button } from '../components/Buttons';
import { useImpostor } from '../store/impostor';
import { useExitConfirm } from '../hooks/useExitConfirm';

export function ImpostorVote() {
  const navigate = useNavigate();
  const { active, submitVotes, exit } = useImpostor();
  const { requestExit, dialog } = useExitConfirm(exit);

  if (!active) return <Navigate to="/" replace />;

  return (
    <Pending
      title="Votación"
      description="Pantalla sin diseñar. Mientras tanto, el botón de abajo pasa a Resultados sin votos."
      action={{ icon: X, label: 'Salir de la partida', onClick: requestExit }}
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
        Ver resultados
      </Button>
      {dialog}
    </Pending>
  );
}
