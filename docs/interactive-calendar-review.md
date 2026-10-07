# Interactive portal: Your Day and calendar

The public landing preview now reflects the members portal's Your Day planner
and calendar sheet, including the brief deadline calendar affordance. Source of
truth: portal PRs #24 and #25, through `44718bd6dcf05de47ead68e69eaf1a4c41df963e`.

- Add, complete, move and remove example tasks. Today and the week share state;
  undated inbox tasks stay out of the week. Habit checks and adding wins work.
- Calendar opens beside the help pill. Enable, copy, confirm/cancel reset and
  turn off work locally. Apple, Google and Outlook explain the member action
  without opening an app. The URL uses the reserved `example.invalid` domain.
- The sheet includes refresh timing, alert and privacy guidance from the portal.
  The example URL respects the same `data-recording="on"` blur state.
- The board shows an explicitly illustrative deadline and the single-event
  Apple/Google/Outlook controls. No private brief identity is displayed.

All example edits live in memory and reset on reload. No feed is created,
account is contacted, calendar is subscribed or member data is exposed.
Pricing, checkout, offer logic, films and other preview sections are unchanged.

## Validation

`node --check js/homer.js`, `node test/offer.cjs`, and the existing Playwright
landing suite with focused planner/calendar coverage. Browser matrix: 1440 and
390 pixels, reduced motion on/off, all nine tabs, no-JS/blocked-script/blocked-media
fallbacks. Checks cover safe task text, shared completion state, inbox exclusion,
removal, habits, wins, modal focus/Escape/return focus, mock copying, two-step
reset/cancel/revoke, recording blur, brief actions and no feed/subscription requests.
Desktop and mobile screenshots include both calendar states and the full planner.

The legacy `design/white-room/copycheck.py` is not a current release gate: its
pre-redesign snapshot already reports 525 violations on unmodified main
`370e7f8`. Its baseline and allowlist were not rewritten for this change.
Current offer checks and browser checks remain the meaningful gates.
