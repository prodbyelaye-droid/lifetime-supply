# Interactive portal: Your Day and calendar

The public landing preview now reflects the members portal's current Your Day
planner and calendar sheet, including the Phase 2 calendar implementation on
`codex/your-day-calendar-next`. This extends the Phase 1 preview from portal
PRs #24 and #25, through `44718bd6dcf05de47ead68e69eaf1a4c41df963e`.

- Add, complete, undo, reopen, move and remove example tasks. Today and any
  selected week share state; undated inbox tasks stay out of the week. Choose
  any day and edit a task into a time block. Changing timezone keeps its instant;
  moving to inbox clears its time. Clock-change gaps and overlaps require another
  time. Completed tasks show the same 90-day/500-item wording as the portal.
  Habit checks and adding wins remain simple.
- Calendar opens beside the help pill. Enable, copy, confirm/cancel reset and
  turn off work locally. Apple, Google and Outlook explain the member action
  without opening an app. The URL uses the reserved `example.invalid` domain.
- Choose everything, my plan or the board; everything has the same plan/deadline
  options. Feed choices keep the example link stable. The sheet explains what
  each feed includes and how Outlook web subscription differs from file import.
  Refresh wording allows a day or longer; it does not claim a subscription was
  verified. The example URL respects the same `data-recording="on"` blur state.
- The board shows an explicitly illustrative deadline and the single-event
  Apple/Google/Outlook controls. The week displays that same deadline and opens
  the example brief. No private brief identity is displayed.
- Audio upload, analysis and BPM/key check demo affordances and copy are removed.

All example edits live in memory and reset on reload. No feed is created,
account is contacted, calendar is subscribed or member data is exposed.
Pricing, checkout, offer logic and films are unchanged.

## Validation

`node --check js/homer.js`, `node test/offer.cjs`, and the existing Playwright
landing suite with focused planner/calendar coverage. Browser matrix: 1440 and
390 pixels, reduced motion on/off, all nine tabs, no-JS/blocked-script/blocked-media
fallbacks. Checks cover safe task text, shared completion state, inbox exclusion,
removal, future dates, time blocks/clear/inbox, completed/Undo, week navigation,
timezone controls, habits, wins, modal focus/Escape/return focus, mock copying,
feed choices, two-step reset/cancel/revoke, recording blur, deadline-to-brief
navigation and no feed/subscription requests.
Desktop and mobile screenshots include both calendar states and the full planner.

The legacy `design/white-room/copycheck.py` is not a current release gate: its
pre-redesign snapshot reports 543 violations on unmodified main
`1691cb2`. Its baseline and allowlist were not rewritten for this change.
Current offer checks and browser checks remain the meaningful gates.

## Next move and weekly review example

The next stage sits after the existing week. Calendar markup, controls, copy
and styling remain fixed. The planner emits only its disposable task state to
the local weekly review; no saved account data is read or written.

A loose goal can become one to three editable focuses, each with one to eight
small steps and optional personal dates. Drafts do not change the saved next
action until the visitor presses approve and save. Completion can be undone.
AI help now demonstrates illustrative suggestions, editing and explicit approval.
Its disclosure explains that no Gemini request is made; real members can opt
into Gemini in their portal. The starting point and fully manual path also work
without any API call.

The illustrative Hip hop brief can be saved as working on, given an approved
editable checklist, and submitted as an example.invalid link. The local receipt
is clearly an example and never claims an email was sent. Guide suggestions use
three actual titles and descriptions from the portal's lib/content.ts; matching
reasons describe only shared words. Brief matching uses an explicitly saved
genre interest and never assigns a fit score.

The review counts only demo tasks marked done, briefs saved as working on and
example submissions recorded. Undo removes a completion; no placement or work
is inferred. Weekly email preferences default off, accept a validated timezone,
day and hour, and can be turned off. Delivery remains disabled.

The browser matrix verifies draft versus approval, focus limits, editable next
steps, completion/Undo, recommendations, checklist approval, example receipts,
review counts, example consent and email preference controls. It also asserts
that these flows make no member, AI, submission or email requests.


## 8 October: heading cleanup

Owner-approved: remove the decorative small labels above task, habit, win,
next-action and calendar headings. The main headings, useful dates, status
labels, Outlook instructions, feed controls and recording blur retain their
existing behavior. The 1440/390 browser matrix with normal/reduced motion
and offer boundary checks passed after this cleanup.


## 8 October: outer section borders

The owner additionally requested the existing blue/lilac/peach gradient on
the outside border of each outer section box. Two background layers colour
only the existing one-pixel border: the interior stays flat white. Nested
boxes, fields, task rows, covers and contents keep their existing styles.
No wrapper, positioning, box size or hit target changes. Native borders
replace the gradient in forced colours.

The final 1440/390 normal/reduced-motion browser matrix and offer boundary
checks passed. A focused computed-style check confirmed the outer border
gradient, an unchanged plain inner textarea, and a visible native border
without gradient in forced colours.


## 8 October: comparison with the live member Your Day

Compared against production portal commit
`0a3dae867d733ac12993568276aad8cb26924e3f`, including the actual
MemberPlan controls and manualStartingPoint helper. A fresh disposable member
passed live manual approval, next-action selection, completion and persisted
undo at 1440 and 390 pixels, with no browser errors. Email opt-in defaulted
off and delivery remained disabled. The test member was removed afterward;
no emails were sent.

The preview already demonstrated approved focuses, working-on briefs and
checklists, honest guide/interest suggestions, activity counts and recap
preferences. Its remaining mismatch was showing unavailable AI after member
Gemini had been enabled. It now demonstrates consent, illustrative suggestions,
editing and approval. Public suggestions use the existing starting-point
helper, with no provider calls or invented dates. They are clearly labelled
examples; real member Gemini consent and private persistence remain in the
authenticated portal.

Calendar markup, scripts, instructions and styles are unchanged by this update.
Outer gradient borders and the removed decorative headings are retained.
