// 6.6 Yo nunca · partida
import { useState } from 'react';
import { Navigate } from 'react-router';
import { X } from 'lucide-react';
import { Header, HeaderIndicator } from '../components/Header';
import { Panel } from '../components/Panel';
import { Bubble, Sfx } from '../components/fx';
import { Button } from '../components/Buttons';
import { PlayerToggle } from '../components/PlayerItems';
import { usePlayers } from '../store/players';
import { useT } from '../i18n';
import { useExitConfirm } from '../hooks/useExitConfirm';
import { MIN_PLAYERS } from '../games/shared/players';
import { initNeverHaveI, nextPhrase, toggleSelected } from '../games/yoNunca/logic';
import './NeverHaveI.css';

export function NeverHaveI() {
  const t = useT();
  const players = usePlayers((s) => s.players);
  const [state, setState] = useState(() => initNeverHaveI());
  const { requestExit, dialog } = useExitConfirm();

  if (players.length < MIN_PLAYERS['yo-nunca']) return <Navigate to="/jugadores?juego=yo-nunca" replace />;

  return (
    <main className="screen never">
      <Header
        title={t.never.title}
        action={{ icon: X, label: t.common.exitGame, onClick: requestExit }}
        right={<HeaderIndicator>{t.never.phrase(state.number)}</HeaderIndicator>}
      />

      <Panel grow background="tone" className="never__phrase">
        <Bubble tail="down" tailX="calc(100% - 60px)" className="never__bubble">
          <span className="display never__caption">{t.never.lead}</span>
          <h1 className="never__text">
            <span className="visually-hidden">{t.never.lead} </span>
            {state.phrase}
          </h1>
        </Bubble>
        <Sfx text="ソワソワ" size={26} vertical style={{ bottom: 12, right: 10 }} />
      </Panel>

      <Panel className="never__who">
        <div className="never__who-head">
          <h2 className="display never__who-title">{t.never.who}</h2>
          <span className="never__who-hint">{t.never.tapToMark}</span>
        </div>
        <div className="player-grid">
          {players.map((p) => (
            <PlayerToggle
              key={p.id}
              player={p}
              points={state.scores[p.id] ?? 0}
              selected={state.selected.includes(p.id)}
              onToggle={() => setState((s) => toggleSelected(s, p.id))}
            />
          ))}
        </div>
      </Panel>

      <Button arrow onClick={() => setState((s) => nextPhrase(s))}>
        {t.never.next}
      </Button>
      {dialog}
    </main>
  );
}
