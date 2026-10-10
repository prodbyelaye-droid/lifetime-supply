# Portal highlight films — 10 October 2026

Eight short films sit between the existing launch film and interactive portal.
The existing lowercase voice, Geist type, spacing and blue accents are reused.
A horizontally scrollable row keeps eight portrait films from turning into a long
mobile wall. Each opens in a native dialog with the full 9:16 frame and standard
sound, seeking and fullscreen controls. Only a clicked film gets an MP4 source.
Escape/close unloads it and restores focus; hidden tabs pause it; another film
pauses existing playback. Direct MP4 links remain available without JavaScript
and when the player fails. No dependency was added.

## Assets

Source: `/Users/elaye/Desktop/wiki/membership-portal/highlight-films/`.
Only the eight current numbered MP4s and matching covers were used. No archive
versions, edits to the source films, or private portal data were introduced.

- Original: 1080 × 1920, 60 fps; audio present in all eight.
- Web: 720 × 1280, 30 fps, H.264 CRF 23, AAC 128 kbps, fast-start MP4.
- All eight MP4s together: 41,205,340 bytes. No MP4 downloads on page load or scroll.
- Eight lazy-loaded WebP covers: approximately 100 kB together.
- Source durations preserved within one output frame; no cuts or retiming.

## Checks

`node test/offer.cjs` passes unchanged price, date and checkout boundaries.
The existing landing matrix passes at 1440/390 px with reduced motion on/off,
plus no JavaScript, blocked script and failed media variants.

`PLAYWRIGHT_MODULE='/Users/elaye/Desktop/LIFETIME SUPPLY PORTAL BUILD/node_modules/playwright' node test/highlights.cjs`
uses `TEST_URL` (default `http://127.0.0.1:8765`). It checks the rail, all eight
films playing, no eager downloads, native dimensions, keyboard activation,
close/Escape, focus restoration, resource cleanup and failed-player fallbacks.

Local screenshots and check output: `/tmp/lifetime-highlights-review/`.
Native Safari, physical devices and assistive technology were not exercised.

The giveaway build is separate and must not be merged with this pass.

The dedicated film checks also pass at 320 px (normal/reduced motion). The new
section fits; the existing header/hero overflow at that narrow width predates
this change and was left outside this pass. All fallback checks pass.
