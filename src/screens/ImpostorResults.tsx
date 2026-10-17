// 6.4 Impostor · Resultados
import { Navigate, useNavigate } from 'react-router';
import { X } from 'lucide-react';
import { Header, HeaderIndicator } from '../components/Header';
import { Panel } from '../components/Panel';
import { Caption, Sfx, Stamp } from '../components/fx';
import { Button } from '../components/Buttons';
import { ScoreCell, VoteBar } from '../components/GameItems';
import { FitText } from '../components/FitText';
import { useImpostor } from '../store/impostor';
import { useT } from '../i18n';
import './ImpostorResults.css';

export function ImpostorResults() {
  const navigate = useNavigate();
  const t = useT();
  const game = useImpostor();

  if (!game.active || !game.result) return <Navigate to="/" replace />;

  const { result, players, impostorIds, scores } = game;
  const byId = new Map(players.map((p) => [p.id, p]));
  // PENDIENTE: con varios impostores el diseño solo muestra un nombre; se muestran todos separados.
  const impostorNames = impostorIds.map((id) => byId.get(id)?.name ?? '').join(' · ');
  const impostorVotes = result.tally.filter((t) => impostorIds.includes(t.playerId)).reduce((n, t) => n + t.votes, 0);
  const topId = result.tally[0]?.votes > 0 ? result.tally[0].playerId : null;
  const ranking = [...players].sort((a, b) => (scores[b.id] ?? 0) - (scores[a.id] ?? 0));

  const home = () => {
    game.exit();
    navigate('/', { replace: true });
  };
  const again = () => {
    game.nextRound();
    navigate('/impostor', { replace: true });
  };

  return (
    <main className="screen screen--scroll results">
      <Header
        title={t.results.title}
        titleAs="h1"
        titleSize={20}
        action={{ icon: X, label: t.common.backHome, onClick: home }}
        right={<HeaderIndicator>{t.results.round(game.round)}</HeaderIndicator>}
      />

      <Panel height={240} background="ink" focusLines className="results__reveal">
        <Caption>{t.results.impostorWas}</Caption>
        <div className="results__name-wrap">
          {/* PROPUESTA: texto neutro, la app no conoce el género del jugador */}
          <Stamp onInk border={3} rotate={-8} size={16} className="results__verdict">
            {result.caught ? t.results.caught : t.results.escaped}
          </Stamp>
          <FitText as="p" max={84} className="plate--ink results__name">
            {impostorNames}
          </FitText>
        </div>
        <Sfx text="バーン" size={30} vertical style={{ top: 10, right: 10 }} />
        <p className="results__footer">
          {t.results.footer(impostorVotes, players.length, game.word)}
        </p>
      </Panel>

      <Panel className="results__votes">
        <h2 className="display results__votes-title">{t.results.votes}</h2>
        <ul className="vote-list">
          {result.tally.map((row) => (
            <VoteBar
              key={row.playerId}
              name={byId.get(row.playerId)?.name ?? ''}
              votes={row.votes}
              total={players.length}
              top={row.playerId === topId}
            />
          ))}
        </ul>
      </Panel>

      <ul className="score-grid" aria-label={t.results.scoreboard}>
        {ranking.map((p) => (
          <ScoreCell key={p.id} name={p.name} roundPoints={result.points[p.id] ?? 0} total={scores[p.id] ?? 0} />
        ))}
      </ul>

      <div className="row results__actions">
        <Button variant="secondary" flex={1} onClick={home}>
          {t.results.home}
        </Button>
        <Button arrow flex={2} onClick={again}>
          {t.results.again}
        </Button>
      </div>
    </main>
  );
}
