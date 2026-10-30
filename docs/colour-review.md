# Task 01 — local colour-placement options

30 October 2026. Base: `c2f005d6e8d26d78054689cd4dc4461cedc44920`.

Open `/?colour=A`, `/?colour=B` or `/?colour=C`. No parameter retains the assembly design. The task changes presentation only; product copy, checkout destinations and animation JavaScript are untouched.

- **A:** supplied watercolour hero blots; existing 189 price and 005 footer; 037 closing. Other decorative fields are neutralised. Product covers and the launch film retain their own colours.
- **B:** a different source field behind all fourteen top-level sections. Neutral card illustrations remain within the fields. No colour-field source repeats on the page.
- **C:** A plus source-blue (`#0a5ff8`) pointer hover, keyboard focus, expanded questions and controls. No new animation or transition is added.

## B allocation

| Section | Source |
|---|---|
| Hero | 155 — warm field from the scribble interaction |
| Film / flood space | 037 — plum glow |
| Everything inside | 010 — split blend |
| One login | 044 — blue/lilac flow |
| Deep logo tile | 183 — primary green field |
| Stats | 185 — multicolour background strip |
| Features | 145 — light-to-deep blue |
| More | 009 — dark field |
| Portal download | 034 — cyan sky |
| Steps | 170 — pale background fading to white |
| Price and questions | 189 — rose/orange/lilac |
| Contact | 150 — blue/magenta |
| Closing | 192 — light multicolour field |
| Footer | 005 — periwinkle |

## Source and fidelity record

The review package is `~/Desktop/wiki/membership-portal/builds/outbox/codex-design/01-colour-pass-landing-and-portal-home/`.

Eight fields are static 1920 × 1440 renders of the existing `2026-10-29-element-lab/GRADCODE/grad-<id>.js` modules at `deep: 1`; 145 uses t=4 s, 150 t=6 s, the others t=0. A/C retain the assembly's live 189 and 005 modules at its original deep 1.25 setting and transforms.

The other six fields are numeric fits to the original reference crops. `docs/colour-review/model-*.json` records the exact source, crop, foreground masks and Gaussian coefficients. `fit-fields.cjs` and `prepare.cjs` in that folder are provenance snapshots of the generation scripts from the SSD scratch directory; their absolute dependency/source paths are intentional. Run them in an SSD scratch folder with an `assets` subfolder, not inside the source tree.

The four coloured blots are the supplied non-eye Higgsfield assets (037, 150, 183, 189), trimmed and resized to 640 px. Large white decorative blots use the supplied task-018 canonical original with its detached drop removed, resized to 640 px and displayed white through CSS. No generative image work was performed here.

**Not pixel-certified:** GRADCODE itself calls its fields parametric approximations. Source-obscured areas are inferred. Numeric fits omit 009's hard horizontal bars, 034's cloud detail, and 155's granular texture; 189's static field omits the fine source pattern. The existing A/C price retains its assembly grain and line pattern. Fields stretch or crop to their section; original page geometry is not reproduced. Land-book originals are desktop-only, so the 390 version is an adaptation. The reference comparison sheet exposes these differences.

## Motion handoff

**motion: Opus.** Existing clocks, gestures, pause behaviour and scroll geometry remain unchanged. Replacing the coloured hero/white blot artwork hides its old internal SVG morphing while retaining parent movement. A/C desaturate the flood; B hides it behind the new static section fields. B hides old nested field canvases to avoid repeating sources. The closing is a static field in all options. Opus must port original field motion and watercolour deformation after a placement choice; no such animation is claimed here.

The long flood-to-film scroll space remains exactly the assembly's. Top-position full-page screenshots cannot display every scroll-driven phase simultaneously. Product film imagery is content and remains coloured in all options.
