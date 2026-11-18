// Game 2: Match Up. Twelve face-down cards, six pairs of shapes.
// Arrow keys move the yellow frame, space flips. On a phone, tap a card.
import { W, text } from '../draw.js';

const COLS = 4;
const ROWS = 3;
const CW = 60;
const CH = 52;
const GAP = 8;
const LEFT = (W - (COLS * CW + (COLS - 1) * GAP)) / 2;
const TOP = 40;

const SHAPES = [
  ['circle', '#ff5d8f'],
  ['square', '#7cc7f5'],
  ['triangle', '#ffd23f'],
  ['diamond', '#6fd16f'],
  ['star', '#ff9f1c'],
  ['heart', '#c77dff'],
];

function shuffled() {
  const deck = [...SHAPES.keys(), ...SHAPES.keys()];
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}

function drawShape(g, kind, cx, cy, color) {
  g.fillStyle = color;
  g.beginPath();
  if (kind === 'circle') g.arc(cx, cy, 14, 0, Math.PI * 2);
  else if (kind === 'square') g.rect(cx - 13, cy - 13, 26, 26);
  else if (kind === 'triangle') {
    g.moveTo(cx, cy - 15);
    g.lineTo(cx + 15, cy + 12);
    g.lineTo(cx - 15, cy + 12);
  } else if (kind === 'diamond') {
    g.moveTo(cx, cy - 16);
    g.lineTo(cx + 13, cy);
    g.lineTo(cx, cy + 16);
    g.lineTo(cx - 13, cy);
  } else if (kind === 'star') {
    for (let i = 0; i < 10; i++) {
      const r = i % 2 === 0 ? 16 : 7;
      const a = -Math.PI / 2 + (i * Math.PI) / 5;
      g.lineTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r);
    }
  } else if (kind === 'heart') {
    g.moveTo(cx, cy + 14);
    g.bezierCurveTo(cx - 20, cy, cx - 12, cy - 16, cx, cy - 6);
    g.bezierCurveTo(cx + 12, cy - 16, cx + 20, cy, cx, cy + 14);
  }
  g.closePath();
  g.fill();
}

export default {
  title: 'Match Up',
  hint: 'FIND THE PAIRS',
  create() {
    const s = {
      score: 0,
      over: false,
      deck: shuffled(),
      up: new Set(), // face-up cards (not yet matched)
      matched: new Set(),
      cursor: 0,
      lock: 0, // seconds until a wrong pair flips back
      misses: 0,
    };

    function flip(i) {
      if (s.lock > 0 || s.up.has(i) || s.matched.has(i)) return;
      s.up.add(i);
      if (s.up.size === 2) {
        const [a, b] = [...s.up];
        if (s.deck[a] === s.deck[b]) {
          s.matched.add(a);
          s.matched.add(b);
          s.up.clear();
          s.score += 100;
          if (s.matched.size === s.deck.length) s.over = true;
        } else {
          s.misses += 1;
          s.score = Math.max(0, s.score - 10);
          s.lock = 0.8;
        }
      }
    }

    s.key = (code) => {
      const col = s.cursor % COLS;
      const row = Math.floor(s.cursor / COLS);
      if (code === 'ArrowLeft') s.cursor = row * COLS + ((col + COLS - 1) % COLS);
      else if (code === 'ArrowRight') s.cursor = row * COLS + ((col + 1) % COLS);
      else if (code === 'ArrowUp') s.cursor = ((row + ROWS - 1) % ROWS) * COLS + col;
      else if (code === 'ArrowDown') s.cursor = ((row + 1) % ROWS) * COLS + col;
      else if (code === 'Space' || code === 'Enter') flip(s.cursor);
    };

    s.pointer = (x, y, kind) => {
      if (kind !== 'down') return;
      const col = Math.floor((x - LEFT) / (CW + GAP));
      const row = Math.floor((y - TOP) / (CH + GAP));
      if (col < 0 || col >= COLS || row < 0 || row >= ROWS) return;
      // ignore taps that land in the gaps between cards
      if ((x - LEFT) % (CW + GAP) > CW || (y - TOP) % (CH + GAP) > CH) return;
      s.cursor = row * COLS + col;
      flip(s.cursor);
    };

    s.update = (dt) => {
      if (s.lock > 0) {
        s.lock -= dt;
        if (s.lock <= 0) s.up.clear();
      }
    };

    s.draw = (g) => {
      text(g, 'SCORE ' + s.score, 8, 14, 8, '#fdf3e1', 'left');
      text(g, 'OOPS ' + s.misses, W - 8, 14, 8, '#7cc7f5', 'right');
      for (let i = 0; i < s.deck.length; i++) {
        const x = LEFT + (i % COLS) * (CW + GAP);
        const y = TOP + Math.floor(i / COLS) * (CH + GAP);
        const shown = s.up.has(i) || s.matched.has(i);
        g.fillStyle = s.matched.has(i) ? '#2d2250' : shown ? '#fdf3e1' : '#ff5d8f';
        g.fillRect(x, y, CW, CH);
        if (shown) {
          const [kind, color] = SHAPES[s.deck[i]];
          drawShape(g, kind, x + CW / 2, y + CH / 2, color);
        } else {
          text(g, '?', x + CW / 2, y + CH / 2, 16, '#fdf3e1');
        }
        if (i === s.cursor) {
          g.strokeStyle = '#ffd23f';
          g.lineWidth = 3;
          g.strokeRect(x - 2, y - 2, CW + 4, CH + 4);
        }
      }
    };
    return s;
  },
};
