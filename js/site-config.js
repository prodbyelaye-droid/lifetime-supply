/* ─────────────────────────────────────────
   SITE CONFIG — single source of truth.
   Founding window: one price, no sale, no timer.
───────────────────────────────────────── */
const SITE = {
  price: 499,
  /* TODO(elaye): paste the Stripe Payment Link for the $499 Lifetime here.
     Until then, every button falls back to the Instagram DM so nothing breaks. */
  checkoutUrl: 'https://instagram.com/elxyee',
};

document.addEventListener('DOMContentLoaded', () => {
  /* Point every checkout button at the configured URL.
     HTML keeps the Instagram link as a no-JS fallback. */
  document.querySelectorAll('[data-checkout]').forEach(a => {
    a.href = SITE.checkoutUrl;
  });

  /* If any image 404s, hide its slot cleanly instead of showing a broken
     image. Single-image sections carry data-missing-hides pointing at the
     wrapper to collapse; grid images just remove themselves. */
  document.querySelectorAll('img').forEach(img => {
    img.addEventListener('error', () => {
      const sel = img.getAttribute('data-missing-hides');
      const slot = sel ? img.closest(sel) : img;
      if (slot) slot.style.display = 'none';
    });
  });
});
