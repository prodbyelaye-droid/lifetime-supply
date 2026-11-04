/* Selected B and founder → downloads → steps placement are fixed in the HTML.
 * Reconcile controls with the same publication module used by the server/build.
 * If the module cannot load, retain the generated, default-off static fallback. */
(function () {
  'use strict';
  const section = document.querySelector('.dl17');
  const copy = section && section.querySelector('.dl17-copy');
  if (!copy || !window.LSDownloads) return;
  copy.outerHTML = window.LSDownloads.render();
})();
