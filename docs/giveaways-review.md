# Community giveaways — 10 October 2026

Originally prepared as Job 1 on `codex/community-giveaways-review`.
The owner approved the preview and authorized merging on 10 October 2026.
The video pass was released separately in PR #36.

Added a two-prize section after member testimonials, before Elaye's credits.
It uses the existing lowercase, first-person copy, Geist type, spacing and blue
accents. The two columns become one on phones. Images are local, lazy-loaded
WebP files; no JavaScript or new dependency is needed.

Copy opens: “you back what i'm building. i want to give something back.
real gear, for the people making music in here.”

## Evidence and assets

- Touché completion: wiki `pages/business/touche-giveaway-2026-08-20.md`,
  opening resolution: draw ran, winner sorted, shipping handled (owner confirmed
  26 August). No winner identity or new giveaway is invented.
- Touché product image: Expressive E's official page,
  https://www.expressivee.com/1-touche and its image
  https://expressivee.imgix.net/img/products/touche/touchePro_3-4.png?w=1200&fm=webp
  This is a manufacturer product photograph, not a photo of the shipped prize.
- Strat: the user's actual prize photograph,
  `/Users/elaye/Desktop/wiki/raw/assets/2026-09-21_strat-prize-03.jpg`.
  A resized WebP copy is used; source is untouched.
- `pages/catalog/lifetime-supply.md` and
  `pages/business/the-room-community-build-2026-09-21.md` describe the draw.
  The latest wiki warns that public eligibility and room-only preparations
  conflict. This section links to https://draw.elaye.store/ without restating
  entry terms, dates, odds, future frequency, an unverified winner or outcome.
  The existing time-aware hero draw line remains owned by `lib/offer.js`.

## Verification

Desktop 1440 px, mobile 390 px and narrow 320 px: both images decode, two prize
entries appear, the rules link is correct, the section fits the viewport and
there are no browser exceptions. Repeated with JavaScript disabled. Offer
boundary checks pass. Existing page header/hero overflow at 320 px is outside
this section; full-page 390/1440 layouts fit.

Screenshots: `/tmp/lifetime-highlights-review/giveaways-*.png`.
The owner approved this copy and image choice for release. No draw operation
or external message is part of this change.
