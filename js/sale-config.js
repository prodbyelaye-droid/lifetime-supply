/* ─────────────────────────────────────────
   SALE CONFIG — one place to flip the sale.
   Set endDate to a past date to end the sale.
───────────────────────────────────────── */
const SALE = {
  originalPrice: 500,
  salePrice:     200,
  discount:      '50% OFF',
  endsLabel:     'June 25',
  /* 24 hr flash sale — ends June 25 10pm AEST */
  endDate: new Date('2026-06-25T22:00:00+10:00'),
};

/* ─── Sync: runs before app.js ─────────────
   Updates stat counter data-value so GSAP
   reads the correct number on init.         */
const SALE_ACTIVE = Date.now() < SALE.endDate;

(function applySyncState() {
  const statEl = document.querySelector('.stat-num[data-original-price]');
  if (statEl) {
    statEl.dataset.value = SALE_ACTIVE
      ? statEl.dataset.salePrice
      : statEl.dataset.originalPrice;
  }
  if (!SALE_ACTIVE) {
    document.body.classList.add('sale-ended');
    const bar = document.getElementById('saleBar');
    if (bar) bar.style.display = 'none';
  }
})();

/* ─── Countdown utility ─────────────────── */
function _pad(n) { return String(n).padStart(2, '0'); }

function _countdownText() {
  const diff = SALE.endDate - Date.now();
  if (diff <= 0) return null;
  const d = Math.floor(diff / 864e5);
  const h = Math.floor((diff % 864e5) / 36e5);
  const m = Math.floor((diff % 36e5) / 6e4);
  const s = Math.floor((diff % 6e4) / 1000);
  return d > 0
    ? `${d}d ${_pad(h)}h ${_pad(m)}m ${_pad(s)}s`
    : `${_pad(h)}h ${_pad(m)}m ${_pad(s)}s`;
}

function startCountdown(el) {
  let id;
  function tick() {
    const t = _countdownText();
    el.textContent = t ?? 'Sale ended';
    if (!t) clearInterval(id);
  }
  tick();
  id = setInterval(tick, 1000);
}

/* ─── DOM updates after parse ───────────── */
document.addEventListener('DOMContentLoaded', () => {
  if (!SALE_ACTIVE) {
    /* Revert pricing section */
    document.querySelectorAll('.price-amount-was').forEach(el => {
      el.style.display = 'none';
    });
    document.querySelectorAll('.price-amount-now').forEach(el => {
      el.textContent = '💰 $' + SALE.originalPrice;
      el.style.color = 'var(--white)';
      el.style.textShadow = 'none';
    });
    document.querySelectorAll('.sale-badge').forEach(el => {
      el.style.display = 'none';
    });
    /* Revert stat */
    document.querySelectorAll('.stat-was').forEach(el => {
      el.style.display = 'none';
    });
    /* Revert footer */
    document.querySelectorAll('.footer-price-was').forEach(el => {
      el.style.display = 'none';
    });
    document.querySelectorAll('.footer-price-now').forEach(el => {
      el.textContent = '$' + SALE.originalPrice;
      el.style.color = 'var(--white)';
      el.style.textShadow = 'none';
    });
    document.querySelectorAll('.footer-sale-urgency').forEach(el => {
      el.textContent = 'Sale has ended.';
    });
    return;
  }

  /* Sale is live — start all countdowns */
  document.querySelectorAll('.sale-countdown').forEach(el => startCountdown(el));
});
