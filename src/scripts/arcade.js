// Arcade engine: picks a game, runs the loop, forwards keys and taps.
//
// A game module is an object: { title, hint, create() }.
// create() returns { update(dt, keys), draw(g), key(code), pointer(x, y),
//                    score, over }.  See games/ for three examples.

import catchOj from './games/catch-oj.js';
import matchUp from './games/match-up.js';
import bunnyHop from './games/bunny-hop.js';
import { W, H, FONT, text } from './draw.js';

// Same order as the labels in ArcadeMachine.astro.
const GAMES = [catchOj, matchUp, bunnyHop];

const GAME_KEYS = new Set(['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Space']);

function loadBest(i) {
  try {
    return Number(localStorage.getItem('arcade-best-' + i)) || 0;
  } catch {
    return 0;
  }
}
function saveBest(i, score) {
  try {
    localStorage.setItem('arcade-best-' + i, String(score));
  } catch {
    /* private window: just skip saving */
  }
}

export function startArcade(root) {
  const canvas = root.querySelector('canvas');
  const g = canvas.getContext('2d');
  const picks = [...root.querySelectorAll('[data-game]')];
  const startBtn = root.querySelector('[data-start]');
  const status = root.querySelector('[data-status]');

  const held = new Set();
  let index = 0;
  let mode = 'attract'; // attract | play | over
  let run = null;
  let best = loadBest(index);
  let last = performance.now();
  let blink = 0;

  function select(i) {
    index = i;
    mode = 'attract';
    run = null;
    best = loadBest(i);
    held.clear();
    picks.forEach((b, n) => b.setAttribute('aria-pressed', String(n === i)));
    if (status) status.textContent = GAMES[i].title + ' selected. Press start.';
  }

  function start() {
    run = GAMES[index].create();
    mode = 'play';
    held.clear();
    if (status) status.textContent = 'Playing ' + GAMES[index].title;
  }

  picks.forEach((b, n) => b.addEventListener('click', () => select(n)));
  startBtn.addEventListener('click', start);

  window.addEventListener('keydown', (e) => {
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    // Don't steal keys while someone is typing or focused on a button/link.
    const tag = e.target && e.target.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA') return;

    if (e.code === 'Digit1' || e.code === 'Digit2' || e.code === 'Digit3') {
      select(Number(e.code.slice(-1)) - 1);
      return;
    }
    if (mode !== 'play') {
      if (e.code === 'Enter' && tag !== 'BUTTON') start();
      return;
    }
    if (GAME_KEYS.has(e.code)) e.preventDefault();
    held.add(e.code);
    root.dataset.dir = held.has('ArrowLeft') ? 'left' : held.has('ArrowRight') ? 'right' : '';
    if (!e.repeat) run.key(e.code);
  });
  window.addEventListener('keyup', (e) => {
    held.delete(e.code);
    root.dataset.dir = held.has('ArrowLeft') ? 'left' : held.has('ArrowRight') ? 'right' : '';
  });

  canvas.addEventListener('pointerdown', (e) => {
    if (mode !== 'play') {
      start();
      return;
    }
    run.pointer(...toGame(e), 'down');
  });
  canvas.addEventListener('pointermove', (e) => {
    if (mode === 'play' && e.buttons) run.pointer(...toGame(e), 'move');
  });

  function toGame(e) {
    const r = canvas.getBoundingClientRect();
    return [((e.clientX - r.left) / r.width) * W, ((e.clientY - r.top) / r.height) * H];
  }

  function frame(now) {
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    blink += dt;

    if (mode === 'play') {
      run.update(dt, held);
      if (run.over) {
        mode = 'over';
        if (run.score > best) {
          best = run.score;
          saveBest(index, best);
          run.newBest = true;
        }
        if (status) status.textContent = 'Game over. Score ' + run.score;
      }
    }

    // draw
    g.fillStyle = '#1a1033';
    g.fillRect(0, 0, W, H);
    if (mode === 'attract') {
      text(g, GAMES[index].title.toUpperCase(), W / 2, 70, 14, '#7cc7f5');
      text(g, GAMES[index].hint, W / 2, 110, 8, '#fdf3e1');
      text(g, 'BEST ' + best, W / 2, 140, 8, '#ffd23f');
      if (Math.floor(blink * 2) % 2 === 0) text(g, 'PRESS START', W / 2, 190, 10, '#ff5d8f');
    } else {
      run.draw(g);
      if (mode === 'over') {
        g.fillStyle = 'rgba(26,16,51,0.82)';
        g.fillRect(40, 60, W - 80, 120);
        text(g, 'GAME OVER', W / 2, 90, 14, '#ff5d8f');
        text(g, 'SCORE ' + run.score, W / 2, 120, 10, '#fdf3e1');
        text(g, run.newBest ? 'NEW BEST!' : 'BEST ' + best, W / 2, 142, 8, '#ffd23f');
        if (Math.floor(blink * 2) % 2 === 0) text(g, 'PRESS START', W / 2, 166, 8, '#7cc7f5');
      }
    }
    requestAnimationFrame(frame);
  }

  select(0);
  if (document.fonts) document.fonts.load(`10px ${FONT}`);
  requestAnimationFrame(frame);
}
