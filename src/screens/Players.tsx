// 6.2 Añadir jugadores
import { useNavigate, useSearchParams } from 'react-router';
import { ChevronLeft } from 'lucide-react';
import { Header } from '../components/Header';
import { Panel } from '../components/Panel';
import { Stamp } from '../components/fx';
import { Button, DisabledButton } from '../components/Buttons';
import { Chip, ChipGroup, Stepper, TextField } from '../components/Form';
import { PlayerRow } from '../components/PlayerItems';
import { usePlayers } from '../store/players';
import { useImpostor } from '../store/impostor';
import { useT } from '../i18n';
import { CATEGORIES } from '../data';
import { maxImpostors } from '../games/impostor/logic';
import { GAME_PATH, MAX_NAME_LENGTH, MIN_PLAYERS, type GameId } from '../games/shared/players';
import './Players.css';

const isGameId = (v: string | null): v is GameId => v === 'impostor' || v === 'verdad-o-reto' || v === 'yo-nunca';

export function Players() {
  const navigate = useNavigate();
  const t = useT();
  const [params] = useSearchParams();
  const juego = params.get('juego');
  // Desde el chip "Editar" no hay juego elegido: se configura Impostor, como en el diseño.
  const game: GameId = isGameId(juego) ? juego : 'impostor';

  const { players, impostorCount, category, addPlayer, removePlayer, setImpostorCount, setCategory } = usePlayers();
  const startImpostor = useImpostor((s) => s.startGame);
  const min = MIN_PLAYERS[game];

  const start = () => {
    if (game === 'impostor') startImpostor(players, impostorCount, category);
    navigate(GAME_PATH[game]);
  };

  return (
    <main className="screen players">
      <Header
        height={60}
        titleSize={20}
        titleAs="h1"
        title={t.players.title}
        action={{ icon: ChevronLeft, label: t.common.back, onClick: () => navigate('/') }}
        right={
          <Stamp rotate={-5} size={12} style={{ marginRight: 4 }}>
            {t.games[game]}
          </Stamp>
        }
      />

      <Panel className="players__add">
        <TextField
          label={t.players.addLabel}
          placeholder={t.players.placeholder}
          addLabel={t.players.addLabel}
          maxLength={MAX_NAME_LENGTH}
          onSubmit={(name) => {
            const error = addPlayer(name);
            return error ? t.players.errors[error] : null;
          }}
        />
      </Panel>

      <Panel grow className="players__cast">
        <div className="players__band tone">
          <span className="players__band-box display">{t.players.cast}</span>
          <span className="players__band-box display" aria-hidden>
            登場人物
          </span>
          <span className="players__min">{t.players.minimum(min)}</span>
        </div>
        <ul className="players__list">
          {players.map((p) => (
            <PlayerRow key={p.id} player={p} onRemove={() => removePlayer(p.id)} />
          ))}
        </ul>
      </Panel>

      {game === 'impostor' && (
        <Panel className="players__settings">
          <div className="players__setting-row">
            <span className="display players__label">{t.players.impostors}</span>
            <Stepper
              value={impostorCount}
              min={1}
              max={maxImpostors(players.length)}
              onChange={setImpostorCount}
              decreaseLabel={t.players.fewerImpostors}
              increaseLabel={t.players.moreImpostors}
            />
          </div>
          <span className="display players__label">{t.players.category}</span>
          <ChipGroup label={t.players.category}>
            {CATEGORIES.map((c) => (
              <Chip key={c} selected={c === category} onSelect={() => setCategory(c)}>
                {t.categories[c] ?? c}
              </Chip>
            ))}
          </ChipGroup>
        </Panel>
      )}

      {players.length >= min ? (
        <Button arrow onClick={start}>
          {t.players.start}
        </Button>
      ) : (
        <DisabledButton>{t.players.needMore(min)}</DisabledButton>
      )}
    </main>
  );
}
