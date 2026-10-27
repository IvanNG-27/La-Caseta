import { describe, expect, it } from 'vitest';
import { clampImpostors, maxImpostors, prepareRound, resolveAccusation } from './impostor/logic';
import { createDeck, drawCard } from './shared/random';
import { validateNewPlayer, type Player } from './shared/players';
import { draw, initTruthOrDare, nextTurn } from './verdadReto/logic';
import { initNeverHaveI, nextPhrase, toggleSelected } from './yoNunca/logic';
import { ALL_CATEGORIES, CATEGORIES, impostorPool, impostorWords, neverHaveIPhrases } from '../data';

const players: Player[] = ['Lucía', 'Marcos', 'Ana', 'Dani'].map((name, i) => ({ id: `p${i}`, name }));

describe('contenido', () => {
  it('ninguna categoría de Impostor repite palabras', () => {
    for (const category of CATEGORIES) {
      const words = impostorWords(category);
      expect(new Set(words.map((w) => w.toLocaleLowerCase('es-ES'))).size, category).toBe(words.length);
    }
  });

  it('ninguna palabra está en dos categorías (con "Todas" la categoría sería ambigua)', () => {
    const all = CATEGORIES.flatMap((c) => impostorWords(c).map((w) => w.toLocaleLowerCase('es-ES')));
    expect(new Set(all).size).toBe(all.length);
  });

  it('cada palabra tiene una pista sutil: ni la palabra, ni la categoría, ni otra palabra del juego', () => {
    const low = (s: string) => s.toLocaleLowerCase('es-ES');
    const allWords = new Set(CATEGORIES.flatMap((c) => impostorWords(c).map(low)));
    for (const { word, category, hint } of impostorPool(ALL_CATEGORIES)) {
      expect(hint.trim(), word).not.toBe('');
      expect(low(hint), word).not.toContain(low(word));
      expect(low(word), word).not.toContain(low(hint));
      expect(low(hint), word).not.toBe(low(category));
      expect(allWords.has(low(hint)), `${word} → ${hint}`).toBe(false);
    }
  });
});

describe('contenido de Yo nunca', () => {
  it('frases sin el "Yo nunca" inicial (lo pone la interfaz), en minúscula, con punto final y sin repetir', () => {
    const texts = neverHaveIPhrases.map((p) => p.text);
    for (const text of texts) {
      expect(text, text).not.toMatch(/^yo nunca/i);
      expect(text[0], text).toBe(text[0].toLocaleLowerCase('es-ES'));
      expect(text.endsWith('.'), text).toBe(true);
    }
    expect(new Set(texts).size).toBe(texts.length);
  });

  it('hay frases de los cuatro tipos: hot, cabrón, humor negro y explícita', () => {
    expect(new Set(neverHaveIPhrases.map((p) => p.type))).toEqual(new Set(['hot', 'cabron', 'negro', 'explicita']));
  });

  it('sin explícitas, el mazo entero no tiene ni una; con explícitas, sí entran', () => {
    const sin = initNeverHaveI(false);
    expect(sin.pool.some((p) => p.type === 'explicita')).toBe(false);
    let s = sin;
    for (let i = 0; i < sin.pool.length * 2; i++) {
      expect(s.phrase.type).not.toBe('explicita');
      s = nextPhrase(s);
    }
    expect(initNeverHaveI(true).pool.length).toBe(neverHaveIPhrases.length);
  });
});

describe('jugadores', () => {
  it('rechaza nombres vacíos y repetidos', () => {
    expect(validateNewPlayer(players, '   ')).toBe('empty');
    expect(validateNewPlayer(players, ' ana ')).toBe('duplicate');
    expect(validateNewPlayer(players, 'Eva')).toBeNull();
  });
});

describe('impostor', () => {
  it('stepper: mínimo 1, máximo ⌊(n − 1) ÷ 2⌋', () => {
    expect(maxImpostors(3)).toBe(1);
    expect(maxImpostors(5)).toBe(2);
    expect(maxImpostors(12)).toBe(5);
    expect(clampImpostors(0, 5)).toBe(1);
    expect(clampImpostors(9, 5)).toBe(2);
  });

  it('no repite palabras dentro de la sesión', () => {
    const pool = ['a', 'b', 'c'].map((word) => ({ word, category: 'X', hint: 'h' }));
    let used: string[] = [];
    const seen = new Set<string>();
    for (let i = 0; i < 3; i++) {
      const r = prepareRound({ players, impostorCount: 1, pool, usedWords: used });
      seen.add(r.word);
      used = r.usedWords;
      expect(r.impostorIds).toHaveLength(1);
    }
    expect(seen.size).toBe(3);
  });

  it('"Todas" reúne todas las categorías; la ronda guarda la categoría y la pista de su palabra', () => {
    const pool = impostorPool(ALL_CATEGORIES);
    expect(pool).toHaveLength(CATEGORIES.reduce((n, c) => n + impostorWords(c).length, 0));
    let used: string[] = [];
    for (let i = 0; i < 30; i++) {
      const r = prepareRound({ players, impostorCount: 1, pool, usedWords: used });
      used = r.usedWords;
      expect(impostorWords(r.wordCategory)).toContain(r.word);
      expect(pool.find((e) => e.word === r.word)?.hint).toBe(r.wordHint);
    }
    expect(new Set(used).size).toBe(30); // sin repetir dentro de la sesión
  });

  it('acusación acertada: pillado y +1 a cada inocente', () => {
    const r = resolveAccusation(players, ['p2'], 'p2');
    expect(r).toEqual({ accusedId: 'p2', caught: true, points: { p0: 1, p1: 1, p3: 1 } });
  });

  it('acusación fallida: se libra y +2 al impostor', () => {
    const r = resolveAccusation(players, ['p2'], 'p0');
    expect(r).toEqual({ accusedId: 'p0', caught: false, points: { p2: 2 } });
  });
});

describe('mazos', () => {
  it('no repite cartas hasta agotar el mazo', () => {
    let deck = createDeck(4);
    const drawn: number[] = [];
    for (let i = 0; i < 4; i++) {
      const r = drawCard(deck);
      drawn.push(r.index);
      deck = r.deck;
    }
    expect(new Set(drawn).size).toBe(4);
    expect(drawCard(deck).deck.position).toBe(1); // se baraja de nuevo
  });
});

describe('verdad o reto', () => {
  it('"Otra carta" no pasa el turno; "¡Hecho!" sí', () => {
    let s = draw(initTruthOrDare(), 'reto');
    s = draw(s, 'reto');
    expect(s.turn).toBe(0);
    expect(s.card?.position).toBe(2);
    s = nextTurn(s, 4);
    expect(s).toMatchObject({ turn: 1, phase: 'choose', card: null });
  });
});

describe('yo nunca', () => {
  it('suma puntos a los marcados y limpia la selección', () => {
    let s = initNeverHaveI();
    s = toggleSelected(s, 'p0');
    s = toggleSelected(s, 'p1');
    s = toggleSelected(s, 'p1');
    s = nextPhrase(s);
    expect(s.scores).toEqual({ p0: 1 });
    expect(s.selected).toEqual([]);
    expect(s.number).toBe(2);
  });
});
