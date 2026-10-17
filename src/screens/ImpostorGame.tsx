// 6.3 Impostor · partida — estados A · Tapada, B · Palabra, C · Impostor, D · Debate.
import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router';
import { X } from 'lucide-react';
import { Header, HeaderIndicator } from '../components/Header';
import { Panel } from '../components/Panel';
import { Bubble, Burst, Caption, Sfx, Stamp } from '../components/fx';
import { Button } from '../components/Buttons';
import { ProgressSegments } from '../components/GameItems';
import { FitText } from '../components/FitText';
import { useImpostor } from '../store/impostor';
import { useExitConfirm } from '../hooks/useExitConfirm';
import { formatClock, useCountdown } from '../hooks/useCountdown';
import { DEBATE_SECONDS } from '../config';
import './ImpostorGame.css';

export function ImpostorGame() {
  const navigate = useNavigate();
  const game = useImpostor();
  const { requestExit, dialog } = useExitConfirm(game.exit);

  if (!game.active) return <Navigate to="/jugadores?juego=impostor" replace />;
  if (game.phase === 'voting') return <Navigate to="/impostor/votacion" replace />;
  if (game.phase === 'results') return <Navigate to="/impostor/resultados" replace />;

  const isDebate = game.phase === 'debate';
  const player = game.players[game.turn];
  const total = game.players.length;
  const isLast = game.turn === total - 1;
  const isImpostor = game.impostorIds.includes(player.id);
  const next = game.players[game.turn + 1];

  return (
    <main className="screen impostor">
      <Header
        title="Impostor"
        subtitle={`Ronda ${game.round} · ${game.category}`}
        action={{ icon: X, label: 'Salir de la partida', onClick: requestExit }}
        right={
          !isDebate && (
            <HeaderIndicator label={`Jugador ${game.turn + 1} de ${total}`}>
              {game.turn + 1}/{total}
            </HeaderIndicator>
          )
        }
      />

      {isDebate ? (
        <Debate
          starter={game.players.find((p) => p.id === game.starterId)?.name ?? ''}
          onVote={() => {
            game.goToVoting();
            navigate('/impostor/votacion');
          }}
        />
      ) : (
        <>
          <ProgressSegments total={total} current={game.turn} />

          <Panel height={130} focusLines className="impostor__name">
            <Caption>Pasa el móvil a…</Caption>
            <FitText as="h1" max={50} className="plate impostor__name-text">
              {player.name}
            </FitText>
          </Panel>

          {game.phase === 'hidden' && <Hidden onReveal={game.reveal} />}
          {game.phase === 'revealed' && !isImpostor && <Word word={game.word} category={game.category} />}
          {game.phase === 'revealed' && isImpostor && <Impostor category={game.category} />}

          <div className="impostor__bottom">
            {game.phase === 'hidden' ? (
              <p className="impostor__hint">Pulsa solo cuando tengas el móvil en la mano.</p>
            ) : (
              <Button variant="dark" arrow onClick={game.hideAndPass} style={{ width: '100%' }}>
                {isLast ? 'Ocultar y debatir' : `Ocultar y pasar a ${next.name}`}
              </Button>
            )}
          </div>
        </>
      )}
      {dialog}
    </main>
  );
}

/** A · Tapada: toda la viñeta es un botón. */
function Hidden({ onReveal }: { onReveal: () => void }) {
  return (
    <Panel
      as="button"
      type="button"
      background="tone-dense"
      grow
      className="impostor__main impostor__hidden pressable pressable--large"
      onClick={onReveal}
      aria-label="Toca para ver tu papel. Que nadie más mire."
    >
      <Burst width={280} height={170}>
        <span className="display impostor__tap">¡Toca!</span>
      </Burst>
      <span className="impostor__hidden-note">
        Para ver tu papel.
        <br />
        Que nadie más mire.
      </span>
      <Sfx text="ドキドキ" size={30} tone="red" vertical style={{ top: 10, right: 10 }} />
    </Panel>
  );
}

/** B · Palabra */
function Word({ word, category }: { word: string; category: string }) {
  return (
    <Panel grow className="impostor__main impostor__word">
      <Caption>Tu palabra es…</Caption>
      <Bubble ellipse tail="down" tailX="35%" className="impostor__word-bubble">
        <FitText max={46} min={28}>
          {word}
        </FitText>
      </Bubble>
      <span className="plate--ink impostor__category">Categoría: {category}</span>
      <p className="impostor__word-note">Uno de vosotros no la sabe. Que no te pille.</p>
      <Sfx text="ニヤッ" size={20} tone="ink" rotate={-8} style={{ bottom: 12, right: 12 }} />
    </Panel>
  );
}

/** C · Impostor — viñeta invertida (4.10). */
function Impostor({ category }: { category: string }) {
  return (
    <Panel grow background="ink" focusLines className="impostor__main impostor__reveal">
      <span className="plate impostor__eres">Eres el</span>
      <span className="display plate--ink impostor__big">Impostor</span>
      <Stamp onInk size={13}>
        Pista: {category}
      </Stamp>
      <p className="plate--ink impostor__reveal-note">No conoces la palabra. Escucha, disimula y que no te pillen.</p>
      <Sfx text="ゴクッ" size={30} tone="red-on-ink" vertical style={{ top: 10, right: 10 }} />
    </Panel>
  );
}

/** D · Debate */
function Debate({ starter, onVote }: { starter: string; onVote: () => void }) {
  const [timeUp, setTimeUp] = useState(false);
  const remaining = useCountdown(DEBATE_SECONDS, () => {
    setTimeUp(true);
    navigator.vibrate?.(400);
  });
  const minutesLeft = Math.ceil(remaining / 60);

  return (
    <>
      <Panel height={180} focusLines className="impostor__debate-head">
        <Burst width={300} height={140}>
          <h1 className="display impostor__debate-title">¡A debatir!</h1>
        </Burst>
      </Panel>
      <Panel background="ink" className="impostor__rules">
        <p>
          Todos tenéis vuestro papel. Por turnos, decid una palabra relacionada. El impostor intentará pasar
          desapercibido.
        </p>
      </Panel>
      <Panel grow background="tone" className="impostor__timer-panel">
        <Bubble tail="down" tailX="50%" className="impostor__starter">
          Empieza <span className="display">{starter}</span>
        </Bubble>
        <div className="impostor__timer">
          <span className="display impostor__clock" aria-hidden>
            {timeUp ? '¡Tiempo!' : formatClock(remaining)}
          </span>
          <span className="impostor__timer-label">Tiempo de debate</span>
          {/* 8.1: el temporizador solo se anuncia cada minuto */}
          <span className="visually-hidden" aria-live="polite">
            {timeUp ? '¡Tiempo!' : `${minutesLeft} ${minutesLeft === 1 ? 'minuto' : 'minutos'}`}
          </span>
        </div>
      </Panel>
      <Button arrow onClick={onVote}>
        Ir a la votación
      </Button>
    </>
  );
}
