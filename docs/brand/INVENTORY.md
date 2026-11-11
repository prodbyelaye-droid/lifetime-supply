# Landing brand inventory (lifetime.elaye.store)

Base: production commit `1e9e175` (11 Nov 2026). Branch: `brand/seam-1112`. Made 12 Nov 2026 by the landing-seam lane.
Values are the production values. "Was" paths are where the file lived at `1e9e175`; "now" is where it lives on this branch.
`docs/` is not deployed (see `.vercelignore`), so this file never ships.

## 1. Mark files (moved into `brand/current/`, references updated, bytes unchanged)

| now | was | referenced at (on branch) | what it is |
|---|---|---|---|
| `brand/current/favicon-1106.png` | `/favicon-1106.png` | `index.html:24` `<link rel="icon" ... sizes="64x64">` | 64 px favicon (blob) |
| `brand/current/favicon.ico` | `/favicon.ico` | `index.html:25` (`?v=1106`); `vercel.json` route `/favicon.ico` | 32 px favicon |
| `brand/current/apple-touch-icon.png` | `/apple-touch-icon.png` | `index.html:26` (`?v=1106`); `vercel.json` route `/apple-touch-icon.png` | iOS home-screen icon |
| `brand/current/og/lifetime-share-1106.jpg` | `assets/launch/lifetime-share-1106.jpg` | `index.html:14` og:image, `:22` twitter:image, `:42` JSON-LD image; alt text `index.html:17` describes the blob | 1200x630 share card |
| `brand/current/brand-blot-white.webp` | `assets/l2-1104/brand-blot-white.webp` | `index.html:235` | white blot (founder/footer area) |
| `brand/current/blot/testimonials/blot-{150,189,212,221,223-frame-0,223-frame-118,223-frame-240,223-frame-360}.svg` | `assets/testimonials/` | `index.html:177` | blot stickers on the members' messages |
| `brand/current/blot/colour-review/blot-{037,150,183,189,canonical}.webp` | `assets/colour-review/` | `css/colour-review.css:4-8,11,32` | blot images used as CSS backgrounds |
| `brand/current/blot/deep-189.svg` | `assets/hero-076/eyeless/deep-189.svg` | `css/colour-flow.css:22` | eyeless blot splat |
| `brand/current/blot-video/bv-keys-768{.webm,.mp4,-poster.jpg}`, `bv-workflow-1280{.webm,.mp4,-poster.jpg}` | `assets/blot-1104/` | `index.html:107`; `test/landing.cjs:85,86,190,192` | blot clips (sources stay in `assets/blot-1104/src`, not deployed) |

