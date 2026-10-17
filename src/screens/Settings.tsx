// Ajustes — PENDIENTE (sección 10): sonido, vibración, duración del debate, idioma…
import { useNavigate } from 'react-router';
import { ChevronLeft } from 'lucide-react';
import { Pending } from './Pending';

export function Settings() {
  const navigate = useNavigate();
  return (
    <Pending
      title="Ajustes"
      description="El contenido de esta pantalla está por definir (sonido, vibración, duración del debate, idioma…)."
      action={{ icon: ChevronLeft, label: 'Volver', onClick: () => navigate('/') }}
    />
  );
}
