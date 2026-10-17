// Pantallas marcadas PENDIENTE en la sección 10: no se inventa su diseño, solo se reserva la ruta.
import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';
import { Header } from '../components/Header';
import { Panel } from '../components/Panel';
import { Stamp } from '../components/fx';

interface PendingProps {
  title: string;
  description: string;
  action: { icon: LucideIcon; label: string; onClick: () => void };
  children?: ReactNode;
}

export function Pending({ title, description, action, children }: PendingProps) {
  return (
    <main className="screen">
      <Header title={title} titleAs="h1" titleSize={20} action={action} />
      <Panel grow background="tone" style={{ display: 'grid', placeItems: 'center', padding: 16 }}>
        <div className="plate" style={{ padding: 16, border: '3px solid var(--ink)', maxWidth: 300 }}>
          <Stamp variant="outline" size={12}>
            Pendiente
          </Stamp>
          <p style={{ marginTop: 10, fontSize: 15, lineHeight: 1.4 }}>{description}</p>
        </div>
      </Panel>
      {children}
    </main>
  );
}
