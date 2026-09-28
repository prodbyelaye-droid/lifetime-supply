# lifetime.elaye.store · Homer landing brief (27 Sep 2026)

Read this first. It holds the look, the sections, the two interactive pieces and every word of copy. Elaye's calls (27 Sep): the landing uses the exact design system of the live portal (portal.elaye.store); the copy is rewritten; the lock on the folder breaks as you scroll and the folder opens into a clickable demo portal (guided + clickable, briefs shown as blank cards); the price reads "$599 until Tue 6 Oct, then $699".

## 1. The look (same system as the portal, see HOMER-LAWS.md in this folder)
- Page white #ffffff. Ink #0b0b0b. Secondary text #595959 (7.0:1). Placeholders and meta #666666. Chips and secondary surfaces #f2f2f2, pressed #e6e6e6, hairline rgba(11,11,11,.12), strong hairline rgba(11,11,11,.5). Exact tokens: portal-globals.css (light block).
- One accent: gold. #f5c242 for the "Picked by Elaye" chip and fills; the amber LED dot #dfae30 (6px) sits only before eyebrows, on the Urgent chip, and nowhere else.
- One black band allowed: the price card section (#0b0b0b ground, #f4f3ee text). No other dark sections.
- Type: Geist only (400/500/600/700). Headings 700, lowercase, tight (-0.035em, line-height 0.95). Body 17/1.5. Eyebrows 13px Geist 500, sentence case, LED dot before them. Big numbers (48px and up) in Geist Pixel Circle, a dotted cut of Geist; nothing under 36px uses it.
- Wordmark: brand/logo/lifetime-supply-light.svg (the "lifetime" bold + dotted "supply"). Never redraw it. Its 56 dot columns power on left to right, one flicker each, about 1.3s, when the page loads.
- Heading marks in brand/headings/ (Your day, Briefs, Submissions, Vault, Kits, Mentorship, Guides, The Room) are the demo portal's nav, exactly as the live portal uses them.
- Cards are flat print: white on white, 1px hairline, radius 16, no shadow. Pills 999. Inputs 12.
- The folder is the portal's CSS object (folder-object.html + portal-folder.css): blue by default, gold for kits/The Room, states .has-lock (ink lock badge), .is-open (sheets rise, front tips back). Do not restyle it; animate between its states.
- No gradients on grounds, no glow, no grain, no purple, no em dashes, no emoji in UI (member quotes keep theirs), no stock or AI imagery. No guide lines on headings (retired). The construction-sheet look may appear once: as the band under the price card or the footer (huge cropped wordmark with its guide lines, brand/logo/lifetime-supply-construction-sheet.svg), your call in the comp.
- Contrast: body 4.5:1, 24px+ 3:1. Touch targets 44px. Header one row at 390.
- Reference feel: homer-radio-reference.jpg (Frank Ocean's Homer Radio sheets): paper, black, dots, a mark huge and cropped. Real portal screens: portal-shots/ (artist names blanked, the way the demo must look).

## 2. Page order
1. Header (sticky, solid white, hairline): wordmark · what's inside · the portal · price · Log in · [Get access] pill.
2. Hero: copy left, the LOCKED folder right (big, blue, lock badge).
3. The unlock scene (pinned while scrolling): lock breaks, folder opens, the demo portal rises out of it.
4. The demo portal (guided + clickable).
5. The numbers band.
6. What's inside (cards, each with a small folder).
7. How the board works (four steps + the status pills).
8. The members talk (real quotes + the existing screenshot cards).
9. The credits.
10. For you / not for you.
11. Questions (accordion).
12. The price card (the one black band).
13. Footer.

## 3. The unlock scene
- Start: hero folder, blue, .has-lock, scale about 1.4, sitting right of the hero copy.
- As you scroll (section pinned about 180vh): the shackle lifts and swings open (0 to 30%), the lock badge drops off the folder and fades (30 to 45%), the folder takes .is-open, sheets rise (45 to 60%), then a browser-frame window (the demo portal) rises out of the open folder and scales up to full content width while the folder shrinks away behind it (60 to 100%).
- Three captions, one per beat, big lowercase, left of the object: "everything's in here." / "one payment opens it." / "and this is inside."
- Scroll-linked, never time-based. Reduced motion or no scroll-timeline support: show the final state (open folder, demo below), no pin.
- Phone: same beats, stacked, pin shorter (about 120vh), folder centred.

## 4. The demo portal
- A browser-frame window (hairline, radius 16, a thin top bar with three grey dots and "portal.elaye.store") holding a scaled copy of the real portal: the header with the wordmark and the eight heading-mark tabs, then one screen per tab.
- Guided: while the section is in view, scrolling steps through the tabs in order, and a caption under the window says what each is (copy below). A small step counter "01 / 08" in Geist.
- Clickable: every tab can be clicked at any time, which jumps the guide to that step. Arrow keys work. Tabs are real buttons with aria-selected.
- Blank data: every brief is a blank card: two grey bars (#ececec) where the artist and notes go, the real chips (Urgent with the LED dot, Hot, Warm, Cold, Picked by Elaye gold), "posted 2 days ago", "submit ›". Never a name, never a real brief. Stats show today's real numbers only if they are in this brief; otherwise bars.
- Screens (model each on portal-shots/): Your day (to-do, habits with dot streaks, wins, the week strip), Briefs (filter pills, 6 blank cards), Submissions (status pills New, In review, Sent to artist, Placed, and the 01/02/03 steps), Vault (the full-vault card with the blue folder, Untitled / Dropbox pills), Kits (monthly kit gold folder + signature kits blue folders, names lowercase), Mentorship (two class rows with progress "0 of 18 done"), Guides (numbered rows 01 to 04 with blank bars for titles), The Room (gold folder, "Join THE ROOM on Discord" pill, channel rows).
- Nothing in the demo links out or submits. One pill under the window: "Get lifetime access" (the Stripe link).

## 5. The copy (final words, lowercase headings via CSS)

HEADER: what's inside · the portal · price · Log in · Get access

HERO
- eyebrow: the lifetime supply · by ELAYE
- h1: my whole setup. / yours forever.
- sub: Every kit, sound and session file I've made, the live brief board, and everything I add from here on. One payment, in for life.
- pill: Get lifetime access · link: See inside ›
- price line: $599 until Tue 6 Oct, then $699 · one payment · yours forever

UNLOCK CAPTIONS: everything's in here. / one payment opens it. / and this is inside.

DEMO PORTAL
- eyebrow: the portal
- h2: click around.
- sub: This is the members portal, the real layout. The briefs show as blank cards, the artists stay locked until you're in.
- step captions:
  01 your day: To-dos, habits and wins, planned where you work.
  02 the board: 120+ live artist briefs, updated daily. Find the one that fits your sound and send it.
  03 submissions: Every beat you send gets a status, and I move each one by hand.
  04 the vault: 3,500+ samples and stems, growing daily. Open it in Untitled or Dropbox.
  05 kits: Every signature kit, plus a members-only kit every month that never goes public.
  06 mentorship: How I did it. 40GB+ of mentorship and countless guides, read on your own time.
  07 guides: The written playbooks behind my career, updated every week.
  08 the room: The private members Discord. Feedback, flips, wins.
- under the window: you only see the real names once you're in.

NUMBERS (Geist Pixel Circle numerals, Geist labels)
- 6,000+ · files inside, and counting
- 120+ · live briefs, updated daily
- 70GB+ · sample archive
- 1 · payment, yours forever
- note: Today's count. New files, kits and briefs land every week, and you get all of it.

WHAT'S INSIDE
- eyebrow: what's inside · h2: everything. / day one.
- the vault: 3,500+ samples and stems, growing daily. Every melody, loop, stem and session file I've made, solos and starters built to flip.
- every kit: The OCTAVES Creator Suite (7 kits plus my mix and master chains), the unreleased Pt 2, Analog Alchemy and vaulted kits pulled from sale. All analog-recorded, all royalty-free, plus every kit I make from here on.
- members-only monthly kit: A new kit every month. Never public.
- the board: 120+ live artist briefs, updated daily. Send your best through the portal and I go through every one myself.
- the room: The private members Discord. Feedback, flips, wins.
- how i did it: 40GB+ of mentorship and countless guides, plus my Notion producer system. Read it on your own time.
- forever updates: Everything I add, you get. The numbers on this page are just today's.
- line under the grid: One login. Everything in it, updating forever.

HOW THE BOARD WORKS
- eyebrow: the board · h2: send it. i listen.
- 01 pick a brief that fits: Find the artist your sound fits on the live board.
- 02 build to it: Make the beat or pack that brief is actually asking for.
- 03 send it through the portal: I go through every submission myself.
- 04 track it: New, In review, Sent to artist, Placed. I move every status by hand, and you see it first.
- note: Your rights stay yours. Placed records get proper credit and splits, agreed before anything releases.

THE MEMBERS TALK
- h2: the members talk. · sub: Real messages, unedited. Only the names are left out.
- quotes (each tagged LIFETIME MEMBER, keep spelling and emoji exactly):
  "I do not regret getting the lifetime bundle , too much sauce"
  "fuxk with the organization and how streamlined it is. Makes it super easy to keep track of who to send for"
  "i'm gonna keep looking through it you got hella value in there 💯"
  "that notion thing with the opportunities and s*** is fire too bro. you da goat for that"
  "so many plays in there🤯"
  "even the lifetime supply was enough to make me think that but I love how you want the best for other creatives"
  "New process is way better ngl. Keeps everything tracked and organized"
  "Watched most of producer accelerator , and holy shit bro , my motivation is immeasurable and you've completely changed my mindset"
  (Dropped: the "$500" quote, it names an old price.)
- the existing real screenshots (placements, reviews, the portal on a phone) stay as screenshot cards: white, hairline, radius 16, padding 8.

THE CREDITS
- h2: you've seen / the credits.
- body: You came from my page, so I'll keep it short. Platinum records, a #1 on Billboard, cuts with the biggest names in the industry, sync with the biggest companies in the world. All self-taught from a bedroom in Australia. This is the setup I run my own career off, handed over.
- badges: MULTI PLATINUM CERTIFIED · NO. 1 BILLBOARD · 150,000,000+ STREAMS

FOR YOU / NOT FOR YOU
- for you: You've got beats and no real way to get them heard · You want the full setup, not one more pack · You'd rather own everything once than keep buying kits · You want new sounds landing every week without paying again · You're ready to treat this like a business
- not for you: You're hunting cheap sample packs · You expect placements without doing the work · You want a shortcut that does it for you

QUESTIONS
- Is this a course? No. It's the full setup: every kit, sound and session file I've made, the live board and the members-only drops. The written stuff on how I did it is in there too, but that's the side, not the thing.
- Am I paying for placements? No. Nobody can sell those. You get the same briefs I run my own career off. Your music does the rest.
- Do you place my beats for me? No, and run from anyone who says they will. You send, I listen to every one, and the ones that fit go straight to the artist. We want hits not beats.
- Is this a subscription? No. One payment, in for life. Nothing in it will ever sit behind another payment.
- Is the price going up? Yes. $599 until Tue 6 Oct, then $699. Same Lifetime either way.
- Is it actually legit? Fair question. The portal's built and live, you just clicked through it. Want a walkthrough first? DM me "IN" on Instagram @elxyee.
- I'm not landing placements yet. Am I good enough? Everyone in there started in a bedroom with nothing. You don't get good then join, you join and get good.
- I don't have much time. That's why it fits. Finding opps, chasing contacts and digging for sounds is done for you and handed over daily. You make music and send.
- What happens to beats that don't place? They stay yours. Sell them, lease them, put them on BeatStars.
- Already bought something from elaye.store? It comes off your Lifetime if you apply it within 14 days.
- Refunds? Every file is yours the moment you're in, so there are no refunds for change of mind. Full policy at elaye.store/refund-policy.
- How do I pay and get in? Hit Get lifetime access and check out. You're in the moment it clears, working that night's briefs.
- Does it really keep updating? Forever. New samples daily, a new kit monthly, new briefs every day, plus every kit and guide I make for the rest of my career.

THE PRICE CARD (the black band)
- eyebrow: no fake math
- h2: one payment. / yours forever.
- body: I'm not going to invent a number and cross it out. You've seen what's inside and you've clicked through the portal. One payment gets all of it, plus everything I build for the rest of my career.
- price: $599 · small line: until Tue 6 Oct, then $699 · one payment
- list: The board: 120+ live artist briefs, updated daily · 70GB+ sample archive via the Untitled app, sent on purchase, updating forever · OCTAVES Creator Suite, Analog Alchemy and every future kit · Vaulted kits plus a members-only kit every month · How I did it: 40GB+ of mentorship, countless guides and my Notion producer system · Every submission goes through me · The room: the private members Discord · Your rights stay yours until a record places and splits are agreed
- pill: Get lifetime access
- under: Want to see inside first? DM me "IN" on Instagram @elxyee.

FOOTER
- wordmark · one payment. yours forever. · Log in · Instagram @elxyee · Refund policy · © 2026 ELAYE
- small line: Not ready? Locked In is free. Real lessons from a platinum producer, and first access to every drop. (links elaye.store/newsletter)

## 6. Links (never change)
- Every checkout pill: https://buy.stripe.com/6oU5kEaEYgMQ86jbqa9AA03 (target _blank, data-checkout). On 6 Oct the price and the link change in code, not in the design.
- Log in: https://portal.elaye.store/login · Instagram: https://instagram.com/elxyee · Refund policy: https://elaye.store/refund-policy · Newsletter line: https://elaye.store/newsletter

## 7. Copy law
No seat counts, no countdown timers, no "spots left", no crossed-out prices. Never say or imply a placement came from the Lifetime; it sells access, the member's music earns the placement. Never name or size the board's artists. No "direct line to me". The numbers are today's and framed that way.
