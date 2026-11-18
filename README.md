# ElizabethRose.com

Elizabeth's website, built with her. Astro, hosted on GitHub Pages.

## Status (2026-11-17)

- Added: Astro project with the approved layout (about-me row on top, photo wall below, pink and light blue).
- Added: an old-fashioned arcade cabinet with a 3-game selector (`src/components/ArcadeMachine.astro`, engine in `src/scripts/arcade.js`). Games: Catch the OJ, Match Up, Bunny Hop (`src/scripts/games/`). These replace the Heartlake Rush link. The three games are placeholders chosen by Claude; Elizabeth has not picked them yet.
- Added (2026-11-17): a "More games" row under the arcade with links to Heartlake Rush (LEGO) and CrazyGames. Both open in a new tab and are outside sites, so ads and content on CrazyGames are not ours to control.
- Added: GitHub Pages deploy workflow (`.github/workflows/deploy.yml`).
- Open: photo `alt` text on the wall is generic until Elizabeth says what each picture is.
- Open: the old root `index.html` is superseded by `src/pages/index.astro` and can be deleted.
- Open: in the repo's GitHub Settings, Pages, set Source to "GitHub Actions" before the first deploy.
- Open: add the site to `career-development/docs/SITE_OPS_REGISTRY.md` at launch.

## Run it

```
npm install
npm run dev      # http://localhost:4321/ElizabethRose.com
npm run build    # output in dist/
```

## Adding things

- **A photo:** put it in `src/assets/`, import it at the top of `src/pages/index.astro`, add a line to the `wall` list.
- **A game:** copy a file in `src/scripts/games/`, then add it to `GAMES` in `src/scripts/arcade.js` and its name to `games` in `ArcadeMachine.astro` (same order). The selector shows 3 buttons; a 4th needs a CSS tweak.

## Custom domain

Delete `base` in `astro.config.mjs`, set `site` to the domain, and add `public/CNAME`.
