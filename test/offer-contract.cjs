/* The live checkout is pinned in the template. api/landing.js returns index.html unchanged once it no longer carries
 * the Oct 11 $599 token, so LIFETIME_CHECKOUT_699_URL cannot change the CTAs any more. To change the offer or its
 * link, run scripts/set-offer.cjs (--launch or --standard, task 020): it sets the template and LIVE below together. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
process.chdir(path.join(__dirname, '..'));
const LIVE = 'https://buy.stripe.com/00w8wQdRa0NS5Ybbqa9AA04';
const template = fs.readFileSync('index.html', 'utf8');
function pinned(html) {
  const ctas = [...html.matchAll(/href="([^"]+)" data-checkout/g)].map((m) => m[1]);
  assert.deepEqual(ctas, [LIVE], 'one checkout CTA, the buy card (Elaye 6 Nov 18:08: the hero and step 1 go to #price first)');
  // hero B (Elaye 12 Nov 01:52): "No get lifetime access button on the hero too, something to point it down towards the interactive
  // portal section". The hero's one control goes to the demo; the checkout stays the one buy card.
  assert(!html.includes('class="hero-cta"'), 'no get lifetime access in the hero');
  assert(html.includes('<a class="btn" href="#portal">click around the portal'), 'redesign 1112: the hero sends people to the portal demo');
  assert(html.includes('<a class="l8-btn" href="#price-band">get lifetime access'), 'redesign 1112: step 1 goes to the price band');
  const schema = JSON.parse(html.match(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/)[1]);
  assert.equal(schema.offers.url, LIVE);
  assert.equal(Number(schema.offers.price), 699);
  assert.equal(schema.offers.priceCurrency, 'USD');
}
pinned(template);
process.env.LIFETIME_CHECKOUT_699_URL = 'https://buy.stripe.com/EnvOverrideMustNotApply';
for (const mod of ['../api/landing', '../lib/offer']) delete require.cache[require.resolve(mod)];
const handler = require('../api/landing');
const res = {headers: {}, setHeader(k, v) { this.headers[k] = v; }, status(n) { this.code = n; return this; }, send(b) { this.body = b; }, end() {}};
handler({method: 'GET'}, res);
assert.equal(res.code, 200);
assert.equal(res.body, template, 'the served page is the template');
pinned(res.body);
assert(!res.body.includes('EnvOverrideMustNotApply'), 'the env var does not reach the page');
console.log('Offer contract: the template pins the one checkout CTA and the JSON-LD price; LIFETIME_CHECKOUT_699_URL does not apply.');
