const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

test('starting or resuming a kit pauses the others without restarting a paused kit', async () => {
  const element = () => ({listeners: {}, attributes: {}, innerHTML: '<svg></svg>', style: {setProperty() {}},
    addEventListener(name, fn) { this.listeners[name] = fn; }, click() { this.listeners.click?.(); },
    focus() {}, setAttribute(name, value) { this.attributes[name] = value; }});
  const kits = Array.from({length: 3}, () => {
    const play = element(), art = element(), cap = element(), tm = element(), track = element(), frame = {};
    cap.querySelector = selector => ({'.tm': tm, '.trk': track, '.art': art})[selector];
    const classes = new Set();
    const kit = {classList: {contains: n => classes.has(n), add: n => classes.add(n)}, play, art,
      querySelector: selector => ({'iframe.l4-sc': frame, '.l4-cap': cap, '.l4-play': play, '.l4-cap .art': art})[selector]};
    const handlers = {}, widget = {paused: true, bind(name, fn) { (handlers[name] ||= []).push(fn); },
      play() { this.paused = false; (handlers.play || []).forEach(fn => fn()); },
      pause() { if (this.paused) return; this.paused = true; (handlers.pause || []).forEach(fn => fn()); },
      isPaused(fn) { queueMicrotask(() => fn(this.paused)); }, getDuration(fn) { fn(10000); }};
    frame.widget = widget; kit.widget = widget; return kit;
  });
  const Widget = frame => frame.widget;
  Widget.Events = {PLAY: 'play', PAUSE: 'pause', PLAY_PROGRESS: 'progress'};
  const SC = {Widget};
  vm.runInNewContext(fs.readFileSync(require('node:path').join(__dirname, '../js/l4-1112.js'), 'utf8'), {
    document: {querySelectorAll: s => s === '.l4-row' ? [] : kits}, window: {SC}, SC,
    matchMedia: () => ({matches: false}), scrollY: 0, performance: {now: () => 0},
    addEventListener() {}, requestAnimationFrame() {}, Map,
  });
  const state = () => kits.map(k => k.widget.paused);
  kits[0].play.click(); assert.deepEqual(state(), [false, true, true]);
  kits[0].art.click(); await Promise.resolve(); assert.deepEqual(state(), [true, true, true]);
  kits[1].play.click(); assert.deepEqual(state(), [true, false, true]);
  kits[0].art.click(); await Promise.resolve(); assert.deepEqual(state(), [false, true, true]);
  kits[2].widget.play(); assert.deepEqual(state(), [true, true, false]);
});
