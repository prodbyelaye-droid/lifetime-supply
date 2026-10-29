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
  assert.deepEqual(ctas, [LIVE, LIVE, LIVE, LIVE], 'four CTAs, all the live checkout');
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
console.log('Offer contract: the template pins the four CTAs and the JSON-LD price; LIFETIME_CHECKOUT_699_URL does not apply.');
