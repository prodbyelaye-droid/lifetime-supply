# Landing, film and current portal fixes

Source request: implement all approved fixes from the 5 October 2026 audit,
use the eight numbered picks in Downloads, and emulate the portal as it is
currently served in the owner's Chrome tab. This branch is for review only.

## Current evidence

- Audit: `/Users/elaye/Desktop/wiki/pages/audits/landing-film-portal-audit-2026-10-05.md`.
- Refreshed and inspected `https://portal.elaye.store/`, `/today`, `/briefs`,
  a brief's submission form, `/submissions`, `/vault`, `/vault/kits`,
  `/mentorship`, `/guides`, and `/community` in the authenticated Chrome tab
  on 5 October 2026. No tasks, progress, settings, submissions or account
  data were changed. No private artist names, member results, account data
  or download links were copied into the public demo.
- The current board uses grouped cards, despite the audit's older local
  source describing rows. Cards remain the correct current reference.
- Home's public all-time changelog counters were 137 briefs added and 148
  submissions in. The board displayed 130+ live briefs. These are dated
  demo snapshots, never today's evergreen sales figures.
- The current classes are **The Producer Blueprint** (18 modules) and
  **The Psychology of the Close** (16). The guide library has six written
  guides and **ELAYE Producer System**, seven entries total. Written class
  modules are a different library. The current source for their titles is
  `/Users/elaye/Desktop/LIFETIME SUPPLY PORTAL BUILD/lib/content.ts:58–204`.
- The current submission form has an optional local audio check, one link,
  BPM/key metadata and an email receipt. Submissions show manual updates,
  the DM promise and an email-notification preference. No automatic route
  to a placement is promised. Passed is an additional possible outcome
  in the portal's status-history implementation, not a required final step.
- The current monthly kit is **Members Only Kit - V1**. Signature kits are
  **Octaves Creator Suite**, **Part Two (Unreleased)** and **Analog Alchemy**.
  All three use the portal's glass folder geometry; Part Two alone has the
  additional frosted cover. It is available to members, unreleased publicly.
- The portal still uses the official dotted supply wordmark. It is retained
  to follow the user's latest current-portal instruction. The film's solid
  supply lockup is not guessed or redrawn; its editable master was not found
  in the supplied sources. Public display figures now use solid Geist.
- Approved film reference: `lifetime-launch-v7-FINAL.mp4`, 00:01–00:05
  (blue unlock and atmosphere), 00:26–00:42 (submission and tracking),
  01:06–01:10 (34 modules, 40 GB+ video and written versions), and
  01:22.500 (6,000+ total, daily briefs, weekly exclusives, monthly kit).
- The public Stripe initialization response for
  `https://buy.stripe.com/6oU5kEaEYgMQ86jbqa9AA03` returned `currency: usd`
  and `amount: 59900` on 5 October. No payment information was entered.

## Audit fixes mapped to this branch

1. Checkout offer mismatch: corrected landing bundle and prepared the exact
   Stripe replacement description below. The live Stripe product is external
   to this repo and has not been changed.
2. Learning value: both class names, real syllabus details, 34 modules,
   video/written distinction, PDFs and all seven real guide/system titles.
3. Fidelity: truthful interactive-preview label, current cards, correct
   metric meanings, complete kit family, local-check explanation, DM and
   email preference. Demo values remain explicitly illustrative or dated.
4. Selling order: complete bundle in the hero and compact contents links;
   final checklist starts with files, kits and learning. The board explains
   link, review, manual tracking and DM. Credentials are separate from
   member outcomes; the original eight testimonials remain verbatim.
5. Numbers: remove 120+ and unsupported today's/countless language; keep
   3,500+ vault and 6,000+ total separate. Remove the unmeasured 70 GB archive
   from the landing. Date manually maintained Muso ranking badges and the
   career-total fallback.
6. Look: picked blue unlock, atmospheric proof surround, picked plates,
   solid public numbers, current official portal mark and glass kit geometry.
7. Mobile: no pinned unlock journey; immediate bundle links, native section
   picker, no nested preview scroller, no fabricated urgent toast. Every
   Your Day column, seven calendar days and all kit entries remain visible.
8. Share: evergreen 1200×630 composition from prompt 7, with the official
   mark and deterministic text. OG/Twitter and structured image agree.
9. Terms: visible USD, rules link and verified current absolute dates.
   Request-time rendering keeps visible price, FAQ, schema and every CTA
   together, including without JavaScript. Open tabs refresh at boundaries.
