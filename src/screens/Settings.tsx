// Ajustes: tiempo de debate de Impostor, idioma y tema.
import type { ReactNode } from 'react';
import { useNavigate } from 'react-router';
import { ChevronLeft } from 'lucide-react';
import { Header } from '../components/Header';
import { Panel } from '../components/Panel';
import { Burst } from '../components/fx';
import { Chip, ChipGroup } from '../components/Form';
import { APP_NAME } from '../config';
import { useT } from '../i18n';
import { DEBATE_MINUTES_OPTIONS, useSettings, type Language, type Theme } from '../store/settings';
import './Settings.css';

const LANGUAGES: Language[] = ['es', 'and', 'va'];
const THEMES: Theme[] = ['light', 'dark'];

export function Settings() {
  const navigate = useNavigate();
  const t = useT();
  const { debateMinutes, language, theme, sound, setDebateMinutes, setLanguage, setTheme, setSound } = useSettings();

  return (
    <main className="screen screen--scroll settings">
      <Header
        height={60}
        titleSize={20}
        titleAs="h1"
        title={t.settings.title}
        action={{ icon: ChevronLeft, label: t.common.back, onClick: () => navigate('/') }}
        right={
          <span aria-hidden className="display settings__kanji">
            設定
          </span>
        }
      />

      <Section title={t.settings.impostor}>
        <div className="settings__row">
          <span className="display settings__label">{t.settings.debateTime}</span>
          <span className="settings__hint">{t.settings.debateHint}</span>
        </div>
        <ChipGroup label={t.settings.debateTime}>
          {DEBATE_MINUTES_OPTIONS.map((m) => (
            <Chip key={m} selected={m === debateMinutes} onSelect={() => setDebateMinutes(m)}>
              {t.settings.minutesShort(m)}
            </Chip>
          ))}
        </ChipGroup>
      </Section>

      <Section title={t.settings.language}>
        <ChipGroup label={t.settings.language}>
          {LANGUAGES.map((l) => (
            <Chip key={l} selected={l === language} onSelect={() => setLanguage(l)}>
              {t.settings.languages[l]}
            </Chip>
          ))}
        </ChipGroup>
      </Section>

      <Section title={t.settings.theme}>
        <ChipGroup label={t.settings.theme}>
          {THEMES.map((th) => (
            <Chip key={th} selected={th === theme} onSelect={() => setTheme(th)}>
              {t.settings.themes[th]}
            </Chip>
          ))}
        </ChipGroup>
      </Section>

      <Section title={t.settings.sound}>
        <div className="settings__row">
          <span className="settings__hint">{t.settings.soundHint}</span>
        </div>
        <ChipGroup label={t.settings.sound}>
          {([true, false] as const).map((on) => (
            <Chip key={String(on)} selected={on === sound} onSelect={() => setSound(on)}>
              {on ? t.settings.soundOptions.on : t.settings.soundOptions.off}
            </Chip>
          ))}
        </ChipGroup>
      </Section>

      {/* Viñeta de cierre decorativa: absorbe el alto restante. */}
      <Panel grow focusLines className="settings__cover" aria-hidden>
        <Burst width={260} height={120}>
          <span className="display settings__brand">{APP_NAME}</span>
        </Burst>
      </Panel>
    </main>
  );
}

/** Viñeta de sección: banda con trama y título en caja, como la banda "Reparto" de Jugadores. */
function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <Panel className="settings__section">
      <div className="settings__band tone">
        <h2 className="settings__band-box display">{title}</h2>
      </div>
      <div className="settings__body">{children}</div>
    </Panel>
  );
}
