(function secureInlineEvents() {
  'use strict';

  const ALLOWED = new Set([
    'switchTab', 'forgotPassword', 'togglePw', 'handleLogin',
    'updateStrength', 'handleSignup', 'handleGuest', 'pickAvatar',
    'sortBy', 'doLogin', 'logout', 'applyFilters', 'loadSubmissions',
    'forceSyncPlan', 'openCancellation',
  ]);

  function parseArguments(source, element, event) {
    if (!source.trim()) return [];
    return source.split(',').map(raw => {
      const value = raw.trim();
      if (value === 'this') return element;
      if (value === 'event') return event;
      if (value === 'true') return true;
      if (value === 'false') return false;
      if (/^-?\d+(?:\.\d+)?$/.test(value)) return Number(value);
      const quoted = value.match(/^(['"])([\s\S]*)\1$/);
      if (quoted) return quoted[2].replace(/\\(['"\\])/g, '$1');
      throw new Error('unsupported inline event argument');
    });
  }

  function dispatch(expression, element, event) {
    const remove = expression.match(/^document\.getElementById\((['"])([-\w:]+)\1\)\.remove\(\)$/);
    if (remove) {
      document.getElementById(remove[2])?.remove();
      return;
    }

    if (expression === "this.closest('div').parentElement.remove()") {
      element.closest('div')?.parentElement?.remove();
      return;
    }

    const call = expression.match(/^([A-Za-z_$][\w$]*)\((.*)\)$/s);
    if (!call || !ALLOWED.has(call[1])) throw new Error('blocked inline event expression');
    const fn = window[call[1]];
    if (typeof fn !== 'function') throw new Error('missing event handler');
    return fn(...parseArguments(call[2], element, event));
  }

  for (const type of ['click', 'change', 'submit', 'input', 'load']) {
    document.addEventListener(type, event => {
      const element = event.target instanceof Element
        ? event.target.closest(`[data-capy-on${type}]`)
        : null;
      if (!element) return;
      try {
        const result = dispatch(element.getAttribute(`data-capy-on${type}`) || '', element, event);
        if (result === false) event.preventDefault();
      } catch (error) {
        console.error('[secure-events] blocked handler');
        event.preventDefault();
      }
    });
  }
})();
