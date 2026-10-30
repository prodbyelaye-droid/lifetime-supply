# day-096 stills (opus 096, Sat 31 Oct)

Five real portal pictures for "a day in my workflow", shot from the 075 portal build (`el/75-portal-layout-236` d5d394c,
prebuilt `.next`) against cportal 075's seeded fixture (member "Alex"), at a 1120 px viewport, DPR 2, clip 864 × 540 css px
from 24 px left of and above the anchor. `name.webp` is 864 × 540, `name@2x.webp` is 1728 × 1080.

| file | page | anchor |
|---|---|---|
| briefs | /briefs | the filter row |
| vault | /vault | the h1 |
| your-day | /today | the h1 |
| submit | /briefs/<fixture brief> | the "submit for this brief" card |
| room | /community | the h1 |

Changed on the page before each shot, never in pixels (as opus 102 did for the hero window):
- copy 05 case: sentences and UI labels lowercase; names keep capitals (brief names, Untitled, Dropbox, Elaye, Alex, R&B, MP3/WAV, IG, BPM, days and months).
- STANDING 19: "files" → "samples" beside the vault count.
- the fixture brief's title "Upload fixture brief" → "After hours" (not inside the crop) and its IG handle "@upload_test" → "@alex.beats".
- `DROPBOX_VAULT_PATH` set for the run so the vault count renders.

The real 075 portal still says mixed case and "3,500+ files": the portal lane needs copy 05 and STANDING 19 for these to stay true.
Harness: `membership-portal/builds/outbox/opus/096/harness/` (`start-portal.mjs`, `shots.cjs`).
