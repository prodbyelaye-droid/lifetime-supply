# portal page clone (landing fix-sizing-1112, row 11)

Clones a page of the redesigned portal into static markup plus one CSS file of computed styles, the way
`portal-demo/p9/p9-shell-live.css` was made for the board window.

- Portal: lifetime-supply-portal at faf8f47, `scripts/assembly/run.mjs` fixture stack on loopback (fictional records, no .env.local).
- Session: the fixture member (`upload-member@portal-e2e.test`), recording mode on, Sydney time, 1440 x 1400, light then dark.
- `node clone.cjs /today <outdir> your-day` writes `your-day.html`, `your-day.css` (shipped as `your-day-live.css`) and a rects file;
  `node verify.cjs <url-of-clone> your-day-rects.json light|dark` compares every element's box with the portal's.
- Removed before the snapshot: the dev overlay, the new-briefs toast and the sidebar announcement card (the board window's shell has neither).
- Checked 12 Nov: 491 boxed elements, all within 0.6 px of the portal except four inline task labels (1 px); light and dark.
