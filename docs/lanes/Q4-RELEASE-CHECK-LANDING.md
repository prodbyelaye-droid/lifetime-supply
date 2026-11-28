# Q4 · RELEASE CHECK · LANDING · lane file

Stopping point: Sat 28 Nov 2026, 13:21 Sydney (switch prep, MANAGER 6).

## Done
The independent release check for every "Q3 ·" landing PR (brief: RELEASE-CHECK-LANDING.md with SHIP-ROUTE.md). There was one comment per head, and all six PRs are merged.

| PR | Card | Head | Verdict | Sydney |
|---|---|---|---|---|
| #41 | L05 seventh card | fbd8afe | PASS | Fri 22:58 |
| #42 | QC24 L15 price | e49743e | PASS | Fri 22:58 |
| #43 | QC27 L18–L21 end of page | d445ace | PASS | Fri 23:37 |
| #44 | QC17 L08 a day in my workflow | 0f71be5 | PASS | Fri 23:48 |
| #45 | QC21 L12 artists | 43077d0 / 847952e | PASS / PASS | Sat 00:05 / 00:16 |
| #46 | QC22 L13 what our members say | b9bf960 / dc6342b / 9f7162b | FAIL / FAIL / PASS | Sat 00:35 / 00:39 / 05:31 |

#46 failed twice for one MUST FIX: the `say-sdf15-1` crop had lost both member messages and clipped "Delivered". It was re-cropped in 9f7162b and merged as 9fd9b77.

Timeline: HOLD came at 00:40 Sat (Elaye 00:27 via MANAGER 3) and the loop timer was deleted. RESUME came at 05:13 (MANAGER 6), after the 03:00 end of the window, so the loop was not restarted. The #46 9f7162b check was a one-off at LANDING A's request.

## Next
Nothing is open in this lane. No "Q3 ·" PR is open, and main is at 9fd9b77. For a new release check, start a fresh session with the same brief.

Notes for that session:
- Tests are `node test/<each>.cjs` (11 files). There is no build step.
- `scripts/check.cjs` needs Playwright from a Mac path, so it can't run in the cloud.
- `api/landing.js` reads `index.html` from the working directory, so run local renders from the repo root.

## Where things are
- Branch: `claude/compassionate-cannon-lnga4t`. It holds only this file; there are no code changes in this lane.
- Head sha: this file's commit (see `git log -1` on the branch).
- Open PR: none (my lane never opens PRs).
- PR #10 "Retire the raw screenshot chrome" (July) is open but not a Q3 card and was never in scope.
