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
import { useExitConfirm } from '../hooks/useExitConfirm';
import { MIN_PLAYERS } from '../games/shared/players';
import { draw, initTruthOrDare, nextTurn } from '../games/verdadReto/logic';
import './TruthOrDare.css';

export function TruthOrDare() {
  const players = usePlayers((s) => s.players);
  const [state, setState] = useState(() => initTruthOrDare('suave'));
  const { requestExit, dialog } = useExitConfirm();

  if (players.length < MIN_PLAYERS['verdad-o-reto']) return <Navigate to="/jugadores?juego=verdad-o-reto" replace />;

  const player = players[state.turn % players.length];
  const card = state.card;

  return (
    <main className="screen tod">
      <Header
        title="Verdad o reto"
        action={{ icon: X, label: 'Salir de la partida', onClick: requestExit }}
        right={
          <Stamp variant="outline" rotate={-5} size={12} style={{ marginRight: 4 }}>
            {state.level}
          </Stamp>
        }
      />

      <Panel height={120} focusLines className="tod__turn">
        <Caption>Turno de…</Caption>
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
              <span className="display tod__choice-title">Verdad</span>
              <span className="tod__choice-sub">Responde con total sinceridad</span>
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
              <span className="display tod__choice-title">Reto</span>
              <span className="tod__choice-sub">Haz lo que diga la carta</span>
            </span>
            <Sfx text="バッ" size={26} tone="red-on-ink" vertical style={{ top: 10, left: 10 }} />
          </Panel>
        </div>
      ) : (
        <>
          <Panel grow background="tone" className="tod__card">
            <span className={`display tod__type tod__type--${card.type}`}>{card.type}</span>
            <span className="tod__count">
              Carta {card.position}/{card.total}
            </span>
            <Bubble tail="up" tailX="50px" className="tod__bubble">
              <p className="tod__prompt">{card.text}</p>
            </Bubble>
          </Panel>
          <div className="row">
            <Button variant="secondary" iconStart={RotateCcw} flex={1} onClick={() => setState((s) => draw(s, card.type))}>
              Otra carta
            </Button>
            <Button arrow flex={1} onClick={() => setState((s) => nextTurn(s, players.length))}>
              ¡Hecho!
            </Button>
          </div>
        </>
      )}
      {dialog}
    </main>
  );
}
