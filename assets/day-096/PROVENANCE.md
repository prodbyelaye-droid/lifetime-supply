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

## 2026-11-02 — current Briefs image only

The first workflow image now uses `briefs-current-1102.jpg`, an exact byte copy of the manager's actual current fixture capture:

- Source: `/Users/elaye/Desktop/wiki/membership-portal/builds/outbox/manager/2026-11-01-takeover/planning-reset/evidence/MANAGER-TAKEOVER-1102/portal-current-runtime/browser-current/briefs-grid-1440.jpg`
- Source SHA256: `dc5aa5c3d1c76e650d31b85e1dcc71db377a2b8ab798d5b2a3e0a45d83e22908`.
- Portal source freeze: `01dec7e8c490f30e20dcde4107eed4b12f214c40c2bfadb24dffe4cd7d69eae9`; build `yUo9dgKERqjLpCClMIq00`.
- Verified browser layout: CSS1440×1000, five columns. Source file: **2027×1429 image pixels**, due to IAB70% zoom. This is not a1440-pixel raster.
- `portal-current-runtime/browser-current/RUN2-RESULT.json` records the five-column measurements and fixture/run limits. Eleven seeded briefs; not real backend/live inventory proof.
- Existing16:10 frame remains. The scoped CSS viewport shows the upper-left1440×900 source-pixel region, excluding unused canvas and clipping the last100px of the portal viewport. No pixel editing, resizing, generated image or new composition.
- Phone uses this same desktop raster through the existing responsive frame. Phone text readability and current paired visual acceptance remain **UNVERIFIED**; no phone screenshot is invented or substituted.
- The prior075 `briefs.webp`/`briefs@2x.webp` remain retained, unused by this first frame. Other four workflow images retain the historical075 provenance above.

## 2026-11-02 — current Your Day imagery

The Your Day feature and workflow step3 now share exact current01dec7e8 screenshot copies:

- Desktop: `assets/value/today-native-1102.png` from `/Users/elaye/Desktop/wiki/membership-portal/builds/outbox/manager/2026-11-01-takeover/planning-reset/evidence/MANAGER-TAKEOVER-1102/current-mac-app-preparation/implementation/native-captures/today-reset-native.png`. SHA256 `b0c16af8ce3434476bb2649a6a391d77eaad7b94dee68bf860cc82406fcaf749`. Image2880×1722; native titlebar present in source, excluded by CSS crop. Native CSS viewport was not measured.
- Phone-width: `assets/value/today-phone-390-1102.png` from `/Users/elaye/Desktop/wiki/membership-portal/builds/outbox/manager/2026-11-01-takeover/planning-reset/evidence/MANAGER-TAKEOVER-1102/current-mac-app-preparation/implementation/native-captures/today-phone-390.png`. SHA256 `2037b760ee56f77ee4536b5564786e243816375f41b1cc752caa28c18d90ed25`. Image390×844; actual responsive screenshot, not physicalphone proof.
- Both show local sample data and the settled/reset1/4 checklist. No fabricated task/status/date. This does not establish real backend/provider behaviour.
- Feature photo: desktop crop starts(600,760), source width920; phone starts(22,432), width334. Existing168 board-window aspect determines cropped height, inside unchanged1743:2 outer art. This replaces the prior unreadable historical strip.
- Workflow photo: desktop(540,200,2280,1425), phone(22,428,334,208.75), in the unchanged16:10 frame. Native desktop includes checklist/calendar context; phone deliberately shows the checklist and real task actions.
- Images are copied byte-for-byte; no pixels edited or generated. Old075 Your Day assets remain retained. No final landing1440/390 render or owner appearance acceptance is inferred.
