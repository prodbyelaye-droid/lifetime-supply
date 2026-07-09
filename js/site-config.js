/* ─────────────────────────────────────────
   SITE CONFIG — single source of truth.
   Founding window: one price, no sale, no timer.
───────────────────────────────────────── */
const SITE = {
  price: 499,
  /* Stripe Payment Link for the $499 Lifetime — wired live 2026-07-05.
     The HTML href on every [data-checkout] element matches this too,
     so no-JS visitors, link previews and crawlers land on the same
     Stripe checkout instead of falling back to Instagram. */
  checkoutUrl: 'https://buy.stripe.com/14A14o7sM404biv3XI9AA00',
};

document.addEventListener('DOMContentLoaded', () => {
  /* Point every checkout button at the configured URL. The HTML href on
     each [data-checkout] element already matches this, so no-JS visitors
     land on the same Stripe checkout. */
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
