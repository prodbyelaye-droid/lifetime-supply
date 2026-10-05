const fs = require('node:fs');
const path = require('node:path');
const {getOffer, CHECKOUT_599, PRICE_LINE, GIVEAWAY_LINE} = require('../lib/offer');
const template = fs.readFileSync(path.join(process.cwd(), 'index.html'), 'utf8');

function render(now, checkout699) {
  const offer = getOffer(now, checkout699);
  let html = template
    .replaceAll(CHECKOUT_599, offer.checkoutUrl)
    .replaceAll('"price": "599.00"', '"price": "' + offer.price + '.00"')
    .replaceAll('$599 <span class="currency">USD</span>', '$' + offer.price + ' <span class="currency">USD</span>')
    .replaceAll(PRICE_LINE, offer.priceLine)
    .replaceAll('yes. $599 USD until sunday 11 october 2026 at 8 am AEDT, then $699 USD. the same Lifetime either way.', offer.priceFaq)
    .replaceAll(GIVEAWAY_LINE, offer.giveawayLine)
    .replace(/(data-checkout[^>]*>)get lifetime access/g, '$1' + offer.checkoutLabel);
  if (offer.refreshAt) html = html.replace('</head>', '<meta name="offer-refresh-at" content="' + new Date(offer.refreshAt).toISOString() + '" data-delay-ms="' + Math.max(0, offer.refreshAt - (now ?? Date.now())) + '"></head>');
  return html;
}

module.exports = function handler(req, res) {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.setHeader('Allow', 'GET, HEAD');
    return res.status(405).end();
  }
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  return res.status(200).send(req.method === 'HEAD' ? '' : render());
};
module.exports.render = render;