10. Technical: sales copy never hides behind animation initialization;
    white purchase focus ring; solid nav color; 44px interactive controls;
    muted media loads near the viewport, pauses offscreen and in hidden tabs,
    has global pause controls, and never loads under reduced motion.

## Picked asset provenance

All eight picks were found; none were skipped. Originals were only read.
No image/video generations or paid model calls were made. Generated artwork
contains no new text or logos; all names, numbers and selling copy are HTML.

| Prompt | Exact supplied file in `/Users/elaye/Downloads` | Landing use |
|---|---|---|
| 1 | `prompt one video.mp4` | one-shot blue unlock; cropped background, full object retained; open-state poster |
| 2 | `PROMPT TWO VIDEO.mp4` | atmosphere behind opaque real preview panels; static poster fallback |
| 3 | `PROMPT 3 VIDEO.mp4` | optional vault detail, with actual access mechanics explained in HTML |
| 4 | `PROMPT 4 IMAGE.png` | editorial kit-family plate; real names and current covers remain separate |
| 5 | `PROMPT FIVE.png` | written-learning plate beside both classes and full syllabi |
| 6 | `PROMPT 6.png` | Room plate beside verified member activities |
| 7 | `PROMPT 7.png` | evergreen share-card background |
| 8 | `PROMPT 8.png` | mobile/static hero poster |

H.264 MP4s have no audio and fast-start metadata. Images are WebP; share output
is JPEG. The complete three-video set is 291.9 KiB; posters and picked
stills add 42.3 KiB. Final sizes can be checked in `assets/launch/`.
`design/launch-share.html` is the deterministic source for the share composition.

## Stripe handoff before release

Replace the live product description with:

> my whole setup, one bundle, forever. 6,000+ files and counting, with 3,500+
> files in the vault through Untitled or Dropbox. every signature kit,
> including octaves creator suite, the publicly unreleased part two and analog
> alchemy. a new members-only kit every month. two full mentorship classes:
> 34 modules, 40 GB+ of video, every module written out. seven guides and
> systems, including my Notion producer system. the private members Discord
> and your day. the live brief board, one-link submissions, personal review
> and manual status updates, then i DM you. one payment. yours forever.
> placements are never guaranteed. your rights stay yours.

There is no confirmed included 1:1-call entitlement in the inspected product.
The replacement therefore makes no call, nightly artist-phone or income promise.

The verified schedule is:

- Giveaway closes **10 October 2026, 20:00 AEDT** (`2026-10-10T09:00:00Z`).
- Price rises **11 October 2026, 08:00 AEDT** (`2026-10-10T21:00:00Z`).
- Current verified payment link is **USD 599**. The new **USD 699** payment
  link has not been supplied. Before release, verify its amount, currency,
  bundle description and fulfillment, then set `LIFETIME_CHECKOUT_699_URL`
  in the intended Vercel environment. Retire/schedule the old Stripe link
  at the same deadline. This branch does not change Stripe or Vercel settings.
- Without a valid, distinct new Stripe link, the rendered price still becomes
  USD 699 at the boundary, but every purchase CTA becomes a clearly labelled
  Instagram DM handoff. It never advertises 699 against the old 599 checkout.

## Verification

`node test/offer.cjs` checks the exact price/draw boundaries, USD, structured
price, all four CTA URLs and the missing/unsafe-link fallback.

`test/landing.cjs` uses an installed Playwright package. For this Mac:

```sh
PLAYWRIGHT_MODULE='/Users/elaye/Desktop/LIFETIME SUPPLY PORTAL BUILD/node_modules/playwright' node test/landing.cjs
```

The browser matrix covers 1440×1000 and 390×844, each with reduced motion on
and off; all nine sections; keyboard tabs; mobile selection; complete Your
Day and kit cards; guide names; syllabus details; focus; motion pause and
preference changes; no-JS, blocked-script and failed-media behavior. Screenshots
are written to `/tmp/lifetime-landing-shots`, or `SHOTS_DIR` if set. Set
`TEST_URL` to repeat against a preview URL. It never submits or checks out.

Still outside this review: payment/provisioning, actual inventory bytes and
licenses, Discord activity, native Safari/VoiceOver/physical phones, field
Core Web Vitals, social scraper caches, exact film wordmark master and the
future Stripe payment link. No merge or production deployment is authorized.
