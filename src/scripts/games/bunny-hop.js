// Game 3: Bunny Hop. The bunny runs on its own. Jump over the blocks with
// space or the up arrow. On a phone, tap the screen.
import { W, H, rect, text } from '../draw.js';

const GROUND = H - 40;
const GRAVITY = 900;
const JUMP = -340;

export default {
  title: 'Bunny Hop',
  hint: 'JUMP OVER THE BLOCKS',
  create() {
    const s = {
      score: 0,
      over: false,
      y: GROUND, // feet
      vy: 0,
      blocks: [],
      next: 1.2, // seconds until the next block
      time: 0,
      scroll: 0,
    };
    const BX = 50; // bunny's left edge
    const BW = 20;
    const BH = 24;

    function jump() {
      if (s.y >= GROUND) s.vy = JUMP;
    }
    s.key = (code) => {
      if (code === 'Space' || code === 'ArrowUp') jump();
    };
    s.pointer = (x, y, kind) => {
      if (kind === 'down') jump();
    };

    s.update = (dt) => {
      s.time += dt;
      const speed = 130 + Math.min(120, s.time * 4);
      s.scroll += speed * dt;
      s.score = Math.floor(s.time * 10);

      s.vy += GRAVITY * dt;
      s.y = Math.min(GROUND, s.y + s.vy * dt);
      if (s.y >= GROUND) s.vy = 0;

      s.next -= dt;
      if (s.next <= 0) {
        const h = 16 + Math.floor(Math.random() * 3) * 8;
        s.blocks.push({ x: W + 10, w: 16 + Math.floor(Math.random() * 2) * 8, h });
        s.next = 0.9 + Math.random() * 0.9 - Math.min(0.3, s.time * 0.01);
      }

      for (const b of s.blocks) {
        b.x -= speed * dt;
        // a little forgiveness: shrink the hit areas by 3px
        const hit =
          BX + BW - 3 > b.x + 3 && BX + 3 < b.x + b.w - 3 && s.y > GROUND - b.h + 3;
        if (hit) s.over = true;
      }
      s.blocks = s.blocks.filter((b) => b.x > -40);
    };

    s.draw = (g) => {
      // moving hills for a feeling of speed
      for (let i = 0; i < 4; i++) {
        const x = ((i * 110 - s.scroll * 0.3) % 440) - 60;
        rect(g, x < -60 ? x + 440 : x, GROUND - 38, 70, 38, '#2d2250');
      }
      rect(g, 0, GROUND, W, H - GROUND, '#3b2f63');
      rect(g, 0, GROUND, W, 4, '#7cc7f5');

      for (const b of s.blocks) rect(g, b.x, GROUND - b.h, b.w, b.h, '#7cc7f5');

      // the bunny: body, two ears, an eye
      const top = s.y - BH;
      rect(g, BX, top, BW, BH, '#fdf3e1');
      rect(g, BX + 3, top - 12, 5, 12, '#fdf3e1');
      rect(g, BX + 11, top - 12, 5, 12, '#fdf3e1');
      rect(g, BX + 4, top - 8, 2, 8, '#ff5d8f');
      rect(g, BX + 12, top - 8, 2, 8, '#ff5d8f');
      rect(g, BX + 13, top + 6, 3, 3, '#1a1033');

      text(g, 'SCORE ' + s.score, 8, 12, 8, '#fdf3e1', 'left');
    };
    return s;
  },
};
