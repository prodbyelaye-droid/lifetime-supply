const PRICE_CHANGE = Date.parse('2026-10-10T21:00:00Z'); // 11 Oct, 08:00 AEDT
const DRAW_CLOSE = Date.parse('2026-10-10T09:00:00Z');   // 10 Oct, 20:00 AEDT
const CHECKOUT_599 = 'https://buy.stripe.com/6oU5kEaEYgMQ86jbqa9AA03';
const PRICE_LINE = '$599 USD until sunday 11 october 2026 at 8 am AEDT, then $699 USD. one payment.';
const GIVEAWAY_LINE = 'final date: giveaway closes saturday 10 october 2026 at 8 pm AEDT. no more extensions.';

function getOffer(now = Date.now(), checkout699 = process.env.LIFETIME_CHECKOUT_699_URL) {
  const raised = now >= PRICE_CHANGE;
  // Never show $699 while silently linking to the old $599 product. The new
  // Stripe link must be verified and supplied before the price-change date.
  const ready = /^https:\/\/buy\.stripe\.com\/[a-zA-Z0-9]+$/.test(checkout699 || '') && checkout699 !== CHECKOUT_599;
  return {
    price: raised ? 699 : 599,
    currency: 'USD',
    checkoutUrl: raised ? (ready ? checkout699 : 'https://instagram.com/elxyee') : CHECKOUT_599,
    checkoutLabel: raised && !ready ? 'DM for lifetime access' : 'get lifetime access',
    priceLine: raised ? '$699 USD. one payment, yours forever.' + (!ready ? ' checkout is updating. DM me for access.' : '') : PRICE_LINE,
    priceFaq: raised ? 'the price is now $699 USD. the same Lifetime, one payment.' : 'yes. $599 USD until sunday 11 october 2026 at 8 am AEDT, then $699 USD. the same Lifetime either way.',
    giveawayLine: now >= DRAW_CLOSE ? 'the giveaway closed saturday 10 october 2026 at 8 pm AEDT.' : GIVEAWAY_LINE,
    refreshAt: now < DRAW_CLOSE ? DRAW_CLOSE : now < PRICE_CHANGE ? PRICE_CHANGE : null,
  };
}
module.exports = {getOffer, PRICE_CHANGE, DRAW_CLOSE, CHECKOUT_599, PRICE_LINE, GIVEAWAY_LINE};
