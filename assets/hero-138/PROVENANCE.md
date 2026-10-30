# Hero window pictures (opus 138, 31 Oct 2026)

- Source: the same real 075 portal as 102/107/120 (`el/75-portal-layout-236` at `d5d394c`) on cportal 075's fixture (synthetic member "Alex"; no production data). Every 102/107/120 page patch still applies (see `../hero-120/PROVENANCE.md`). Changed on the page before each shot, never in pixels.
- **One picture per window-width band** (critic 136 §2.2), so the window never shrinks the portal much. `index.html` picks the band by viewport:
  | band | landing viewport | portal shot at | crop (css px) | on-screen scale |
  |---|---|---|---|---|
  | d1192 | 1235 px and up | 1440 (four across) | 1192 x 836 | 0.93-1.00 |
  | d884 | 915-1234 | 1112 (three across) | 884 x 620 | 0.93-1.25 |
  | d640 | 701-914 | 853 (two across) | 640 x 449 | 0.95-1.28 |
  | p500 | 465-700 | 504 (phone layout) | 500 x 1000 | 0.82-1.29 |
  | p320 | 320-464 | 324 (phone layout) | 320 x 640 | 0.83-1.28 |
  Vault and guides tabs use a slightly wider portal viewport where their heading starts further right, so the crop stays inside the page.
- **Home mini-cards (critic 136 §2.2-2.3):** every mini-card text is 13.25 px as drawn on desktop (Home's 80% zoom included) and 14.75 px on phone (the card's own 85% zoom is lifted), names a half step up. Smallest text on screen across 320-1920: 12.12 px (`outbox/opus/138/checks/sweep.json`). Cards are wider inside their tiles (tile minus 30 / 36 px) so the bigger text keeps its rows. Desktop: one card height per tile row, the rows sharing the height, so the last row sits on the bottom padding (no dead band). Phone: each card hugs its rows (14 px top and bottom) and sits centred in its tile with 22 px of sky above and below. Mini-card text is left-aligned in every card (mentorship was centred).
- Scripts and full-size masters: `/Users/elaye/Desktop/wiki/membership-portal/builds/outbox/opus/138/` (`harness/shots138.cjs`, `harness/bands.json`, `harness/webp.cjs`, `panels/`).
