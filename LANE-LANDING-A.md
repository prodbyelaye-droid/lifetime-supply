# LANE · LANDING A (Q4 · LANDING A) · stopping point, Sat 28 Nov 2026

Repo: prodbyelaye-droid/lifetime-supply. Brief: Q4-LANDING-A.md + SHIP-ROUTE.md (four PRs, in order).
Session branch (this file, captures, tools): `claude/quirky-johnson-mbiabm`.

## Done: all four PRs merged, production READY, live checked on https://lifetime.elaye.store/
| PR | Card | Branch, final head | Squash on main | Live check |
|---|---|---|---|---|
| #41 | Q3 · L05 · seventh card (310 px in column 3) | q3/l05 fbd8afe | 63dab00 | 12:40 UTC 27 Nov |
| #44 | Q3 · QC17 · L08 a day in my workflow (lane crop, one rim, 1:1 at 390) | q3/qc17 0f71be5 | 76bce53 | 12:56 UTC 27 Nov |
| #45 | Q3 · QC21 · L12 artists (B&W 272 px photos, names whole, fade on photos, subline 17) | q3/qc21 847952e | 8d8da59 | 13:32 UTC 27 Nov |
| #46 | Q3 · QC22 · L13 what our members say (15 px text, 16 px margin, gap crops, 173's fade) | q3/qc22 9f7162b | 9fd9b77 | 18:39 UTC 27 Nov |
Each PR has RELEASE CHECK · PASS on its final head, Bugbot clean, and a "MERGED <sha> · live checked" comment.
Main after this lane: 9fd9b77.

## Open PR: none. Nothing unpushed. HOLD 00:42 Sydney 28 Nov, RESUME ~05:14 Sydney; #46 finished after RESUME.

## Next (not started; each needs its own card)
- T8 (headline about 3x body, no 6x jump): not done in L08/L12/L13. The 56/58 h2 is the page's shared heading size, so a fix is a page-wide type decision.
- L13 K6: "see all 79" keeps its words (words stay). Renaming it is a copy call for Elaye.
- L12: where the source face is small (Glokknine, Lil Poppa, KCAMP, SSG Splurge, YK Osiris and others), the 272 px floor keeps the crop wider than head-and-shoulders. ONEFOUR is a group photo. Tighter crops need larger source photos.
- L13: twelve long-line cards behind "see all" (page positions 27-76) fill the column at 12-15 px text. Some story-sourced screenshots (s-series) carry marks from their own sources.
- L08: the white square right of "morning" (decoration, aria-hidden) was not named on the card. In-between widths (900-1439) cut a card mid-text; only 1440/390 are judged.
- #45 SHOULD: the 10-a-second name check could pause while motion is paused (small cost, left as is).

## Where things are
- Captures (before = local main, after = local branch; 1440 @1x, 390 @2x): `q3-captures/` on this branch.
- Tools used (run from a scratch dir; Playwright + a Python venv with opencv-python-headless<5, pillow, numpy):
  - `q3-tools/serve.cjs <repo> <port>` serves the landing like test/landing.cjs.
  - `q3-tools/cap.cjs <url> <selector> <width> <out.png> [dsf] [wait]` takes the element captures.
  - `q3-tools/faces.py` + `grade.py`: the L12 photo standard (specs in `q3-tools/specs/l12-*.json`).
  - `ms_measure.py`, `ms_font3.py`, `ms_crop.py`: the L13 crops (specs in `q3-tools/specs/l13-*.json`). Card 58 (say-sdf15-1) and say-s5071-m0 were finished by hand after ms_crop.py; see the 9f7162b commit message.
  - `lines.cjs`, `rules.cjs`, `steps.cjs`: helpers for measuring and checking.
