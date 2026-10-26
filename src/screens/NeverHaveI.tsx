// 6.6 Yo nunca · partida
import { useLayoutEffect, useRef, useState, type RefObject } from 'react';
import { Navigate, useNavigate } from 'react-router';
import { X } from 'lucide-react';
import { Header, HeaderIndicator } from '../components/Header';
import { Panel } from '../components/Panel';
import { Bubble, Sfx, Stamp } from '../components/fx';
import { Button } from '../components/Buttons';
import { PlayerToggle } from '../components/PlayerItems';
import { usePlayers } from '../store/players';
import { useSettings } from '../store/settings';
import { useT } from '../i18n';
import { useExitConfirm } from '../hooks/useExitConfirm';
import { MIN_PLAYERS } from '../games/shared/players';
import { initNeverHaveI, nextPhrase, toggleSelected } from '../games/yoNunca/logic';
import './NeverHaveI.css';

const PROMPT_SIZE = 27; // prompt (3.2)
// 8.4 dice que baje hasta 22; en pantallas muy pequeñas con 12 jugadores puede hacer falta llegar a 18.
const PROMPT_LAST_RESORT = 18;

/**
 * 8.4: el bocadillo crece en alto con la frase; si aun así no cabe en la viñeta, la letra baja
 * (hasta 22, y en el peor caso hasta 18) en vez de salirse.
 */
function usePhraseFit(panelRef: RefObject<HTMLElement | null>, textRef: RefObject<HTMLElement | null>, phrase: string) {
  useLayoutEffect(() => {
    const panel = panelRef.current;
    const text = textRef.current;
    const bubble = text?.parentElement;
    if (!panel || !text || !bubble) return;
    const fit = () => {
      const cs = getComputedStyle(panel);
      const room = panel.clientHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom);
      // De 27 hacia abajo hasta que el bocadillo quepa; por debajo de 22 solo si no queda otra.
      for (let size = PROMPT_SIZE; size >= PROMPT_LAST_RESORT; size--) {
        text.style.fontSize = `${size}px`;
        if (bubble.offsetHeight <= room) return;
      }
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(panel);
    return () => ro.disconnect();
  }, [panelRef, textRef, phrase]);
}

/** Yo nunca tiene contenido sexual explícito: antes de jugar, aviso +18 (se recuerda en el dispositivo). */
export function NeverHaveI() {
  const confirmed = useSettings((s) => s.adultConfirmed);
  return confirmed ? <NeverHaveIGame /> : <AdultGate />;
}

function AdultGate() {
  const t = useT();
  const navigate = useNavigate();
  const confirmAdult = useSettings((s) => s.confirmAdult);
  const back = () => navigate('/', { replace: true });

  return (
    <main className="screen never-gate">
      <Header title={t.never.title} action={{ icon: X, label: t.common.back, onClick: back }} />

      <Panel grow background="ink" focusLines className="gate__panel">
        <Stamp onInk rotate={-6} size={15}>
          {t.never.gate.stamp}
        </Stamp>
        <h1 className="display plate--ink gate__big" aria-label={t.never.gate.stamp}>
          +18
        </h1>
        <p className="plate--ink gate__text">{t.never.gate.text}</p>
        <Sfx text="ゴクッ" size={30} tone="red-on-ink" vertical style={{ top: 10, right: 10 }} />
      </Panel>

      {/* Apilados: "TENGO 18 O MÁS" no cabe en 2/3 de fila sin cortarse */}
      <Button arrow onClick={confirmAdult}>
        {t.never.gate.confirm}
      </Button>
      <Button variant="secondary" onClick={back}>
        {t.never.gate.cancel}
      </Button>
    </main>
  );
}

function NeverHaveIGame() {
  const t = useT();
  const players = usePlayers((s) => s.players);
  const [state, setState] = useState(() => initNeverHaveI());
  const { requestExit, dialog } = useExitConfirm();
  const panelRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);
  usePhraseFit(panelRef, textRef, state.phrase.text);

  if (players.length < MIN_PLAYERS['yo-nunca']) return <Navigate to="/jugadores?juego=yo-nunca" replace />;

  return (
    <main className="screen never">
      <Header
        title={t.never.title}
        action={{ icon: X, label: t.common.exitGame, onClick: requestExit }}
        right={<HeaderIndicator>{t.never.phrase(state.number)}</HeaderIndicator>}
      />

      <Panel ref={panelRef} grow background="tone" className="never__phrase">
        <span className={`display never__type never__type--${state.phrase.type}`}>{t.never.types[state.phrase.type]}</span>
        <Bubble tail="down" tailX="calc(100% - 60px)" className="never__bubble">
          <span className="display never__caption">{t.never.lead}</span>
          <h1 ref={textRef} className="never__text">
            <span className="visually-hidden">{t.never.lead} </span>
            {state.phrase.text}
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
