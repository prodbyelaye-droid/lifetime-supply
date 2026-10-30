/* GO-073: B selected by the manager. A remains available for comparison. */
(() => { const value = new URLSearchParams(location.search).get('layout'); document.documentElement.dataset.landingLayout = value === 'a' ? 'a' : 'b'; })();
