# WHITE ROOM LANDING LAWS (lifetime.elaye.store) · read before every step

Decided by Elaye, 22 Sep 2026. If a comp and a law disagree, the law wins. Anything not covered: stop and ask, never guess.

## 1. Copy
- Every word on main stays, byte-identical. The check is `python3 design/white-room/copycheck.py` and it must print PASS at the end of every step from W2 on (W0 and W1 may show only "font still referenced" and "kept screenshot missing" lines).
- The comps show headings in lowercase and some labels in sentence case. Main's source text is UPPERCASE. Never retype text to match the comp: get the look with CSS only.
  - lowercase: `text-transform: lowercase` on the element.
  - sentence case ("Get lifetime access"): wrap the text in `<span class="sc">`, with `.sc{display:inline-block;text-transform:lowercase}.sc::first-letter{text-transform:uppercase}`.
  - `<br>` positions may move to match the comps. The words between them may not change.
- Retired, allowed to disappear (duplicates or retired UI only): the fixed sale bar and its text, the hero eyebrow "@ELXYEE · THE LIFETIME SUPPLY", the hero line "100+ ACTIVE BRIEFS, UPDATED EVERY DAY", the short hero quote and its "Lifetime member" (the full quote stays in the members section), the marquee, the old footer price block, the footer sign-off "WE WANT HITS NOT BEATS. ALL IT TAKES IS ONE LISTEN.", the footer credit line. Exact strings: allowlist.json "retired".
- New UI text allowed, only these (from the comps Elaye approved): "lifetime supply." wordmark, "What's inside", "Log in", "Get access", "The Lifetime Supply · by ELAYE", "See what's inside ›", "$599 · one payment · yours forever", "Instagram @elxyee", "© 2026 ELAYE". Exact strings: allowlist.json "new_ui". You may add a string to new_ui only if it appears verbatim in a comp; list every addition in your summary.
- Keep "Not ready? Locked In is free. Real lessons from a platinum producer, and first access to every drop." with its link to https://elaye.store/newsletter, as one small line in the new footer band.
- No Terms / Privacy / Refunds links. The pages do not exist yet; the footer leaves them out.
- `<head>` meta, title, JSON-LD, canonical and og/twitter images: untouched.

## 2. Links
- Stripe: https://buy.stripe.com/6oU5kEaEYgMQ86jbqa9AA03 on every checkout element, each keeps `data-checkout`, `target="_blank" rel="noopener"`. That includes the new header "Get access" pill, the hero pill and the price card pill. js/site-config.js stays as it is.
- The one new href: "Log in" → https://portal.elaye.store/login.
- Instagram and newsletter hrefs stay. In-page anchors (#...) are free.
- The two expanders stay `<details>` elements with their summaries "See how the status system works" and "What the guide covers" and their bodies word for word. Style the summary as the blue-600 ghost link with a trailing " ›" added in CSS (::after), and let the body open inside the card.

## 3. Images
- Keep these 9 real screenshots (same files, same alt text, add width/height, loading="lazy"). Show each one inside a screenshot card: white, radius 20, hairline border, --shadow-card, padding 8, image radius 14. No new headings or captions for them.
  - placements-landed.webp, placements-landed-2.webp, images.webp (Untitled app): one row of three screenshot cards directly under the six "everything. day one." cards, above the closing line. Phone: one column.
  - reviews.webp: one wide screenshot card between the "the portal is actually fire." heading and the two fit cards.
  - kit-reviews.webp and the four lifetime-review-pic-mentorship*.webp: one row of five tall screenshot cards between "the members talk." subline and the quote grid. Phone: a horizontal scroll-snap row, cards 240 wide.
- Remove from the page (leave the files in the repo until W4): pic-1 to pic-4, lifetime-deliverables.webp, the inline elaye-banner.webp, channels4_profile.webp, every media/ still and video, the sky layer.
- The folder is CSS only (design/white-room/folder-object.html). No SVG render, no image, no AI or stock imagery anywhere.

## 4. Look
- Tokens: css/tokens.css (from README-tokens.css). Only Geist loads (400/500/600/700). Never Inter, Roboto, Arial, Montserrat, Barlow, Bebas, Instrument Sans.
- No gradients on grounds except the one faint blue floor light behind the hero folder. No glow, no grain, no purple, no em dashes, no emoji in UI. Member quotes keep their original emoji: they are real messages.
- No seat counts, no countdowns, no "spots left".
- Contrast measured: body 4.5:1, display (24px+) 3:1. Touch targets 44px. Header one row at 390.
- The comps are the source of truth for every size, gap, radius and colour. Lift them from the inline styles and convert to classes on the tokens. The PNGs in design/white-room/exports/landing/ are for checking only. In the .dc.html files ignore `<script src="./support.js">`, `{{accent}}` (= #131210) and `<sc-if>`.

## 5. Shipping
- Branch white-room only. Commit AND push after every step. The first push opens the PR "White Room redesign". Never merge, never touch main, never use Vercel Redeploy.
- After each push, confirm Vercel built a preview deployment for the NEW commit SHA and report both.

## 6. Definition of done (every step)
Screenshots at 1440 and 390 next to the matching comp PNG · copycheck output pasted · commit + push · the new SHA and its Vercel preview URL.
