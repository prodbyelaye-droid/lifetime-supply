# HOMER PASS LAWS (portal.elaye.store) · read before every step

Decided by Elaye, 27 Sep 2026. This pass takes the portal from the White Room palette to the Homer Radio look: off-white paper, black ink, a grey ramp, one amber signal light, flat print surfaces, construction-sheet guides, and a wordmark whose dots power on at sign-in.

It supersedes the colour, chip, radius, shadow and type lines of `design/white-room/PORTAL-LAWS.md` where they differ. Everything else in PORTAL-LAWS still binds: scope (§1), copy (§4), the folder (§6), JS-off public routes, shipping (§8), `portalcheck.py`. If this file and a comp disagree, this file wins. Anything not covered: stop and ask, never guess.

## 0. References (all in this repo)
- `design/homer/homer-radio-reference.jpg`: the Homer Radio construction sheets Elaye picked (Frank Ocean's Homer Radio; logo by Jannis Maroscheck and Tim Lindacher, the dotted "radio" set in Intra). Small mark on guide lines at the top, the mark huge and cropped at the bottom, amber dots running off the edge. Homer's covers sit on off-white #F3F3EC.
- `design/homer/exports/export 2/`: Elaye's own exports from Claude Design. `lifetime-supply-construction-sheet.svg` is the look to match. The `supply-density-*` files are studies; the reference density is the one already in the logo. Nothing new to ship from here.
- `design/homer/exports/headings/`: the nine heading marks as exported (`ç.svg` is a mis-named copy of get-help-from-elaye-transparent; ignore it). The shipped versions already live in `public/brand/headings/`.
- The cleaned kit these came from (C2PA stripped, tight viewBoxes): `~/Desktop/wiki/membership-portal/brand-kit-2026-09-27/`. `public/brand/` is a copy of it.
- Shipped brand files the code uses: `public/brand/logo/lifetime-supply-light.svg`, `-dark.svg`, `lifetime-supply-construction-sheet.svg`, `public/brand/headings/*`. Never redraw or restyle them. Geometry is lifted from these files by script (§7).

## 1. What never changes
- The folder object: `components/folder.tsx`, `app/folder.css`, every `--folder-*` token, its scales, states and paint, in both themes. The tile a folder sits on (`--surface-cover`) follows the palette; the folder does not.
- Gold stays gold (`--gold-400`, `--gold-600`).
- Copy, links, data, logic, `app/admin/**`, `app/api/**`, `lib/**` logic, middleware, Supabase, Stripe (PORTAL-LAWS §1, §4).
- The nav heading marks and the help pill mark, as shipped on 27 Sep.

## 2. Palette, light (measured, WCAG 2.x)
No warm tint (Elaye's live review, 27 Sep): the page and cards are pure white, #FFFFFF. New primitives: `--paper-25 #FFFFFF` · `--paper-50 #FFFFFF` · `--paper-150 #F2F2F2` · `--paper-250 #E6E6E6` · `--graphite-700 #595959` · `--graphite-600 #666666` · `--graphite-400 #9A9A94`. Ink is the logo's `--black-900 #0B0B0B`. The signal light is `--gold-600 #DFAE30`. The secondary pill's fill and border are pure grey too: `#F2F2F2` (= paper-150) and `#D9D9D9` (replaces `--bone-150`/`--bone-300`, deleted — nothing else read them; bone survives only in the folder object).

| semantic token | light value | measured |
|---|---|---|
| --bg-page | paper-50 #FFFFFF | |
| --bg-surface (cards) | paper-25 #FFFFFF | |
| --bg-surface-2, --bg-skeleton, --surface-cover | paper-150 #F2F2F2 | |
| --bg-pressed | paper-250 #E6E6E6 | |
| --bg-band, --bg-toast | black-900 | |
| --text-primary | black-900 #0B0B0B | 19.7:1 page/card · 17.6 surface-2 · 15.8 pressed |
| --text-secondary, --eyebrow | graphite-700 #595959 | 7.0 page/card · 6.3 surface-2 · 5.6 pressed |
| --text-placeholder | graphite-600 #666666 | 5.7 page/card · 5.1 surface-2 (never on pressed: 4.6) |
| --text-disabled | graphite-400 #9A9A94 | no floor (says "not live") |
| --text-on-band / -muted | paper-50 / grey-400 | 19.7 / 7.5 on black-900 |
| --link | = --text-primary, plus --link-underline rgba(11,11,11,.35) | 19.7 |
| --pill-primary-bg / text / hover | black-900 / paper-50 / black-700 | 19.7 |
| --pill-secondary-bg / border | #F2F2F2 / #D9D9D9 (pure grey, replaces bone) | label 15.8 |
| --chip-urgent-bg / text | paper-150 / black-900, plus the LED dot (§6) | 17.6 |
| --chip-neutral-bg / text (Hot, Warm, Cold) | paper-150 / graphite-700 | 6.3 |
| --chip-pick-bg / text (Picked by Elaye) | gold-400 / black-900 | 11.9 |
| --status-new | paper-150 / black-900 | 17.6 |
| --status-review | gold-400 / black-900 | 11.9 |
| --status-sent | transparent, 1px --hairline-strong border / black-900 | 19.7 |
| --status-placed | black-900 / paper-50 | 19.7 |
| --hairline / --hairline-strong | rgba(11,11,11,.12) / rgba(11,11,11,.5) | strong = control edge, 3.5:1 |
| --shadow-card | none | |
| --scrim | rgba(11,11,11,.4) | |
| --guide / --guide-strong (new) | rgba(11,11,11,.10) / rgba(11,11,11,.18) | decoration |
| --led (new) | gold-600 #DFAE30 | decoration |

No blue, brass, umber or warm ink left in any semantic token; bone survives only in the folder object. Primitives nothing reads any more get deleted at the end of H1 (folder tokens exempt). The theme-color fallback in `app/layout.tsx` NO_FLASH and the theme toggle's fallback (`components/theme-toggle.tsx`) become #ffffff.

## 3. Palette, dark (true dark stays)
Page black-900, surface black-800, surface-2 black-700, pressed black-600, text paper-100 (18.4), secondary and eyebrow grey-400 (7.5 page · 6.6 surface-2), placeholder grey-500 (5.8), disabled grey-600. Link = text-primary with --link-underline rgba(244,243,238,.35). Urgent chip black-700 / paper-100 + LED. Neutral chip black-700 / grey-400. Status sent: transparent, border rgba(244,243,238,.5), paper-100 text. Guides rgba(244,243,238,.08) / .14. --led gold-400 #F5C242 (11.9). Measure anything new: body 4.5:1, 24px+ and control edges 3:1.

## 4. Shape and depth: flat print
- Cards: `--bg-surface`, 1px `--hairline`, radius 16, no shadow. Hover on a clickable card: border to `--hairline-strong`, nothing moves, nothing lifts.
- Radii: cards 16 · brief rows 14 · inputs 12 · pills and chips 999.
- Header: solid `--bg-page`, 1px hairline bottom, no transparency, no blur. (Live bug found 27 Sep: the CSS build keeps only `-webkit-backdrop-filter`, so Chrome and Firefox get no blur and page content ghosts through the 96% bar.)
- Footer: `--bg-page` with a hairline top, no surface-2 band.
- The profile "your plan" black block stays black. The toast keeps its shadow (the one floating thing).

## 5. Grid: one left edge
- `--gutter: clamp(24px, calc(8.381vw - 8.686px), 112px)`. One container, `max-width: 1440px`, centred, `padding-inline: var(--gutter)`, used by the header bar, `main` and the footer.
- The wordmark's left edge = every page title's left edge = the first card's left edge. Today the header sits at 48px, home content at 112 and every other page at 127 in a 1470 window.
- Home drops its bleed. `.wr-home { width: 100vw; margin-inline: calc(50% - 50vw) }` is what gives / and /today a sideways scroll (measured 27 Sep: scrollWidth 1462 vs clientWidth 1455). No `100vw` used for a layout width anywhere.
- The header stays one row at 390; the phone menu is unchanged.

## 6. Type and marks
- Geist stays the face for everything.
- Add Geist Pixel Circle for NUMBERS ONLY, 36px and up only (Elaye's live review, 27 Sep: at 15px the dotted face reads as faded text): `import { GeistPixelCircle } from "geist/font/pixel"` (already in the installed geist package), variable `--font-geist-pixel-circle` on `<html>`, one weight (500), `font-synthesis: none`, tabular numerals, utility `.num-px`. Where: the home stats numerals and their count-up. Everything smaller stays Geist with tabular numerals, utility `.num-tab`: the digits in "day N in the room", date lines ("Sunday 27 September", changelog dates), step numbers (01 02 03 on submissions, guides, any numbered list), changelog counts. Never headings, body, buttons, nav, chips or eyebrows. Relative times ("posted 4 days ago") stay Geist.
- Eyebrows: Geist 500, 13px (12 on a phone), `--eyebrow`, led by a 6px `--led` dot (`::before`, 8px gap, centred on the x-height).
- The LED dot appears in exactly three places: eyebrows, the Urgent chip, the nav's pending indicator (was gold; now `--led`).
- Links: ink. Prose links underlined at rest (1px, offset .22em, `--link-underline`). Action links ending in " ›" underline on hover and focus only. Transition `text-decoration-color .15s`.

## 7. The wordmark power-on (the dots fade in at sign-in)
Facts (checked 27 Sep): `lifetime-supply-light.svg` and `-dark.svg` share viewBox `-2 -147.8 1176.28 193.54`, one path ("lifetime", gradient #0b0b0b→#1c1c1c light, #f4f3ee→#e4e3de dark) and 385 dots (r 3.24) in 56 `<g>` columns sitting on 61 slots, x = 629.04 + 9n (n = 0..60), with n = 10, 22, 34, 46 and 49 empty (the letter gaps). Each column has one fill, stepping #1c1c1c→#8c8c8c in light and #e4e3de→#858585 in dark. The geometry is identical in both files; only the fills differ.
- `scripts/build-wordmark.mjs` reads both files and writes `components/brand-geometry.ts` (header "generated by scripts/build-wordmark.mjs, do not edit": viewBox, path d, gradient stops per theme, columns as `{ x, ys, light, dark }`). Run it, commit the output. The hex values live in this .ts data file only; portalcheck's raw-hex rule covers .tsx.
- `WordmarkLive` in `components/brand.tsx`: ONE inline SVG (not two), `role="img"`, `<title>lifetime supply</title>`. Gradient id from an explicit `idPrefix` prop (`${idPrefix}-g`), so two on a page never collide. Stops and column fills read CSS vars (`--l` and `--d` set per column in the style attribute, picked by `[data-theme]`). Each column is `<g class="wm-col" style="--c: n">`. Props: `idPrefix`, `variant: "full" | "dots"`, `intro?: boolean`.
- Motion: `.wm-col` runs `wm-dot-on 420ms var(--ease-out) backwards`, delay `calc(140ms + var(--c) * 14ms)`, so the last column lands at about 1.35s. Keyframes: 0% {opacity:0} · 55% {opacity:1} · 68% {opacity:.45} · 100% {opacity:1}: each column switches on like an LED with one flicker, left to right. The "lifetime" path never animates. Opacity only: no transform, no filter. Under prefers-reduced-motion nothing animates and every dot shows.
- When:
  - `/login`: every load, CSS only, so it runs with JS off. The bar mark and the band mark (§8) render with `intro`.
  - The first portal page of each visit. Both sign-in paths (the `/auth/callback` redirect, which goes to "/" or its `next` path, and the `#access_token` fragment in `app/login/fragment-session.tsx`, which goes to "/") land on a portal page in that tab, so "first portal page of the tab" is the sign-in moment. Extend the root layout's pre-paint NO_FLASH script: if `sessionStorage["ls-intro"]` is unset, set it and put `data-intro` on `<html>`, removed again after 1.6s. Wrap in try/catch: blocked storage means no intro, never an error. CSS: `html[data-intro] .portal-header .wm-col { … }`. Client-side navigation never replays it.
- Where the inline mark is used: the portal header, the login bar, the login band, the home ghost. Footer, not-a-member and changelog keep the `<img>` BrandArt (no DOM cost where nothing moves).
- Home ghost: `variant="dots"` (the 56 columns, no path) on the right of the hero, height about 1.15× the hero title block, cropped by the content column's right edge (`overflow: clip` on the hero, never on the page), group opacity .09 light and .12 dark, `aria-hidden`, `pointer-events: none`, 1024px and up only. It powers on with the header when `html[data-intro]` is set.

## 8. Login = the construction sheet
Built from the lower block of `public/brand/logo/lifetime-supply-construction-sheet.svg` (the huge cropped mark at `translate(-840.74 1564) scale(3.7037)` and the guide lines drawn for it), minus every filter (no grain, mottle, roughen or vignette, per PORTAL-LAWS §7) and minus the sheet's paper rect (the page is the paper).
- Rows: the bar (72) · the content (1fr: folder with lock at 0.78, "members only.", the line, the form, the footnote, all unchanged) · the band `clamp(132px, 26vh, 300px)`.
- Band: `WordmarkLive intro variant="full"`, mark height = band height × 1.25, left edge on `--gutter`, placed so about 18% of the mark (the descenders) is cut off by the band's bottom edge, running off the right edge so the dots cut out mid-"supply", as in the Homer crop. `overflow: clip`.
- Guides in the band: the baseline in `--guide-strong`; x-height and ascender lines in `--guide`, full band width; vertical stem lines at the sheet's positions for the big mark, `--guide`, 60% of the band height.
- The folder's caption wordmark comes out. The bar and the band carry the mark; a third is noise.
- 390: band 132, mark 165 tall ("lifeti…" shows). Dark: the marks turn light and the guides use the dark tokens.
- JS off: identical (server-rendered SVG plus CSS).

## 9. Page-title guides
Retired 27 Sep 2026 (Elaye): no guide lines on headings.

## 10. Motion
- Keep: the section reveal (0.45s, 12px, 60ms stagger), folder-in, the count-up, the nav pending dot (now `--led`).
- Add: the theme toggle crossfades with `document.startViewTransition` (180ms, root only). Where it's unsupported or reduced motion is on, the swap is instant.
- No scroll-jacking, no parallax, no GSAP or Lenis.

## 11. Gates, every step
- `python3 design/white-room/portalcheck.py` prints PASS and `npm run build` succeeds.
- Screenshots at 1440 and 390, light and dark: home, the board, my submissions, login.
- A contrast table for every pair in §2 and §3, from a script, pasted into the report.
- No sideways scroll: `document.documentElement.scrollWidth === clientWidth` on /, /today, /briefs and /login at 1440 and 390.
- A reduced-motion screenshot of /login shows every dot. /login renders fully with JS off.
- Shipping: branch `homer` off the latest main. Commit and push after every step. The first push opens the PR "Homer pass". Elaye merges. Report the NEW commit SHA and its Vercel preview URL. Never use Vercel Redeploy.
