/* Animated Gradient Text (reference 273) lifecycle, adapted from Magic UI:
   https://magicui.design/docs/components/animated-gradient-text
   The gradient and its 8s linear keyframes live in css/landing-gradient273.css.
   This module only toggles [data-gradient-273-running] so that CSS animation runs
   while the phrase intersects the viewport, the page is visible/shown and motion
   is allowed (no reduced motion, no forced colors, no html[data-motion-paused]).
   No dependencies, no requestAnimationFrame loop, no unload handlers (BFCache-safe).
   MIT License
   Copyright (c) Magic UI
   Permission is hereby granted, free of charge, to any person obtaining a copy
   of this software and associated documentation files (the "Software"), to deal
   in the Software without restriction, including without limitation the rights
   to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
   copies of the Software, and to permit persons to whom the Software is
   furnished to do so, subject to the following conditions:
   The above copyright notice and this permission notice shall be included in all
   copies or substantial portions of the Software.
   THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
   IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
   FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
   AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
   LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
   OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
   SOFTWARE. */
(function () {
  'use strict';

  var SELECTOR = '#inside [data-gradient-273]';
  var RUNNING_ATTR = 'data-gradient-273-running';
  var PAUSE_ATTR = 'data-motion-paused';

  function watchQuery(query, onChange) {
    if (typeof window.matchMedia !== 'function') return null;
    var mql = window.matchMedia(query);
    if (typeof mql.addEventListener === 'function') {
      mql.addEventListener('change', onChange);
    } else if (typeof mql.addListener === 'function') {
      mql.addListener(onChange);
    }
    return mql;
  }

  function init() {
    var nodes = document.querySelectorAll(SELECTOR);
    if (!nodes.length || !('IntersectionObserver' in window)) return;

    var root = document.documentElement;
    var targets = Array.prototype.slice.call(nodes);
    var inView = new Map();
    var pageShown = true;
    var reduceQuery = null;
    var forcedQuery = null;

    function motionAllowed() {
      return pageShown &&
        document.visibilityState !== 'hidden' &&
        !root.hasAttribute(PAUSE_ATTR) &&
        !(reduceQuery && reduceQuery.matches) &&
        !(forcedQuery && forcedQuery.matches);
    }

    function sync() {
      var allowed = motionAllowed();
      for (var i = 0; i < targets.length; i++) {
        var el = targets[i];
        var run = allowed && inView.get(el) === true;
        if (run !== el.hasAttribute(RUNNING_ATTR)) {
          if (run) {
            el.setAttribute(RUNNING_ATTR, '');
          } else {
            el.removeAttribute(RUNNING_ATTR);
          }
        }
      }
    }

    var observer = new IntersectionObserver(function (entries) {
      for (var i = 0; i < entries.length; i++) {
        var entry = entries[i];
        inView.set(entry.target, entry.isIntersecting === true || entry.intersectionRatio > 0);
      }
      sync();
    }, { threshold: 0 });

    function observeAll() {
      for (var i = 0; i < targets.length; i++) {
        inView.set(targets[i], false);
        observer.unobserve(targets[i]);
        observer.observe(targets[i]);
      }
    }

    reduceQuery = watchQuery('(prefers-reduced-motion: reduce)', sync);
    forcedQuery = watchQuery('(forced-colors: active)', sync);

    if ('MutationObserver' in window) {
      new MutationObserver(sync).observe(root, { attributes: true, attributeFilter: [PAUSE_ATTR] });
    }

    document.addEventListener('visibilitychange', sync);

    window.addEventListener('pagehide', function () {
      pageShown = false;
      sync();
    });

    window.addEventListener('pageshow', function (event) {
      pageShown = true;
      if (event.persisted) {
        // Restored from BFCache: re-observe for a fresh intersection snapshot.
        observeAll();
      }
      sync();
    });

    observeAll();
    sync();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
