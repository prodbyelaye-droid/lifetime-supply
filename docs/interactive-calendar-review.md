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
