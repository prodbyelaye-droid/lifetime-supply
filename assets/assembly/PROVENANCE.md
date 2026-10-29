# Assembly runtime assets

All runtime URLs resolve inside this repository. Reference captures are documentation, never runtime dependencies.

- Sabo Sugi, Abstract Fractal: GLSL copied from the element lab MAT/assets/sabo-shader.js. MIT notice in SABO-LICENSE.txt. MAT1 grading equations copied from MAT/archive/mat1/assets/material.js; preserved as the default config in js/material.js.
- Ribbon geometry and measured motion: MAT/assets/ribbon.js and MAT/assets/wallet-motion.js, retained from the approved 144E lab composition. Its measured edge samples drive the mesh, rather than an invented CSS ribbon.
- THREE r180: local lab modules, upstream MIT notice in THREE-LICENSE.txt; source header retained.
- GSAP 3.14.2: local lab copy; upstream copyright and standard-license URL retained in gsap.min.js.
- Chivo: B4/assets/chivo.woff2; OFL in CHIVO-OFL.txt. Used for the footer profile navigation only. No Apple font files bundled.
- deep-field.png: raster capture of the actual 183R procedural landscape canvas, B1R/row-183. The accepted landscape palette is distinct from the MAT1 shader palette. Its source field was static; the foreground blot has restrained motion.
- blot.png, logo.svg, ig-avatar.png and kit covers: existing ELAYE assets. Kit covers resized to 420px without changing artwork.
- material-still.jpg / ribbon-still.jpg: generated from this assembly's actual shader and ribbon for no-JS / unavailable-WebGL fallback.

## Fix round 1 (29 October)

- The ribbon renderer and its script tag are removed from the runtime. Earlier ribbon assets/source evidence remain archived in place, unused.
- V02 world-space scaling expression comes from `MAT/VAR/assets/fluid.js`; defaults 1.35 and 0.5 come from `MAT/VAR/assets/studies.js` (02-scale / 03-speed).
- Hero cloud is a feather mask over that existing material, per DIRECTION's 20:41 written instruction. Hero blot remains the single replaceable existing asset.
- Deep contour uses overlapping transformed copies of the existing blot; source 183R scale/rotation is slowed into continuous breathing. This is an adaptation, not a new simulation.
- Flow keeps the original row-011 paths and adds offset strokes/feathering; capsule surfaces extend row-014 CSS using only MAT1/034/185 stops.
