# Applying a new identity to the landing (lifetime.elaye.store)

Branch `brand/seam-1112` (from production `1e9e175`). The seam renders pixel-identical to production (1440 and 390 wide, full page, 0 differing pixels). Every brand value and file now sits behind one of the places below. Do these in order. Never change copy: no text in `index.html`, `api/landing.js` or `lib/offer.js` (his sales lines are never rewritten). Full file:line list: `docs/brand/INVENTORY.md`.

## 1. Mark files: replace in place in `brand/current/` (keep the file names)
Same name, same format, same pixel size, so no reference changes:
1. `brand/current/favicon-1106.png` (64x64 PNG), `brand/current/favicon.ico` (multi-size ICO, 16 px and up), `brand/current/apple-touch-icon.png` (180x180). Bump the cache key: change `?v=1106` to the new date in `index.html:25-26` (attribute values only).
2. `brand/current/og/lifetime-share-1106.jpg` (1200x630 JPG). The og:image alt text at `index.html:17` describes the blob; it is copy, so ask Elaye before changing it.
3. `brand/current/brand-blot-white.webp`, `brand/current/blot/testimonials/*.svg`, `brand/current/blot/colour-review/*.webp`, `brand/current/blot/deep-189.svg`: the blob in its uses. If the new mark has no replacement for one of these, leave the file and list it in the hand-back; do not delete references.
4. `brand/current/blot-video/bv-{keys-768,workflow-1280}.{webm,mp4}` and `-poster.jpg`: the blot clips. Replace all three of a set together (poster = first frame). Code-made only; no image generators.

## 2. Colours: edit `css/brand-tokens.css` only
5. Change values on `:root`. Start with the main ones: `--brand-ink` (175 uses), `--brand-navy-1`, `--brand-sky-1` to `--brand-sky-10`, `--brand-warm-1`. Each family is grouped and commented with its use count; INVENTORY's appendix lists every use of every token.
6. Alpha variants (`--brand-sky-2-a12` = `#0054fd12`): keep the last two hex digits, change the first six to the new base.
7. Every `--brand-*-rgb` triple must equal its hex token (`--brand-sky-1: #bee9fc` with `--brand-sky-1-rgb: 190,233,252`); they feed `rgba(var(--brand-*-rgb),a)`.
8. `css/hero-094.css` keeps 12 literals on purpose (see INVENTORY, Exception): swap them in place. Also not in the token file (swap in place, file:line in INVENTORY section 2): `js/hero-gradient-203.js:8` (white dome), `js/hero-076-cast.js:9` (hero blob colours), `js/l4-portal-hello.js:2` (portal demo blot colours), inline SVG colours at `index.html:106` and `:221`, `<meta name="theme-color">` at `index.html:54`. White/black/greys are not tokens (neutral).

## 3. Type: edit `css/brand-tokens.css` only
9. `--brand-font-text` (body and headings), `--brand-font-display`, `--brand-font-display-wide`, `--brand-font-text-wide`, `--brand-font-text-short`, `--brand-font-label` (Chivo labels). A new webfont: put the woff2 in `fonts/`, add its `@font-face` at the top of `css/brand-tokens.css` (`font-display:swap`), then put its family first in the stack. Check phone (390) for line breaks in the hero heading after any type change.

## 4. Code-drawn marks (not files)
10. Hero blob with a face: `js/hero-076-cast.js` `OUTLINE` (path in a 256 box), `EYE`, `SPLATS`, `COLOURS`; drawn by `js/hero-design.js:38-70`.
11. Portal window menu-bar blob: inline `<svg viewBox="12.96 15.98 230.85 222.41">` at `index.html:103`; day rider blot `<svg viewBox="4 8 92 84">` at `index.html:106`. Replace the `<path>` data only.

## 5. Sky and portal captures
12. Sky: `assets/hero-v1/V1-field.webp` (hero) and `assets/flow-v1/V1-field.webp`, `V1-glow.webp`, `V1-footer.webp` (page sections). Replace in place, same names and sizes.
13. Portal window: once the portal is restyled, re-capture into `assets/l4-portal/` with the same names (`<route>-<light|dark>-<body|side>[@2x].webp`, 1280x800 base, plus `login-light-full[@2x].webp`) and `assets/page-1105/day-*.webp`, `box-*.webp`.

## 6. Prove it
14. Diff against production with the lane tools (loopback only, every other host aborted):
```
node /home/claude/burst/landing-seam/tools/serve.cjs /path/to/prod-worktree 47101 &
node /home/claude/burst/landing-seam/tools/serve.cjs /path/to/your-worktree 47102 &
node /home/claude/burst/landing-seam/tools/capture.mjs http://127.0.0.1:47102 /tmp/new-1440 1440
node /home/claude/burst/landing-seam/tools/capture.mjs http://127.0.0.1:47102 /tmp/new-390 390
node /home/claude/burst/landing-seam/tools/diff.cjs prod-1440.png prod-1440.json /tmp/new-1440.png /tmp/diff-1440.json
```
After a swap the diff is expected to be non-zero; read it by section, and check `scrollWidth` in the capture JSON equals the width (no sideways scroll on phone).
15. `node test/landing.cjs` fails at line 81 on production too (a second video counts against the launch film); same result is parity.
