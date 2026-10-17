// 6.1 Inicio
import { Fragment } from 'react';
import { useNavigate } from 'react-router';
import { EyeOff, Hand, MessageCircleQuestion, Settings2, Users } from 'lucide-react';
import { APP_NAME } from '../config';
import { Panel } from '../components/Panel';
import { Burst, Sfx } from '../components/fx';
import { GameCard, IconCircle } from '../components/GameItems';
import { IconButton } from '../components/Buttons';
import { Icon } from '../components/Icon';
import { usePlayers } from '../store/players';
import { useT } from '../i18n';
import { GAME_PATH, MIN_PLAYERS, type GameId } from '../games/shared/players';
import './Home.css';

/** Una línea por elemento, separadas con <br /> (títulos en dos líneas del diseño). */
const lines = (parts: string[]) =>
  parts.map((part, i) => (
    <Fragment key={i}>
      {i > 0 && <br />}
      {part}
    </Fragment>
  ));

export function Home() {
  const navigate = useNavigate();
  const t = useT();
  const count = usePlayers((s) => s.players.length);

  // PROPUESTA: si no hay jugadores suficientes, las tarjetas llevan primero a Añadir jugadores.
  const openGame = (game: GameId) =>
    navigate(count >= MIN_PLAYERS[game] ? GAME_PATH[game] : `/jugadores?juego=${game}`);

  return (
    <main className="screen home">
      <header className="header" style={{ height: 60 }}>
        <p className="display header__title home__app-name" style={{ fontSize: 16 }}>
          {APP_NAME}
        </p>
        <span aria-hidden className="display home__chapter">
          第1話
        </span>
        <IconButton variant="header" icon={Settings2} label={t.common.settings} onClick={() => navigate('/ajustes')} />
      </header>

      <Panel height={230} focusLines className="home__cover">
        <Burst width={310} height={150}>
          <h1 className="display home__title">{lines(t.home.title)}</h1>
        </Burst>
        <Sfx text="ドン!" size={34} rotate={12} style={{ top: 8, right: 10 }} />
        <button type="button" className="home__players-link pressable" onClick={() => navigate('/jugadores')}>
          <Icon icon={Users} size={18} />
          {count > 0 ? (
            <>
              <span>{t.home.players(count)}</span>
              <span className="home__edit">{t.home.edit}</span>
            </>
          ) : (
            <span>{t.home.addPlayers}</span>
          )}
        </button>
      </Panel>

      <GameCard
        skew
        layout="row"
        className="home__impostor"
        tag={t.home.impostorTag}
        title={lines(t.home.impostorTitle)}
        titleSize={30}
        description={t.home.impostorDesc}
        onClick={() => navigate('/jugadores?juego=impostor')}
        illustration={
          <span className="home__art tone">
            <IconCircle size={70}>
              <Icon icon={EyeOff} size={34} />
            </IconCircle>
            <Sfx text="ジーッ" size={18} vertical style={{ top: 8, right: 8 }} />
          </span>
        }
      />

      <div className="home__pair grow">
        <GameCard
          layout="column"
          tag={t.home.todTag}
          title={lines(t.home.todTitle)}
          titleSize={22}
          description={t.home.todDesc}
          onClick={() => openGame('verdad-o-reto')}
          illustration={
            <span className="home__art tone">
              <IconCircle size={64}>
                <Icon icon={MessageCircleQuestion} size={32} />
              </IconCircle>
              <Sfx text="ドキッ" size={22} rotate={-10} style={{ top: 6, left: 6 }} />
            </span>
          }
        />
        <GameCard
          layout="column"
          tag={t.home.neverTag}
          title={lines(t.home.neverTitle)}
          titleSize={22}
          description={t.home.neverDesc}
          onClick={() => openGame('yo-nunca')}
          illustration={
            <span className="home__art speed-lines">
              <IconCircle size={64}>
                <Icon icon={Hand} size={32} />
              </IconCircle>
              <span className="home__hai" aria-hidden>
                <Sfx text="ハイ!" size={14} style={{ position: 'static' }} />
              </span>
            </span>
          }
        />
      </div>
    </main>
  );
}