Not moved, because they are not files (code-drawn marks, swap in place):
- `js/hero-076-cast.js:2` `OUTLINE` (the blob silhouette path, 256 box), `:3` `SPLATS` (eyeless splats), `:9` `COLOURS` = `{"v1":"#11B1F8","pink":"#FC82CB","orchid":"#EB7BEF","sun":"#FFC642","lilac":"#A99BF8","coral":"#FFBDA6","mint":"#70F190"}`; `EYE`. Drawn by `js/hero-design.js:38-70` into the hero (the one blot with a face, top left).
- `index.html:103` inline `<svg viewBox="12.96 15.98 230.85 222.41">` (the blob in the portal window's menu bar, `.l4-apple`).
- `index.html:106` inline `<svg viewBox="4 8 92 84">` day-96 rider blot with `linearGradient#day96-blot` stops `#3CC3FE`, `#11B1F8`, `#b6daed`.
- `index.html:221` inline SVG fills `#b601e1 #6a00d8 #7a14e0 #4a0098 #c0307e #0f8f86 #1b9fd8`.
- `js/l4-portal-hello.js:2` `COLOURS` (every blot colour in the portal demo's hello splash; the file says so itself); `js/l4-portal.js:41` the sidebar blob drawn over its picture.
- Unreferenced, left in place: `assets/brand/lifetime-supply-light.svg`, `assets/brand/headings/*.svg` (nothing loads them).

## 2. Colours

- `css/brand-tokens.css` (new, linked first at `index.html:54`): every chromatic colour literal in the 44 stylesheets `index.html` loads, plus the ink `#151517` and its alpha variants, as `--brand-*` custom properties with their exact production values. 182 tokens, 495 replacements; the full file:line list is in the appendix below.
- Main values: ink `#151517` (175 uses, `--brand-ink`), navy `#162236` (27, `--brand-navy-1`), sky `#bee9fc` (15, `--brand-sky-1`), `#0054fd` (12, `--brand-sky-2`), `#c9ecfd` (11), `#11b1f8` (10, the hero blob colour), `#8ddcfd` (9), `#bde8fd` (8), cream `#fbe9d4` (6, `--brand-warm-1`).
- Left as literals (neutral, not brand): `#fff`/`#ffffff` (244), `#000` (99), `#111`, greys (`#41474d #5d646c #5d6066 #3d4247 #3c4048 #707070 #858585 #dedfe2`, blue-grey tints with chroma under 12 %), and the macOS window buttons in the portal mock (`#ff6057 #febc2e #29c840`).
- Page/meta: `index.html:54` `<meta name="color-scheme" content="light">`, `<meta name="theme-color" content="#ffffff">`.
- JS literals (not CSS, swap in place): `js/hero-gradient-203.js:8` white-dome stops `["#fff","#ffffffeb","#ffffff7a","#ffffff00",...]`; `js/hero-076-cast.js:9` (above); `js/l4-portal-data.js:2` `#ffffff`, `#101010`; `js/opening.js:37` `#fff`; `js/colour-review.js:14` builds `/assets/colour-review/field-${ref}.webp`.

## 3. Type

- Font stacks now tokens in `css/brand-tokens.css`:
  - `--brand-font-text` = `-apple-system,BlinkMacSystemFont,"SF Pro Text",system-ui,Roboto,sans-serif` (body and headings; `css/assembly.css:3`, `css/producer-wall.css:6`, `css/headings-078/heading-system.css:2`, `css/copy-082.css:4`, `css/day-096.css:31`, `css/footer-slap.css:2`, `css/config-more-1101.css:39`, `css/main-value.css:5`)
  - `--brand-font-text-wide` = `-apple-system,BlinkMacSystemFont,"SF Pro Text","SF Pro Display",system-ui,"Segoe UI",Roboto,"Helvetica Neue",sans-serif` (`css/l1-1104.css:9`)
  - `--brand-font-display` = `-apple-system,BlinkMacSystemFont,"SF Pro Display",system-ui,sans-serif` (`css/l2-1104.css:80`, footer word)
  - `--brand-font-display-wide` = `-apple-system,BlinkMacSystemFont,"SF Pro Display","SF Pro Text",system-ui,Roboto,sans-serif` (`css/day-096.css:32`)
  - `--brand-font-text-short` = `-apple-system,BlinkMacSystemFont,sans-serif` (`css/evervault-features.css:64`)
  - `--brand-font-label` = `Chivo,monospace` (`css/assembly.css:23,162,164,502,504`)
- Webfont: `css/assembly.css:1` `@font-face{font-family:Chivo;src:url('../assets/assembly/chivo.woff2')...}`. `fonts/geist-*.woff2` and `GeistPixel-Circle.woff2` are only used by the unloaded `css/homer.css`.
- Left alone: `inherit`, `font:inherit`, and `ui-monospace,SFMono-Regular,Menlo,monospace` (one code chip).

## 4. Hero sky / gradient

- Sky field image `assets/hero-v1/V1-field.webp` at `css/hero-v1.css:17`.
- Sky field image `assets/flow-v1/V1-field.webp` at `css/colour-flow.css:4`, `css/flood-choice.css:10`, `css/main-value.css:35`, `css/approved-guides-1102.css:2`, `css/price-1105.css:21`; glow `assets/flow-v1/V1-glow.webp` at `css/colour-flow.css:60`; footer field `assets/flow-v1/V1-footer.webp` at `css/colour-flow.css:63`, `css/landing-polish.css:77`.
- Colour-review fields: `css/colour-review.css:28` `assets/colour-review/field-037.webp`; `js/colour-review.js:14` `field-${ref}.webp`.
- White dome over the sky: `js/hero-gradient-203.js:7-8` (stops and colours), applied as `--hero-white-dome`.
- Launch film: `index.html:100` `assets/launch/lifetime-film.mp4`, posters `lifetime-film-poster-1105.{jpg,webp}` (film, not identity; listed for the rollout).

## 5. Portal window captures

- `index.html:103` sign-in capture `assets/l4-portal/login-light-full.webp` (1100w) and `@2x.webp` (2000w).
- `js/l4-portal-data.js:2` `window.L4P` with `"base":"assets/l4-portal/"` and the route order; `js/l4-portal.js:28` builds `<route>-<theme>-<part>.webp` names; `js/l4-portal.js:170` `${D.base}mentorship-title-card.mp4`. 273 files in `assets/l4-portal/` (light and dark, `-body`/`-side`, 1x and `@2x`).
- `index.html:107-108` and `:114-120` day and box screenshots `assets/page-1105/day-*.webp`, `box-*.webp` (portal screens shown in the page).

## Appendix: every CSS replacement, by token (file:line `was`)
- `--brand-ink` (125): css/assembly.css:670 `#151517`; css/assembly.css:669 `#151517`; css/assembly.css:647 `#151517`; css/assembly.css:637 `#151517`; css/assembly.css:633 `#151517`; css/assembly.css:630 `#151517`; css/assembly.css:559 `#151517`; css/assembly.css:489 `#151517`; css/assembly.css:485 `#151517`; css/assembly.css:477 `#151517`; css/assembly.css:473 `#151517`; css/assembly.css:469 `#151517`; css/assembly.css:463 `#151517`; css/assembly.css:448 `#151517`; css/assembly.css:446 `#151517`; css/assembly.css:413 `#151517`; css/assembly.css:412 `#151517`; css/assembly.css:397 `#151517`; css/assembly.css:387 `#151517`; css/assembly.css:380 `#151517`; css/assembly.css:345 `#151517`; css/assembly.css:329 `#151517`; css/assembly.css:317 `#151517`; css/assembly.css:294 `#151517`; css/assembly.css:293 `#151517`; css/assembly.css:293 `#151517`; css/assembly.css:279 `#151517`; css/assembly.css:272 `#151517`; css/assembly.css:271 `#151517`; css/assembly.css:225 `#151517`; css/assembly.css:212 `#151517`; css/assembly.css:210 `#151517`; css/assembly.css:196 `#151517`; css/assembly.css:195 `#151517`; css/assembly.css:194 `#151517`; css/assembly.css:169 `#151517`; css/assembly.css:168 `#151517`; css/assembly.css:163 `#151517`; css/assembly.css:45 `#151517`; css/assembly.css:2 `#151517`; css/colour-review.css:60 `#151517`; css/colour-review.css:56 `#151517`; css/colour-review.css:55 `#151517`; css/colour-review.css:49 `#151517`; css/colour-review.css:48 `#151517`; css/colour-review.css:31 `#151517`; css/hero-design.css:16 `#151517`; css/hero-design.css:3 `#151517`; css/hero-v1.css:24 `#151517`; css/hero-v1.css:23 `#151517`; css/hero-v1.css:13 `#151517`; css/hero-v1.css:12 `#151517`; css/colour-flow.css:4 `#151517`; css/landing-polish.css:3 `#151517`; css/fernand-rhythm.css:36 `#151517`; css/fernand-rhythm.css:30 `#151517`; css/fernand-rhythm.css:29 `#151517`; css/fernand-rhythm.css:29 `#151517`; css/fernand-rhythm.css:28 `#151517`; css/headings-078/heading-system.css:2 `#151517`; css/copy-082.css:37 `#151517`; css/copy-082.css:22 `#151517`; css/copy-082.css:4 `#151517`; css/hero-094.css:90 `#151517`; css/hero-094.css:83 `#151517`; css/hero-094.css:45 `#151517`; css/hero-094.css:41 `#151517`; css/hero-094.css:40 `#151517`; css/hero-094.css:27 `#151517`; css/hero-094.css:10 `#151517`; css/day-096.css:6 `#151517`; css/hero-129.css:34 `#151517`; css/hero-129.css:15 `#151517`; css/hero-147.css:15 `#151517`; css/hero-147.css:14 `#151517`; css/hero-147.css:9 `#151517`; css/studio-film-1101.css:12 `#151517`; css/studio-film-1101.css:11 `#151517`; css/config-more-1101.css:30 `#151517`; css/config-more-1101.css:21 `#151517`; css/config-more-1101.css:9 `#151517`; css/founder-selected-1101.css:81 `#151517`; css/founder-selected-1101.css:11 `#151517`; css/downloads-017.css:5 `#151517`; css/main-value.css:67 `#151517`; css/main-value.css:47 `#151517`; css/main-value.css:4 `#151517`; css/owner-design-corrections-1102.css:53 `#151517`; css/owner-design-corrections-1102.css:43 `#151517`; css/owner-design-corrections-1102.css:25 `#151517`; css/owner-design-corrections-1102.css:24 `#151517`; css/owner-design-corrections-1102.css:21 `#151517`; css/owner-design-corrections-1102.css:14 `#151517`; css/owner-design-corrections-1102.css:11 `#151517`; css/blot-video-1104.css:30 `#151517`; css/l1-1104.css:83 `#151517`; css/l1-1104.css:30 `#151517`; css/l1-1104.css:10 `#151517`; css/l1-1104.css:7 `#151517`; css/l4-portal.css:98 `#151517`; css/l4-portal.css:88 `#151517`; css/l4-portal.css:34 `#151517`; css/l4-portal.css:33 `#151517`; css/l4-portal.css:32 `#151517`; css/l4-portal.css:31 `#151517`; css/l4-portal.css:20 `#151517`; css/content-1105.css:8 `#151517`; css/content-1105.css:3 `#151517`; css/system-1105.css:206 `#151517`; css/price-1105.css:298 `#151517`; css/close-white-1106.css:7 `#151517`; css/close-white-1106.css:7 `#151517`; css/close-white-1106.css:5 `#151517`; css/close-white-1106.css:3 `#151517`; css/copy-1106.css:66 `#151517`; css/copy-1106.css:65 `#151517`; css/copy-1106.css:58 `#151517`; css/copy-1106.css:40 `#151517`; css/copy-1106.css:39 `#151517`; css/copy-1106.css:33 `#151517`; css/copy-1106.css:29 `#151517`; css/copy-1106.css:26 `#151517`; css/copy-1106.css:19 `#151517`; css/copy-1106.css:18 `#151517`; css/copy-1106.css:11 `#151517`
- `--brand-navy-1` (27): css/blot-palette.css:73 `#162236`; css/blot-palette.css:71 `#162236`; css/blot-palette.css:69 `#162236`; css/blot-palette.css:67 `#162236`; css/blot-palette.css:61 `#162236`; css/blot-palette.css:59 `#162236`; css/blot-palette.css:57 `#162236`; css/blot-palette.css:55 `#162236`; css/blot-palette.css:49 `#162236`; css/blot-palette.css:47 `#162236`; css/blot-palette.css:45 `#162236`; css/blot-palette.css:43 `#162236`; css/blot-palette.css:37 `#162236`; css/blot-palette.css:35 `#162236`; css/blot-palette.css:33 `#162236`; css/blot-palette.css:31 `#162236`; css/blot-palette.css:25 `#162236`; css/blot-palette.css:23 `#162236`; css/blot-palette.css:21 `#162236`; css/blot-palette.css:19 `#162236`; css/blot-palette.css:13 `#162236`; css/blot-palette.css:11 `#162236`; css/blot-palette.css:9 `#162236`; css/blot-palette.css:7 `#162236`; css/blot-palette.css:3 `#162236`; css/room185-field-1102.css:51 `#162236`; css/price-1105.css:12 `#162236`
- `--brand-sky-1` (15): css/evervault-features.css:10 `#bee9fc`; css/evervault-features.css:3 `#bee9fc`; css/colour-flow.css:77 `#bee9fc`; css/colour-flow.css:42 `#bee9fc`; css/colour-flow.css:19 `#bee9fc`; css/colour-flow.css:9 `#bee9fc`; css/flood-choice.css:10 `#bee9fc`; css/downloads-017.css:82 `#BEE9FC`; css/downloads-017.css:82 `#BEE9FC`; css/downloads-017.css:6 `#BEE9FC`; css/main-value.css:32 `#bee9fc`; css/room185-field-1102.css:4 `#bee9fc`; css/approved-guides-1102.css:2 `#bee9fc`; css/l1-1104.css:37 `#BEE9FC`; css/system-1105.css:198 `#bee9fc`
- `--brand-ink-a14` (11): css/assembly.css:632 `#15151714`; css/assembly.css:632 `#15151714`; css/assembly.css:627 `#15151714`; css/assembly.css:399 `#15151714`; css/assembly.css:392 `#15151714`; css/assembly.css:391 `#15151714`; css/assembly.css:378 `#15151714`; css/assembly.css:376 `#15151714`; css/assembly.css:353 `#15151714`; css/assembly.css:332 `#15151714`; css/assembly.css:318 `#15151714`
- `--brand-sky-3` (10): css/hero-v1.css:17 `#c9ecfd`; css/evervault-features.css:58 `#c9ecfd`; css/evervault-features.css:28 `#c9ecfd`; css/colour-flow.css:74 `#c9ecfd`; css/landing-polish.css:128 `#C9ECFD`; css/landing-polish.css:48 `#c9ecfd`; css/fernand-rhythm.css:31 `#C9ECFD`; css/downloads-017.css:82 `#C9ECFD`; css/downloads-017.css:33 `#C9ECFD`; css/downloads-017.css:6 `#C9ECFD`
- `--brand-sky-4-rgb` (10): css/downloads-017.css:111 `rgba(17,177,248,0)`; css/downloads-017.css:111 `rgba(17,177,248,.86)`; css/downloads-017.css:88 `rgba(17,177,248,.30)`; css/downloads-017.css:83 `rgba(17,177,248,.28)`; css/downloads-017.css:40 `rgba(17,177,248,0)`; css/downloads-017.css:40 `rgba(17,177,248,.86)`; css/downloads-017.css:34 `rgba(17,177,248,.10)`; css/l1-1104.css:20 `rgba(17,177,248,.32)`; css/l4-portal.css:142 `rgba(17,177,248,0)`; css/l4-portal.css:142 `rgba(17,177,248,.75)`
- `--brand-sky-5` (9): css/colour-flow.css:74 `#8ddcfd`; css/colour-flow.css:16 `#8ddcfd`; css/landing-polish.css:128 `#8DDCFD`; css/day-096.css:48 `#8ddcfd`; css/downloads-017.css:82 `#8DDCFD`; css/downloads-017.css:82 `#8DDCFD`; css/downloads-017.css:6 `#8DDCFD`; css/room185-field-1102.css:43 `#8ddcfd`; css/l1-1104.css:38 `#8DDCFD`
- `--brand-font-text` (8): css/assembly.css:3 `-apple-system,BlinkMacSystemFont,"SF Pro Text",system-ui,Roboto,sans-serif`; css/producer-wall.css:6 `-apple-system,BlinkMacSystemFont,"SF Pro Text",system-ui,Roboto,sans-serif`; css/headings-078/heading-system.css:2 `-apple-system,BlinkMacSystemFont,"SF Pro Text",system-ui,Roboto,sans-serif`; css/copy-082.css:4 `-apple-system,BlinkMacSystemFont,"SF Pro Text",system-ui,Roboto,sans-serif`; css/day-096.css:31 `-apple-system,BlinkMacSystemFont,"SF Pro Text",system-ui,Roboto,sans-serif`; css/footer-slap.css:2 `-apple-system,BlinkMacSystemFont,"SF Pro Text",system-ui,Roboto,sans-serif`; css/config-more-1101.css:39 `-apple-system,BlinkMacSystemFont,"SF Pro Text",system-ui,Roboto,sans-serif`; css/main-value.css:5 `-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, Roboto, sans-serif`
- `--brand-sky-4` (8): css/colour-flow.css:74 `#11b1f8`; css/landing-polish.css:128 `#11B1F8`; css/day-096.css:48 `#11b1f8`; css/downloads-017.css:6 `#11B1F8`; css/room185-field-1102.css:42 `#11b1f8`; css/l1-1104.css:3 `#11B1F8`; css/l4-portal.css:112 `#11b1f8`; css/l4-portal.css:62 `#11b1f8`
- `--brand-ink-a1a` (7): css/assembly.css:444 `#1515171a`; css/assembly.css:133 `#1515171a`; css/system-1105.css:205 `#1515171a`; css/boxes-1106.css:5 `#1515171a`; css/copy-1106.css:62 `#1515171a`; css/copy-1106.css:37 `#1515171a`; css/copy-1106.css:16 `#1515171a`
- `--brand-sky-9-rgb` (7): css/downloads-017.css:112 `rgba(60,195,254,0)`; css/downloads-017.css:112 `rgba(60,195,254,.78)`; css/downloads-017.css:41 `rgba(60,195,254,0)`; css/downloads-017.css:41 `rgba(60,195,254,.78)`; css/l1-1104.css:20 `rgba(60,195,254,.16)`; css/l4-portal.css:142 `rgba(60,195,254,0)`; css/l4-portal.css:142 `rgba(60,195,254,.7)`
- `--brand-sky-5-rgb` (6): css/downloads-017.css:113 `rgba(141,220,253,0)`; css/downloads-017.css:113 `rgba(141,220,253,.7)`; css/downloads-017.css:42 `rgba(141,220,253,0)`; css/downloads-017.css:42 `rgba(141,220,253,.70)`; css/l4-portal.css:142 `rgba(141,220,253,0)`; css/l4-portal.css:142 `rgba(141,220,253,.8)`
- `--brand-font-label` (5): css/assembly.css:504 `Chivo,monospace`; css/assembly.css:502 `Chivo,monospace`; css/assembly.css:164 `Chivo,monospace`; css/assembly.css:162 `Chivo,monospace`; css/assembly.css:23 `Chivo,monospace`
- `--brand-ink-rgb` (5): css/founder-selected-1101.css:87 `rgba(21,21,23,0)`; css/founder-selected-1101.css:87 `rgba(21,21,23,.16)`; css/landing-shiny-272.css:26 `rgba(21,21,23,.7)`; css/blot-video-1104.css:12 `rgba(21,21,23,.35)`; css/blot-video-1104.css:12 `rgba(21,21,23,.08)`
- `--brand-navy-3` (5): css/landing-gradient273.css:41 `#20354c`; css/landing-gradient273.css:41 `#20354c`; css/landing-gradient273.css:40 `#20354c`; css/landing-gradient273.css:40 `#20354c`; css/landing-gradient273.css:35 `#20354c`
- `--brand-sky-7` (5): css/assembly.css:447 `#0a5ff8`; css/assembly.css:245 `#0a5ff8`; css/assembly.css:13 `#0a5ff8`; css/assembly.css:3 `#0a5ff8`; css/colour-review.css:2 `#0a5ff8`
- `--brand-warm-1` (5): css/assembly.css:56 `#fbe9d4`; css/assembly.css:21 `#fbe9d4`; css/assembly.css:19 `#fbe9d4`; css/assembly.css:7 `#fbe9d4`; css/assembly.css:2 `#fbe9d4`
- `--brand-ink-a12` (4): css/assembly.css:628 `#15151712`; css/assembly.css:471 `#15151712`; css/assembly.css:393 `#15151712`; css/assembly.css:384 `#15151712`
- `--brand-sky-10` (4): css/hero-094.css:8 `#0564a8`; css/hero-094.css:6 `#0564a8`; css/day-096.css:6 `#0564a8`; css/downloads-017.css:20 `#0564a8`
- `--brand-sky-2` (4): css/evervault-features.css:51 `#0054fd`; css/evervault-features.css:3 `#0054fd`; css/main-value.css:84 `#0054fd`; css/owner-design-corrections-1102.css:17 `#0054fd`
- `--brand-sky-55-rgb` (4): css/l1-1104.css:47 `rgba(7,89,133,.8)`; css/l2-1104.css:61 `rgba(7,89,133,.28)`; css/l2-1104.css:46 `rgba(7,89,133,.35)`; css/l2-1104.css:22 `rgba(7,89,133,.28)`
- `--brand-sky-6` (4): css/assembly.css:21 `#bde8fd`; css/assembly.css:19 `#bde8fd`; css/assembly.css:13 `#bde8fd`; css/assembly.css:2 `#bde8fd`
- `--brand-sky-9` (4): css/landing-polish.css:128 `#3CC3FE`; css/day-096.css:48 `#3cc3fe`; css/downloads-017.css:82 `#3CC3FE`; css/downloads-017.css:6 `#3CC3FE`
- `--brand-violet-1` (4): css/assembly.css:395 `#b601e1`; css/assembly.css:355 `#b601e1`; css/assembly.css:278 `#b601e1`; css/assembly.css:183 `#b601e1`
- `--brand-blue-1` (3): css/colour-flow.css:104 `#7C85F5`; css/blot-palette.css:48 `#7C85F5`; css/downloads-017.css:62 `#7C85F5`
- `--brand-blue-2` (3): css/blot-palette.css:46 `#C4C8FA`; css/downloads-017.css:82 `#C4C8FA`; css/room185-field-1102.css:45 `#c4c8fa`
- `--brand-green-2` (3): css/blot-palette.css:72 `#3CE7B9`; css/room185-field-1102.css:44 `#3ce7b9`; css/price-1105.css:11 `#3ce7b9`
- `--brand-ink-a33` (3): css/assembly.css:271 `#15151733`; css/assembly.css:195 `#15151733`; css/copy-1106.css:31 `#15151733`
- `--brand-ink-a40` (3): css/assembly.css:279 `#15151740`; css/assembly.css:47 `#15151740`; css/copy-1106.css:28 `#15151740`
- `--brand-sky-2-a15` (3): css/evervault-features.css:67 `#0054fd15`; css/evervault-features.css:29 `#0054fd15`; css/evervault-features.css:27 `#0054fd15`
- `--brand-sky-8` (3): css/assembly.css:23 `#b6daed`; css/assembly.css:19 `#b6daed`; css/assembly.css:7 `#b6daed`
- `--brand-violet-2` (3): css/assembly.css:360 `#6a00d8`; css/assembly.css:355 `#6a00d8`; css/assembly.css:346 `#6a00d8`
- `--brand-blue-3` (2): css/blot-palette.css:52 `#4D5298`; css/blot-palette.css:50 `#4D5298`
- `--brand-green-1-a00` (2): css/assembly.css:531 `#13864300`; css/assembly.css:495 `#13864300`
- `--brand-green-3` (2): css/blot-palette.css:76 `#1A6450`; css/blot-palette.css:74 `#1A6450`
- `--brand-ink-a0d` (2): css/assembly.css:392 `#1515170d`; css/owner-design-corrections-1102.css:29 `#1515170d`
- `--brand-ink-a0f` (2): css/assembly.css:627 `#1515170f`; css/assembly.css:384 `#1515170f`
- `--brand-ink-a10` (2): css/assembly.css:633 `#15151710`; css/assembly.css:404 `#15151710`
- `--brand-ink-a18` (2): css/assembly.css:433 `#15151718`; css/assembly.css:359 `#15151718`
- `--brand-ink-a20` (2): css/owner-design-corrections-1102.css:10 `#15151720`; css/owner-design-corrections-1102.css:9 `#15151720`
- `--brand-ink-a66` (2): css/assembly.css:412 `#15151766`; css/assembly.css:280 `#15151766`
- `--brand-ink-a72` (2): css/assembly.css:50 `#15151772`; css/assembly.css:49 `#15151772`
- `--brand-navy-2-a15` (2): css/footer-slap.css:42 `#17273615`; css/footer-slap.css:40 `#17273615`
- `--brand-navy-4` (2): css/evervault-features.css:66 `#263f52`; css/evervault-features.css:64 `#263f52`
- `--brand-rose-1` (2): css/blot-palette.css:12 `#FC82CB`; css/downloads-017.css:61 `#FC82CB`
- `--brand-rose-2` (2): css/blot-palette.css:16 `#834369`; css/blot-palette.css:14 `#834369`
- `--brand-sky-14` (2): css/evervault-features.css:28 `#00c3fd`; css/evervault-features.css:3 `#00c3fd`
- `--brand-sky-15` (2): css/colour-flow.css:47 `#d1e4f0`; css/colour-flow.css:44 `#d1e4f0`
- `--brand-sky-16` (2): css/hero-094.css:8 `#2f52b0`; css/downloads-017.css:20 `#2f52b0`
- `--brand-sky-17` (2): css/hero-094.css:8 `#1c6592`; css/downloads-017.css:20 `#1c6592`
- `--brand-sky-18` (2): css/hero-094.css:35 `#1768a9`; css/hero-094.css:29 `#1768a9`
- `--brand-sky-19` (2): css/landing-gradient273.css:41 `#075abb`; css/landing-gradient273.css:40 `#075abb`
- `--brand-sky-20` (2): css/l2-1104.css:70 `#5fcbfa`; css/l2-1104.css:32 `#5fcbfa`
- `--brand-violet-3` (2): css/blot-palette.css:28 `#7F4281`; css/blot-palette.css:26 `#7F4281`
- `--brand-warm-2` (2): css/blot-palette.css:36 `#FCD16E`; css/room185-field-1102.css:46 `#fcd16e`
- `--brand-warm-5` (2): css/blot-palette.css:40 `#68572E`; css/blot-palette.css:38 `#68572E`
- `--brand-warm-7` (2): css/blot-palette.css:64 `#6F5248`; css/blot-palette.css:62 `#6F5248`
- `--brand-blue-1-a78` (1): css/room185-field-1102.css:37 `#7c85f578`
- `--brand-blue-4` (1): css/assembly.css:324 `#9270c2`
- `--brand-blue-5` (1): css/hero-v1.css:47 `#5439D6`
- `--brand-font-display` (1): css/l2-1104.css:80 `-apple-system,BlinkMacSystemFont,"SF Pro Display",system-ui,sans-serif`
- `--brand-font-display-wide` (1): css/day-096.css:32 `-apple-system,BlinkMacSystemFont,"SF Pro Display","SF Pro Text",system-ui,Roboto,sans-serif`
- `--brand-font-text-short` (1): css/evervault-features.css:64 `-apple-system,BlinkMacSystemFont,sans-serif`
- `--brand-font-text-wide` (1): css/l1-1104.css:9 `-apple-system,BlinkMacSystemFont,"SF Pro Text","SF Pro Display",system-ui,"Segoe UI",Roboto,"Helvetica Neue",sans-serif`
- `--brand-green-1` (1): css/assembly.css:494 `#138643`
- `--brand-green-1-ae6` (1): css/assembly.css:495 `#138643e6`
- `--brand-green-1-af2` (1): css/assembly.css:531 `#138643f2`
- `--brand-green-2-a00` (1): css/room185-field-1102.css:25 `#3ce7b900`
- `--brand-green-2-a85` (1): css/room185-field-1102.css:25 `#3ce7b985`
- `--brand-green-4` (1): css/assembly.css:355 `#0f8f86`
- `--brand-green-5` (1): css/assembly.css:355 `#2f7d3a`
- `--brand-green-6` (1): css/blot-palette.css:68 `#D8FAF1`
- `--brand-green-7` (1): css/blot-palette.css:70 `#A7F4E0`
- `--brand-green-8` (1): css/blot-palette.css:77 `#103E32`
- `--brand-green-9` (1): css/downloads-017.css:82 `#BFF5E6`
- `--brand-ink-a0c` (1): css/owner-design-corrections-1102.css:51 `#1515170c`
- `--brand-ink-a22` (1): css/assembly.css:389 `#15151722`
- `--brand-ink-a24` (1): css/assembly.css:85 `#15151724`
- `--brand-ink-a2e` (1): css/assembly.css:163 `#1515172e`
- `--brand-ink-a30` (1): css/owner-design-corrections-1102.css:54 `#15151730`
- `--brand-ink-a80` (1): css/colour-review.css:49 `#15151780`
- `--brand-ink-a96` (1): css/assembly.css:47 `#15151796`
- `--brand-ink-ac9` (1): css/assembly.css:47 `#151517c9`
- `--brand-navy-2` (1): css/footer-slap.css:2 `#172736`
- `--brand-navy-2-a10` (1): css/footer-slap.css:41 `#17273610`
- `--brand-navy-2-a32` (1): css/footer-slap.css:46 `#17273632`
- `--brand-navy-2-a45` (1): css/footer-slap.css:13 `#17273645`
- `--brand-navy-5-ab8` (1): css/colour-review.css:46 `#081a2ab8`
- `--brand-navy-6` (1): css/landing-polish.css:134 `#1d293d`
- `--brand-navy-7-a12` (1): css/hero-094.css:17 `#14334d12`
- `--brand-navy-8-a22` (1): css/system-1105.css:285 `#16324a22`
- `--brand-rose-1-a00` (1): css/room185-field-1102.css:33 `#fc82cb00`
- `--brand-rose-1-a7a` (1): css/room185-field-1102.css:33 `#fc82cb7a`
- `--brand-rose-10` (1): css/blot-palette.css:58 `#FFE1D7`
- `--brand-rose-11` (1): css/downloads-017.css:82 `#F7C8E6`
- `--brand-rose-3` (1): css/assembly.css:137 `#c98a84`
- `--brand-rose-4` (1): css/assembly.css:355 `#c0307e`
- `--brand-rose-5` (1): css/assembly.css:355 `#c32258`
- `--brand-rose-6` (1): css/assembly.css:488 `#d575a6`
- `--brand-rose-7` (1): css/colour-review.css:28 `#66234f`
- `--brand-rose-8` (1): css/blot-palette.css:10 `#FEC7E8`
- `--brand-rose-9` (1): css/blot-palette.css:17 `#512A42`
- `--brand-sky-1-rgb` (1): css/l1-1104.css:20 `rgba(190,233,252,.42)`
- `--brand-sky-11` (1): css/assembly.css:13 `#62839a`
- `--brand-sky-11-a30` (1): css/assembly.css:55 `#62839a30`
- `--brand-sky-11-a3f` (1): css/assembly.css:21 `#62839a3f`
- `--brand-sky-12-a70` (1): css/assembly.css:21 `#9edbfb70`
- `--brand-sky-12-a80` (1): css/assembly.css:17 `#9edbfb80`
- `--brand-sky-13-a22` (1): css/assembly.css:60 `#71bbf622`
- `--brand-sky-13-a88` (1): css/assembly.css:23 `#71bbf688`
- `--brand-sky-2-a0e` (1): css/evervault-features.css:24 `#0054fd0e`
- `--brand-sky-2-a12` (1): css/evervault-features.css:33 `#0054fd12`
- `--brand-sky-2-a18` (1): css/system-1105.css:199 `#0054fd18`
- `--brand-sky-2-a24` (1): css/evervault-features.css:34 `#0054fd24`
- `--brand-sky-2-a33` (1): css/evervault-features.css:41 `#0054fd33`
- `--brand-sky-21-a14` (1): css/assembly.css:7 `#566d8114`
- `--brand-sky-22-a1a` (1): css/assembly.css:7 `#4667821a`
- `--brand-sky-23` (1): css/assembly.css:11 `#78d4f3`
- `--brand-sky-24` (1): css/assembly.css:13 `#286390`
- `--brand-sky-25` (1): css/assembly.css:13 `#326e90`
- `--brand-sky-26-a5c` (1): css/assembly.css:17 `#49a2f75c`
- `--brand-sky-27` (1): css/assembly.css:19 `#d8f1fe`
- `--brand-sky-28` (1): css/assembly.css:21 `#5b9ce0`
- `--brand-sky-29-a17` (1): css/assembly.css:21 `#758b9e17`
- `--brand-sky-3-aed` (1): css/evervault-features.css:57 `#c9ecfded`
- `--brand-sky-30-a4d` (1): css/assembly.css:23 `#7a94a14d`
- `--brand-sky-31` (1): css/assembly.css:183 `#0029d2`
- `--brand-sky-32-a52` (1): css/assembly.css:269 `#34d0fd52`
- `--brand-sky-33` (1): css/assembly.css:355 `#1b9fd8`
- `--brand-sky-34` (1): css/hero-design.css:6 `#2060ea`
- `--brand-sky-35` (1): css/evervault-features.css:24 `#c8e7f7`
- `--brand-sky-36` (1): css/evervault-features.css:30 `#b8dcf2`
- `--brand-sky-37` (1): css/evervault-features.css:30 `#91b5d2`
- `--brand-sky-38` (1): css/evervault-features.css:31 `#d2ebfc`
- `--brand-sky-39` (1): css/evervault-features.css:31 `#d3e4f2`
- `--brand-sky-4-a00` (1): css/room185-field-1102.css:37 `#11b1f800`
- `--brand-sky-4-a35` (1): css/room185-field-1102.css:37 `#11b1f835`
- `--brand-sky-40-a16` (1): css/evervault-features.css:32 `#0048b816`
- `--brand-sky-41` (1): css/evervault-features.css:66 `#3e586b`
- `--brand-sky-42` (1): css/colour-flow.css:4 `#164a7a`
- `--brand-sky-43` (1): css/colour-flow.css:28 `#076af3`
- `--brand-sky-44` (1): css/colour-flow.css:68 `#58b7e5`
- `--brand-sky-45` (1): css/blot-palette.css:53 `#2F335E`
- `--brand-sky-46` (1): css/producer-wall.css:4 `#16669b`
- `--brand-sky-47-a55` (1): css/hero-094.css:17 `#16527f55`
- `--brand-sky-48` (1): css/day-096.css:6 `#0a8de6`
- `--brand-sky-49` (1): css/day-096.css:48 `#bde9fd`
- `--brand-sky-50` (1): css/footer-slap.css:2 `#c2dfed`
- `--brand-sky-51` (1): css/footer-slap.css:2 `#163fa8`
- `--brand-sky-52` (1): css/downloads-017.css:33 `#D3F0FE`
- `--brand-sky-53` (1): css/downloads-017.css:87 `#DDF3FE`
- `--brand-sky-54-a14` (1): css/owner-design-corrections-1102.css:51 `#1f507214`
- `--brand-sky-55` (1): css/l1-1104.css:3 `#075985`
- `--brand-sky-56` (1): css/l2-1104.css:32 `#a9e2fc`
- `--brand-sky-57` (1): css/l4-portal.css:142 `#CBEEFE`
- `--brand-sky-58` (1): css/price-1105.css:10 `#3581bc`
- `--brand-sky-59` (1): css/price-1105.css:259 `#0a3f78`
- `--brand-sky-6-a44` (1): css/assembly.css:23 `#bde8fd44`
- `--brand-sky-6-abb` (1): css/assembly.css:53 `#bde8fdbb`
- `--brand-sky-6-ac9` (1): css/assembly.css:56 `#bde8fdc9`
- `--brand-sky-6-ad9` (1): css/assembly.css:59 `#bde8fdd9`
- `--brand-sky-60` (1): css/giveaways.css:9 `#d4e7f3`
- `--brand-sky-8-a22` (1): css/assembly.css:23 `#b6daed22`
- `--brand-violet-10` (1): css/blot-palette.css:29 `#4E2950`
- `--brand-violet-4-a47` (1): css/assembly.css:269 `#7008eb47`
- `--brand-violet-5` (1): css/assembly.css:553 `#824dcb`
- `--brand-violet-6-ad9` (1): css/colour-review.css:58 `#321f45d9`
- `--brand-violet-7` (1): css/colour-flow.css:106 `#D778F5`
- `--brand-violet-8` (1): css/blot-palette.css:22 `#F6C4F8`
- `--brand-violet-9` (1): css/blot-palette.css:24 `#EB7BEF`
- `--brand-warm-1-ac9` (1): css/assembly.css:59 `#fbe9d4c9`
- `--brand-warm-10` (1): css/downloads-017.css:82 `#FEE6B8`
- `--brand-warm-2-a00` (1): css/room185-field-1102.css:29 `#fcd16e00`
- `--brand-warm-2-a45` (1): css/room185-field-1102.css:29 `#fcd16e45`
- `--brand-warm-3` (1): css/assembly.css:21 `#fcdf9c`
- `--brand-warm-3-a99` (1): css/assembly.css:53 `#fcdf9c99`
- `--brand-warm-4-a12` (1): css/assembly.css:326 `#6a3b2a12`
- `--brand-warm-4-a14` (1): css/assembly.css:222 `#6a3b2a14`
- `--brand-warm-6` (1): css/blot-palette.css:60 `#FFBDA6`
- `--brand-warm-6-acc` (1): css/room185-field-1102.css:29 `#ffbda6cc`
- `--brand-warm-8` (1): css/blot-palette.css:34 `#FEEABE`
- `--brand-warm-9` (1): css/blot-palette.css:41 `#40351C`

## Exception (12 Nov, 00:53): `css/hero-094.css` keeps its 12 colour literals
Tokenising them changed 24 pixels by 1 colour step at the portal window's edges when a menu-bar menu (File, Edit, View, Window, Help) is open (backdrop-filter repaint over the window's shadow). Production against itself showed 0, so it was the seam; the file is back to its `1e9e175` text. Swap its colours in place (same values as the tokens: the `.portal-preview` frame shadows and the hero-094 sky tints).
