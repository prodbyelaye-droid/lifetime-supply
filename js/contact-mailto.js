/* Local email-app handoff only: no network send, receipt, storage or draft reset. */
(function (root) {
  'use strict';
  const RECIPIENT = 'elxyee@gmail.com';
  const SUBJECT = 'Lifetime Supply question';
  // Email-client URL limits vary. Longer drafts use the always-visible copy fallback.
  const MAX_URL_LENGTH = 1800;
  const HANDOFF = 'your email app may open with this draft. review it and send it there. your message stays here until you leave this page.';
  const FAILURE = 'could not open your email app. your message is still here. copy it and email ' + RECIPIENT + '.';
  function prepare(message) {
    if (typeof message !== 'string' || !message.trim()) return {error: 'write a message first.'};
    if (/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f-\u009f]/.test(message)) {
      return {error: 'remove unsupported control characters from your message. your draft is still here.'};
    }
    let url;
    try {
      url = 'mailto:' + RECIPIENT + '?subject=' + encodeURIComponent(SUBJECT) +
        '&body=' + encodeURIComponent(message.replace(/\r\n?|\n/g, '\r\n'));
    } catch (_) {
      return {error: 'your message contains an unsupported character. your draft is still here; copy it into your email app.'};
    }
    if (url.length > MAX_URL_LENGTH) return {error: 'this draft is too long for a reliable email-app link. copy it and email ' + RECIPIENT + '. your message is still here.'};
    return {url};
  }
  function bind(form, input, status, openEmail) {
    function announce(message) {
      status.textContent = message;
      status.hidden = false;
    }
    input.addEventListener('input', function () {
      input.setCustomValidity('');
      input.removeAttribute('aria-invalid');
      status.hidden = true;
      status.textContent = '';
    });
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      const result = prepare(input.value);
      if (result.error) {
        input.setCustomValidity(result.error);
        input.setAttribute('aria-invalid', 'true');
        announce(result.error);
        input.reportValidity();
        return;
      }
      input.setCustomValidity('');
      input.removeAttribute('aria-invalid');
      // Browsers do not report whether a mail client opened, a draft was complete,
      // or an email was sent. Do not infer success from a navigation attempt.
      announce(HANDOFF);
      try { openEmail(result.url); } catch (_) { announce(FAILURE); }
    });
  }
  if (typeof module === 'object' && module.exports) {
    module.exports = {prepare, bind, MAX_URL_LENGTH, RECIPIENT, SUBJECT, HANDOFF, FAILURE};
    return;
  }
  const form = root.document.querySelector('[data-contact-mailto]');
  if (!form) return;
  const input = form.querySelector('textarea[name="body"]');
  const status = root.document.getElementById('contact-status');
  if (!input || !status) return;
  bind(form, input, status, url => root.location.assign(url));
})(typeof window === 'object' ? window : globalThis);
