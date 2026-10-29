# La Caseta Game — juegos de fiesta (estilo Manga)

Impostor, Verdad o reto y Yo nunca, pasando un único móvil. Implementa la *Especificación de diseño · Estilo Manga v1.0*.

**App web:** https://ivanng-27.github.io/La-Caseta/ — se puede instalar en el móvil ("Añadir a pantalla de inicio") y funciona sin conexión.

**Tecnología:** React 19 + TypeScript + Vite (PWA), empaquetable como app nativa con Capacitor.

**Publicación:** cada push a `main` pasa los tests y publica la web en GitHub Pages (`.github/workflows/deploy.yml`).

## Comandos

```bash
npm install
npm run dev        # navegador (ver a 390 × 844 con las herramientas de desarrollo)
npm test           # tests de la lógica de los juegos
npm run build      # build de producción en dist/
npx cap add android   # (una vez) genera el proyecto Android; requiere Android Studio
npm run cap:sync      # build + copia a las plataformas nativas
```

## Estructura

```
src/
  styles/        tokens.css (03) · base.css · effects.css (04) · components.css (05)
  theme/         tokens.ts — tokens en formato máquina (3.7)
  components/    Panel, Header, Buttons, Form, PlayerItems, GameItems, fx (efectos 04), FitText, ConfirmDialog
  screens/       Home, Players, ImpostorGame, ImpostorVote, ImpostorResults, TruthOrDare, NeverHaveI, Settings
  games/         lógica pura de cada juego (07) + tests
  store/         players.ts y settings.ts (persistentes) · impostor.ts (partida en curso)
  i18n/          textos de la interfaz: es.ts (español), and.ts (andaluz) y va.ts (valencià)
  data/          content.json — palabras, cartas y frases (7.5), separado del código
  hooks/         useCountdown, useExitConfirm
  sound/         clickSounds.ts — sonido al azar al pulsar botones (audios en assets/sonidos/)
```


## Pendiente de decidir (sección 10)

- Vibración (no definida).
- Nativo: ocultar contenido en multitarea y mantener la pantalla encendida (plugins de Capacitor).
