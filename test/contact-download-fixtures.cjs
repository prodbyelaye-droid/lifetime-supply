/* Offline publication fixtures. Enabled variants exist only in isolated VM memory. */
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.join(__dirname, '..');
const read = name => fs.readFileSync(path.join(root, name), 'utf8');
const gateSource = read('js/desktop-downloads.js');
function sourceFor(value) {
  // release 1105: the checked-in switch is 'true' (published); the fixtures accept either checked-in value.
  const switchLine = (gateSource.match(/const PUBLICATION = '(?:true|false)';/g) || [''])[0];
  if (!switchLine || gateSource.split(switchLine).length !== 2) throw new Error('Expected one publication switch');
  return gateSource.replace(switchLine, 'const PUBLICATION = ' + (value === undefined ? 'undefined' : JSON.stringify(value)) + ';');
}
function gate(value = 'false') {
  const context = {module: {exports: {}}};
  vm.runInNewContext(sourceFor(value), context);
  return context.module.exports;
}
function server(downloads, template = read('index.html')) {
  const context = {
    module: {exports: {}}, process: {cwd: () => root},
    require(name) {
      if (name === 'node:fs') return {readFileSync: () => template};
      if (name === '../js/desktop-downloads') return downloads;
      if (name === '../lib/offer') return require('../lib/offer');
      if (name === 'node:path') return path;
      throw new Error('Unexpected fixture import: ' + name);
    },
  };
  vm.runInNewContext(read('api/landing.js'), context);
  return context.module.exports;
}
function dynamic(downloads, initial, search = '') {
  const copy = {outerHTML: initial};
  const section = {querySelector(selector) {
    if (selector !== '.dl17-copy') throw new Error('Unexpected copy selector');
    return copy;
  }};
  const context = {
    window: {LSDownloads: downloads}, location: {search},
    document: {querySelector(selector) {
      if (selector !== '.dl17') throw new Error('Unexpected section selector');
      return section;
    }},
  };
  vm.runInNewContext(read('js/downloads-017.js'), context);
  return copy.outerHTML;
}
module.exports = {root, read, sourceFor, gate, server, dynamic};
