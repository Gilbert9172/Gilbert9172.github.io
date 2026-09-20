/* Opt-in integration for trusted, same-origin HTML. The source stays unchanged. */
(() => {
  const frame = document.currentScript?.previousElementSibling?.querySelector('iframe');
  if (!frame) return;

  let cleanup = () => {};
  const connect = () => {
    cleanup();
    let doc;
    try {
      doc = frame.contentDocument;
      if (!doc?.body || doc.URL === 'about:blank') return;
    } catch {
      return; // External documents retain their fixed-height fallback.
    }

    const disposers = [];
    if (frame.hasAttribute('data-sync-theme')) {
      // Only opt in when the artifact supports data-theme="light|dark".
      const preference = window.matchMedia('(prefers-color-scheme: dark)');
      const sync = () => {
        const mode = document.documentElement.getAttribute('data-mode');
        doc.documentElement.setAttribute('data-theme',
          mode === 'light' || mode === 'dark' ? mode : preference.matches ? 'dark' : 'light');
      };
      const observer = new MutationObserver(sync);
      observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-mode'] });
      preference.addEventListener('change', sync);
      disposers.push(() => observer.disconnect(), () => preference.removeEventListener('change', sync));
      sync();
    }

    if (frame.hasAttribute('data-auto-resize') && window.ResizeObserver) {
      let pending;
      const resize = () => {
        cancelAnimationFrame(pending);
        pending = requestAnimationFrame(() => {
          // Measure the content, not the viewport, so closing details can shrink it.
          const body = doc.body;
          const style = frame.contentWindow.getComputedStyle(body);
          const rootStyle = frame.contentWindow.getComputedStyle(doc.documentElement);
          const height = Math.ceil(Math.max(body.scrollHeight, body.getBoundingClientRect().height)
            + (parseFloat(style.marginTop) || 0) + (parseFloat(style.marginBottom) || 0)
            + (parseFloat(rootStyle.paddingTop) || 0) + (parseFloat(rootStyle.paddingBottom) || 0)) + 2;
          if (frame.style.height !== `${height}px`) frame.style.height = `${height}px`;
        });
      };
      const observer = new ResizeObserver(resize);
      observer.observe(doc.body);
      disposers.push(() => observer.disconnect(), () => cancelAnimationFrame(pending));
      resize();
    }
    cleanup = () => disposers.forEach(dispose => dispose());
  };

  frame.addEventListener('load', connect);
  connect();
})();
