// Game 1: Catch the OJ. Slide the glass left and right. Catch orange juice,
// dodge the broccoli. Three broccoli catches and the game is over.
import { W, H, rect, circle, text, clamp } from '../draw.js';

export default {
  title: 'Catch the OJ',
  hint: 'CATCH OJ, DODGE BROCCOLI',
  create() {
    const s = {
      score: 0,
      over: false,
      lives: 3,
      x: W / 2, // center of the glass
      items: [],
      spawn: 0.4,
      time: 0,
    };
    const GLASS_W = 44;
    const GLASS_Y = H - 34;

    s.key = () => {};
    s.pointer = (x) => {
      s.x = clamp(x, GLASS_W / 2, W - GLASS_W / 2);
    };

    s.update = (dt, keys) => {
      s.time += dt;
      const dir = (keys.has('ArrowRight') ? 1 : 0) - (keys.has('ArrowLeft') ? 1 : 0);
      s.x = clamp(s.x + dir * 190 * dt, GLASS_W / 2, W - GLASS_W / 2);

      s.spawn -= dt;
      if (s.spawn <= 0) {
        s.spawn = Math.max(0.35, 0.95 - s.time * 0.01);
        s.items.push({
          x: 16 + Math.random() * (W - 32),
          y: -12,
          bad: Math.random() < 0.25,
          vy: 70 + Math.min(80, s.time * 1.6) + Math.random() * 25,
        });
      }

      for (const it of s.items) {
        it.y += it.vy * dt;
        const caught = it.y > GLASS_Y - 4 && it.y < GLASS_Y + 14 && Math.abs(it.x - s.x) < GLASS_W / 2 + 4;
        if (caught) {
          it.gone = true;
          if (it.bad) {
            s.lives -= 1;
            if (s.lives <= 0) s.over = true;
          } else {
            s.score += 10;
          }
        } else if (it.y > H + 14) {
          it.gone = true;
        }
      }
      s.items = s.items.filter((it) => !it.gone);
    };

    s.draw = (g) => {
      // little stars in the sky
      for (let i = 0; i < 18; i++) rect(g, (i * 53) % W, (i * 37) % (H - 40), 2, 2, '#4b3a7a');

      for (const it of s.items) {
        if (it.bad) {
          circle(g, it.x, it.y - 4, 6, '#3fae49');
          circle(g, it.x - 6, it.y, 5, '#2f8f3a');
          circle(g, it.x + 6, it.y, 5, '#2f8f3a');
          rect(g, it.x - 2, it.y + 2, 4, 8, '#a3d977');
        } else {
          rect(g, it.x - 7, it.y - 8, 14, 16, '#ff9f1c'); // glass of juice
          rect(g, it.x - 7, it.y - 8, 14, 4, '#ffd27a');
          rect(g, it.x + 2, it.y - 14, 2, 8, '#ff5d8f'); // straw
        }
      }

      // the catching glass
      rect(g, s.x - GLASS_W / 2, GLASS_Y, GLASS_W, 22, '#7cc7f5');
      rect(g, s.x - GLASS_W / 2 + 4, GLASS_Y + 4, GLASS_W - 8, 18, '#d9f1ff');
      rect(g, s.x - GLASS_W / 2 + 4, GLASS_Y + 4, GLASS_W - 8, 4, '#ff9f1c');

      text(g, 'SCORE ' + s.score, 8, 12, 8, '#fdf3e1', 'left');
      for (let i = 0; i < s.lives; i++) circle(g, W - 14 - i * 16, 12, 5, '#ff5d8f');
    };
    return s;
  },
};
