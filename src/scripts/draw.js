// Shared drawing bits for the arcade games.
export const W = 320;
export const H = 240;
export const FONT = '"Press Start 2P", monospace';

export function text(g, str, x, y, size = 8, color = '#fdf3e1', align = 'center') {
  g.font = `${size}px ${FONT}`;
  g.textAlign = align;
  g.textBaseline = 'middle';
  g.fillStyle = color;
  g.fillText(str, x, y);
}

export function rect(g, x, y, w, h, color) {
  g.fillStyle = color;
  g.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h));
}

export function circle(g, x, y, r, color) {
  g.fillStyle = color;
  g.beginPath();
  g.arc(x, y, r, 0, Math.PI * 2);
  g.fill();
}

export const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
