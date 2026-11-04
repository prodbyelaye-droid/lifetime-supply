/* Brand vectors: Bootstrap Icons v1.13.1, icons/apple.svg and icons/windows.svg.
The MIT License (MIT)

Copyright (c) 2019-2024 The Bootstrap Authors

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/
/* Sole publication switch. Change to the exact string 'true' only in a separately
 * approved release AFTER the deployed portal is verified. Then run
 * node scripts/prepare-desktop-downloads.cjs and ship the generated HTML and JS together.
 * No environment, query-string, storage or per-render override. */
(function (root) {
  'use strict';
  const PUBLICATION = 'true';
  const enabled = PUBLICATION === 'true';
  const urls = {
    mac: 'https://github.com/prodbyelaye-droid/lifetime-supply-desktop/releases/download/v1.0.2/Lifetime-Supply-mac.dmg',
    windows: 'https://github.com/prodbyelaye-droid/lifetime-supply-desktop/releases/download/v1.0.2/Lifetime-Supply-windows.exe',
  };
  function render() {
    const icons = {"mac": "<svg viewBox=\"0 0 16 16\" fill=\"currentColor\" aria-hidden=\"true\" focusable=\"false\"><path d=\"M11.182.008C11.148-.03 9.923.023 8.857 1.18c-1.066 1.156-.902 2.482-.878 2.516s1.52.087 2.475-1.258.762-2.391.728-2.43m3.314 11.733c-.048-.096-2.325-1.234-2.113-3.422s1.675-2.789 1.698-2.854-.597-.79-1.254-1.157a3.7 3.7 0 0 0-1.563-.434c-.108-.003-.483-.095-1.254.116-.508.139-1.653.589-1.968.607-.316.018-1.256-.522-2.267-.665-.647-.125-1.333.131-1.824.328-.49.196-1.422.754-2.074 2.237-.652 1.482-.311 3.83-.067 4.56s.625 1.924 1.273 2.796c.576.984 1.34 1.667 1.659 1.899s1.219.386 1.843.067c.502-.308 1.408-.485 1.766-.472.357.013 1.061.154 1.782.539.571.197 1.111.115 1.652-.105.541-.221 1.324-1.059 2.238-2.758q.52-1.185.473-1.282\"/><path d=\"M11.182.008C11.148-.03 9.923.023 8.857 1.18c-1.066 1.156-.902 2.482-.878 2.516s1.52.087 2.475-1.258.762-2.391.728-2.43m3.314 11.733c-.048-.096-2.325-1.234-2.113-3.422s1.675-2.789 1.698-2.854-.597-.79-1.254-1.157a3.7 3.7 0 0 0-1.563-.434c-.108-.003-.483-.095-1.254.116-.508.139-1.653.589-1.968.607-.316.018-1.256-.522-2.267-.665-.647-.125-1.333.131-1.824.328-.49.196-1.422.754-2.074 2.237-.652 1.482-.311 3.83-.067 4.56s.625 1.924 1.273 2.796c.576.984 1.34 1.667 1.659 1.899s1.219.386 1.843.067c.502-.308 1.408-.485 1.766-.472.357.013 1.061.154 1.782.539.571.197 1.111.115 1.652-.105.541-.221 1.324-1.059 2.238-2.758q.52-1.185.473-1.282\"/></svg>", "windows": "<svg viewBox=\"0 0 16 16\" fill=\"currentColor\" aria-hidden=\"true\" focusable=\"false\"><path d=\"M6.555 1.375 0 2.237v5.45h6.555zM0 13.795l6.555.933V8.313H0zm7.278-5.4.026 6.378L16 16V8.395zM16 0 7.33 1.244v6.414H16z\"/></svg>"};
    const buttons = [['mac', 'mac'], ['windows', 'windows']].map(([key, label]) => enabled
      ? `<a class="dl-btn" href="${urls[key]}">${icons[key]}download for ${label}</a>`
      : `<button class="dl-btn" type="button" disabled aria-disabled="true">${icons[key]}download for ${label}</button>`).join('');
    const description = enabled
      ? '<p><span>lifetime supply for mac and windows.</span> <span>your computer asks once, the first time:</span></p>' +
        '<p class="dl17-once"><span>on mac, open anyway in privacy &amp; security.</span> <span>on windows, more info, then run anyway.</span></p>'
      : '<p class="download-status"><span>downloads are not available yet.</span> <span>use the portal in your browser.</span></p>';
    // Copy check 4 Nov (row 1, Elaye 18:56): the live heading; until publication the current one stays.
    const heading = enabled
      ? "<h2 id=\"download-title\" class=\"ls-heading-b ls-heading-b--long\" data-heading=\"download\"><span class=\"ls-heading-b__line\">the whole setup.</span><span class=\"ls-heading-b__line\">now an <span class=\"dl17-word\">app</span>.</span></h2>"
      : "<h2 id=\"download-title\" class=\"ls-heading-b ls-heading-b--long\" data-heading=\"download\"><span class=\"ls-heading-b__line\">the portal,</span><span class=\"ls-heading-b__line\">as an <span class=\"dl17-word\">app</span>.</span></h2>";
    return '<div class="dl17-copy">' + heading + description +
      '<div class="dl17-row">' + buttons + '</div>' +
      '<a class="dl-login" href="https://portal.elaye.store/login">log in</a></div>';
  }
  function applyToTemplate(html) {
    const block = /<!-- desktop-downloads:start -->[\s\S]*?<!-- desktop-downloads:end -->/g;
    if ((html.match(block) || []).length !== 1) throw new Error('Expected one desktop download block');
    return html.replace(block, () => '<!-- desktop-downloads:start -->' + render() + '<!-- desktop-downloads:end -->');
  }
  const downloads = Object.freeze({enabled, render, applyToTemplate});
  if (typeof module === 'object' && module.exports) module.exports = downloads;
  else root.LSDownloads = downloads;
})(typeof window === 'object' ? window : globalThis);
