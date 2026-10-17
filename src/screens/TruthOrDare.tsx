// 6.5 Verdad o reto · partida — estados Elegir y Carta.
import { useState } from 'react';
import { Navigate } from 'react-router';
import { RotateCcw, X } from 'lucide-react';
import { Header } from '../components/Header';
import { Panel } from '../components/Panel';
import { Bubble, Caption, Sfx, Stamp } from '../components/fx';
import { Button } from '../components/Buttons';
import { FitText } from '../components/FitText';
import { usePlayers } from '../store/players';
import { useT } from '../i18n';
import { useExitConfirm } from '../hooks/useExitConfirm';
import { MIN_PLAYERS } from '../games/shared/players';
import { draw, initTruthOrDare, nextTurn } from '../games/verdadReto/logic';
import './TruthOrDare.css';

export function TruthOrDare() {
  const t = useT();
  const players = usePlayers((s) => s.players);
  const [state, setState] = useState(() => initTruthOrDare('suave'));
  const { requestExit, dialog } = useExitConfirm();

  if (players.length < MIN_PLAYERS['verdad-o-reto']) return <Navigate to="/jugadores?juego=verdad-o-reto" replace />;

  const player = players[state.turn % players.length];
  const card = state.card;

  return (
    <main className="screen tod">
      <Header
        title={t.tod.title}
        action={{ icon: X, label: t.common.exitGame, onClick: requestExit }}
        right={
          <Stamp variant="outline" rotate={-5} size={12} style={{ marginRight: 4 }}>
            {t.tod.levels[state.level] ?? state.level}
          </Stamp>
        }
      />

      <Panel height={120} focusLines className="tod__turn">
        <Caption>{t.tod.turnOf}</Caption>
        <FitText as="h1" max={46} className="plate tod__name">
          {player.name}
        </FitText>
      </Panel>

      {state.phase === 'choose' || !card ? (
        <div className="tod__choices grow">
          <Panel
            as="button"
            type="button"
            background="tone"
            className="tod__choice tod__choice--truth pressable pressable--large"
            onClick={() => setState((s) => draw(s, 'verdad'))}
          >
            <span className="tod__choice-box">
              <span className="display tod__choice-title">{t.tod.truth}</span>
              <span className="tod__choice-sub">{t.tod.truthSub}</span>
            </span>
            <Sfx text="ドキッ" size={26} vertical style={{ top: 10, right: 10 }} />
          </Panel>
          <Panel
            as="button"
            type="button"
            background="ink"
            focusLines
            className="tod__choice tod__choice--dare pressable pressable--large"
            onClick={() => setState((s) => draw(s, 'reto'))}
          >
            <span className="tod__choice-box tod__choice-box--ink">
              <span className="display tod__choice-title">{t.tod.dare}</span>
              <span className="tod__choice-sub">{t.tod.dareSub}</span>
            </span>
            <Sfx text="バッ" size={26} tone="red-on-ink" vertical style={{ top: 10, left: 10 }} />
          </Panel>
        </div>
      ) : (
        <>
          <Panel grow background="tone" className="tod__card">
            <span className={`display tod__type tod__type--${card.type}`}>{card.type === 'verdad' ? t.tod.truth : t.tod.dare}</span>
            <span className="tod__count">
              {t.tod.card(card.position, card.total)}
            </span>
            <Bubble tail="up" tailX="50px" className="tod__bubble">
              <p className="tod__prompt">{card.text}</p>
            </Bubble>
          </Panel>
          <div className="row">
            <Button variant="secondary" iconStart={RotateCcw} flex={1} onClick={() => setState((s) => draw(s, card.type))}>
              {t.tod.another}
            </Button>
            <Button arrow flex={1} onClick={() => setState((s) => nextTurn(s, players.length))}>
              {t.tod.done}
            </Button>
          </div>
        </>
      )}
      {dialog}
    </main>
  );
}
