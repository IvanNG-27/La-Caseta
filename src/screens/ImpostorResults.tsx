// 6.4 Impostor · Resultados
import { Navigate, useNavigate } from 'react-router';
import { X } from 'lucide-react';
import { Header, HeaderIndicator } from '../components/Header';
import { Panel } from '../components/Panel';
import { Caption, Sfx, Stamp } from '../components/fx';
import { Button } from '../components/Buttons';
import { ScoreCell } from '../components/GameItems';
import { Avatar } from '../components/PlayerItems';
import { FitText } from '../components/FitText';
import { useImpostor } from '../store/impostor';
import { useT } from '../i18n';
import './ImpostorResults.css';

export function ImpostorResults() {
  const navigate = useNavigate();
  const t = useT();
  const game = useImpostor();

  if (!game.active) return <Navigate to="/" replace />;
  // Sin resultado = ya ha empezado otra ronda ("Otra ronda"): se sigue a la partida, no a Inicio.
  if (!game.result) return <Navigate to="/impostor" replace />;

  const { result, players, impostorIds, scores } = game;
  const byId = new Map(players.map((p) => [p.id, p]));
  // PENDIENTE: con varios impostores el diseño solo muestra un nombre; se muestran todos separados.
  const impostorNames = impostorIds.map((id) => byId.get(id)?.name ?? '').join(' · ');
  const accused = byId.get(result.accusedId);
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
          <FitText as="p" max={84} min={20} className="plate--ink results__name">
            {impostorNames}
          </FitText>
        </div>
        <Sfx text="バーン" size={30} vertical style={{ top: 10, right: 10 }} />
        <p className="results__footer">
          {t.results.footer(accused?.name ?? '', game.word)}
        </p>
      </Panel>

      <Panel className="results__accused">
        <div className="results__accused-head">
          <h2 className="results__accused-title">{t.results.accusedTitle}</h2>
          <Stamp variant={result.caught ? 'red' : 'outline'} rotate={result.caught ? -4 : 3} size={13}>
            {result.caught ? t.results.guilty : t.results.innocent}
          </Stamp>
        </div>
        <div className="results__accused-row">
          <Avatar name={accused?.name ?? ''} size={40} />
          <FitText max={17} min={11} display={false} className="results__accused-name">
            {accused?.name}
          </FitText>
        </div>
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
