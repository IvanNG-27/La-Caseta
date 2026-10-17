import { describe, expect, it } from 'vitest';
import { clampImpostors, maxImpostors, mostVoted, prepareRound, resolveRound } from './impostor/logic';
import { createDeck, drawCard } from './shared/random';
import { validateNewPlayer, type Player } from './shared/players';
import { draw, initTruthOrDare, nextTurn } from './verdadReto/logic';
import { initNeverHaveI, nextPhrase, toggleSelected } from './yoNunca/logic';
import { CATEGORIES, impostorWords } from '../data';

const players: Player[] = ['Lucía', 'Marcos', 'Ana', 'Dani'].map((name, i) => ({ id: `p${i}`, name }));

describe('contenido', () => {
  it('ninguna categoría de Impostor repite palabras', () => {
    for (const category of CATEGORIES) {
      const words = impostorWords(category);
      expect(new Set(words.map((w) => w.toLocaleLowerCase('es-ES'))).size, category).toBe(words.length);
    }
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
    const words = ['a', 'b', 'c'];
    let used: string[] = [];
    const seen = new Set<string>();
    for (let i = 0; i < 3; i++) {
      const r = prepareRound({ players, impostorCount: 1, words, usedWords: used });
      seen.add(r.word);
      used = r.usedWords;
      expect(r.impostorIds).toHaveLength(1);
    }
    expect(seen.size).toBe(3);
  });

  it('un empate cuenta como no pillado', () => {
    expect(mostVoted([{ playerId: 'p0', votes: 2 }, { playerId: 'p1', votes: 2 }])).toBeNull();
  });

  it('puntúa: +1 a quien vota al impostor; +2 al impostor si se libra', () => {
    const caught = resolveRound(players, ['p2'], { p0: 'p2', p1: 'p2', p2: 'p0', p3: 'p2' });
    expect(caught.caught).toBe(true);
    expect(caught.points).toEqual({ p0: 1, p1: 1, p3: 1 });

    const escaped = resolveRound(players, ['p2'], { p0: 'p1', p1: 'p0', p2: 'p0', p3: 'p2' });
    expect(escaped.caught).toBe(false);
    expect(escaped.points).toEqual({ p3: 1, p2: 2 });
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
