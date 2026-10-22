// Impostor · Votación: reunión hablada. La app muestra a los jugadores y el grupo acusa a uno.
import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router';
import { X } from 'lucide-react';
import { Header } from '../components/Header';
import { Panel } from '../components/Panel';
import { Burst, Sfx } from '../components/fx';
import { Button, DisabledButton } from '../components/Buttons';
import { PlayerToggle } from '../components/PlayerItems';
import { FitText } from '../components/FitText';
import { useImpostor } from '../store/impostor';
import { useT } from '../i18n';
import { useExitConfirm } from '../hooks/useExitConfirm';
import './ImpostorVote.css';

export function ImpostorVote() {
  const navigate = useNavigate();
  const t = useT();
  const { active, phase, players, round, wordCategory, accuse, exit } = useImpostor();
  const { requestExit, dialog } = useExitConfirm(exit);
  const [accusedId, setAccusedId] = useState<string | null>(null);

  if (!active) return <Navigate to="/" replace />;
  if (phase === 'results') return <Navigate to="/impostor/resultados" replace />;

  const accused = players.find((p) => p.id === accusedId);

  return (
    <main className="screen vote">
      <Header
        title={t.vote.title}
        subtitle={t.impostor.roundLine(round, t.categories[wordCategory] ?? wordCategory)}
        action={{ icon: X, label: t.common.exitGame, onClick: requestExit }}
      />

      <Panel height={150} focusLines className="vote__head">
        <Burst width={320} height={140}>
          <FitText as="h1" max={26} min={18} className="vote__question">
            {t.vote.question[0]}
            <br />
            {t.vote.question[1]}
          </FitText>
        </Burst>
        {/* ザワザワ "zawa zawa": murmullo de la gente hablando */}
        <Sfx text="ザワザワ" size={18} rotate={-10} style={{ bottom: 8, left: 8 }} />
      </Panel>

      <Panel background="ink" className="vote__rules">
        <p>{t.vote.rules}</p>
      </Panel>

      <Panel grow className="vote__pick">
        <div className="vote__pick-head">
          <h2 className="display vote__pick-title">{t.vote.pick}</h2>
          <span className="vote__pick-hint">{t.vote.tapToPick}</span>
        </div>
        {/* Selección única: tocar a otro cambia la acusación; tocar al mismo la quita. */}
        <div className="player-grid vote__grid" role="group" aria-label={t.vote.pick}>
          {players.map((p) => (
            <PlayerToggle
              key={p.id}
              player={p}
              selected={p.id === accusedId}
              onToggle={() => setAccusedId((id) => (id === p.id ? null : p.id))}
            />
          ))}
        </div>
      </Panel>

      {accused ? (
        <Button
          arrow
          shortLabel={t.vote.accuseShort}
          onClick={() => {
            accuse(accused.id);
            navigate('/impostor/resultados', { replace: true });
          }}
        >
          {t.vote.accuse(accused.name)}
        </Button>
      ) : (
        <DisabledButton>{t.vote.needPick}</DisabledButton>
      )}
      {dialog}
    </main>
  );
}
