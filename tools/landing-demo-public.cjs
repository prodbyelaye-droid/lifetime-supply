// Run after a portal recapture. Public demo navigation must not expose account or referral pages.
const fs = require('node:fs');
const vm = require('node:vm');
const file = require('node:path').join(__dirname, '../js/l4-portal-data.js');
const source = fs.readFileSync(file, 'utf8');
const sandbox = {window: {}};
vm.runInNewContext(source, sandbox);
const data = sandbox.window.L4P;
const allowed = key => !/^(referrals|profile)(-|$)/.test(key);
data.order = data.order.filter(allowed);
for (const key of ['pages', 'nav', 'label', 'sub', 'group', 'navOf']) {
  for (const name of Object.keys(data[key] || {})) {
    if (!allowed(name)) delete data[key][name];
  }
}
for (const page of [...Object.values(data.pages), ...Object.values(data.nav)]) {
  for (const key of ['body', 'hots']) if (page[key]) page[key] = page[key].filter(hotspot => allowed(hotspot.go));
}
for (const name of Object.keys(data.group)) data.group[name] = data.group[name].filter(allowed);
for (const menu of Object.values(data.menu || {})) menu.items = menu.items.filter(item => allowed(item.do));
fs.writeFileSync(file, source.slice(0, source.indexOf('window.L4P=')) + 'window.L4P=' + JSON.stringify(data) + ';\n');
