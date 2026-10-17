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
import { WordBubble } from '../components/WordBubble';
import { useImpostor } from '../store/impostor';
import { useSettings } from '../store/settings';
import { useT } from '../i18n';
import { useExitConfirm } from '../hooks/useExitConfirm';
import { formatClock, useCountdown } from '../hooks/useCountdown';
import './ImpostorGame.css';

export function ImpostorGame() {
  const navigate = useNavigate();
  const t = useT();
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
  const category = t.categories[game.category] ?? game.category;

  return (
    <main className="screen impostor">
      <Header
        title={t.impostor.title}
        subtitle={t.impostor.roundLine(game.round, category)}
        action={{ icon: X, label: t.common.exitGame, onClick: requestExit }}
        right={
          !isDebate && (
            <HeaderIndicator label={t.impostor.playerOf(game.turn + 1, total)}>
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
            <Caption>{t.impostor.passTo}</Caption>
            <FitText as="h1" max={50} className="plate impostor__name-text">
              {player.name}
            </FitText>
          </Panel>

          {game.phase === 'hidden' && <Hidden onReveal={game.reveal} />}
          {game.phase === 'revealed' && !isImpostor && <Word word={game.word} category={category} />}
          {game.phase === 'revealed' && isImpostor && <Impostor category={category} />}

          <div className="impostor__bottom">
            {game.phase === 'hidden' ? (
              <p className="impostor__hint">{t.impostor.tapHint}</p>
            ) : (
              <Button variant="dark" arrow onClick={game.hideAndPass} style={{ width: '100%' }}>
                {isLast ? t.impostor.hideAndDebate : t.impostor.hideAndPass(next.name)}
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
  const t = useT();
  const [line1, line2] = t.impostor.tapNote;
  return (
    <Panel
      as="button"
      type="button"
      background="tone-dense"
      grow
      className="impostor__main impostor__hidden pressable pressable--large"
      onClick={onReveal}
      aria-label={`${t.impostor.tap} ${line1} ${line2}`}
    >
      <Burst width={280} height={170}>
        <span className="display impostor__tap">{t.impostor.tap}</span>
      </Burst>
      <span className="impostor__hidden-note">
        {line1}
        <br />
        {line2}
      </span>
      <Sfx text="ドキドキ" size={30} tone="red" vertical style={{ top: 10, right: 10 }} />
    </Panel>
  );
}

/** B · Palabra */
function Word({ word, category }: { word: string; category: string }) {
  const t = useT();
  return (
    <Panel grow className="impostor__main impostor__word">
      <Caption>{t.impostor.yourWord}</Caption>
      <WordBubble word={word} />
      <span className="plate--ink impostor__category">{t.impostor.categoryLine(category)}</span>
      <p className="impostor__word-note">{t.impostor.wordNote}</p>
      <Sfx text="ニヤッ" size={20} tone="ink" rotate={-8} style={{ bottom: 12, right: 12 }} />
    </Panel>
  );
}

/** C · Impostor — viñeta invertida (4.10). */
function Impostor({ category }: { category: string }) {
  const t = useT();
  return (
    <Panel grow background="ink" focusLines className="impostor__main impostor__reveal">
      <span className="plate impostor__eres">{t.impostor.youAre}</span>
      <span className="display plate--ink impostor__big">{t.impostor.impostorWord}</span>
      <Stamp onInk size={13}>
        {t.impostor.hint(category)}
      </Stamp>
      <p className="plate--ink impostor__reveal-note">{t.impostor.impostorNote}</p>
      <Sfx text="ゴクッ" size={30} tone="red-on-ink" vertical style={{ top: 10, right: 10 }} />
    </Panel>
  );
}

/** D · Debate */
function Debate({ starter, onVote }: { starter: string; onVote: () => void }) {
  const t = useT();
  const minutes = useSettings((s) => s.debateMinutes);
  const [timeUp, setTimeUp] = useState(false);
  const remaining = useCountdown(minutes * 60, () => {
    setTimeUp(true);
    navigator.vibrate?.(400);
  });
  const minutesLeft = Math.ceil(remaining / 60);

  return (
    <>
      <Panel height={180} focusLines className="impostor__debate-head">
        <Burst width={300} height={140}>
          <h1 className="display impostor__debate-title">{t.impostor.debate}</h1>
        </Burst>
      </Panel>
      <Panel background="ink" className="impostor__rules">
        <p>{t.impostor.rules}</p>
      </Panel>
      <Panel grow background="tone" className="impostor__timer-panel">
        <Bubble tail="down" tailX="50%" className="impostor__starter">
          {t.impostor.starts} <span className="display">{starter}</span>
        </Bubble>
        <div className="impostor__timer">
          <span className="display impostor__clock" aria-hidden>
            {timeUp ? t.impostor.timeUp : formatClock(remaining)}
          </span>
          <span className="impostor__timer-label">{t.impostor.debateTime}</span>
          {/* 8.1: el temporizador solo se anuncia cada minuto */}
          <span className="visually-hidden" aria-live="polite">
            {timeUp ? t.impostor.timeUp : t.common.minutes(minutesLeft)}
          </span>
        </div>
      </Panel>
      <Button arrow onClick={onVote}>
        {t.impostor.toVote}
      </Button>
    </>
  );
}
