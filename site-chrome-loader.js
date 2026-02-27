(() => {
  const container = document.getElementById('site-chrome');
  if (!container) {
    window.siteChromeReady = Promise.resolve();
    return;
  }

  const isIndexPage = () => {
    const path = window.location.pathname;
    return path === '/' || path.endsWith('/index.html') || path.endsWith('/index');
  };

  const normalizeNavLinks = () => {
    if (isIndexPage()) return;
    const links = container.querySelectorAll('.nav-links a[href^="#"]');
    links.forEach((link) => {
      const hash = link.getAttribute('href');
      if (!hash) return;
      link.setAttribute('href', `index.html${hash}`);
    });
  };

  const initAnnouncementBanner = () => {
    const banner = container.querySelector('.announcement-banner');
    const bannerTrack = container.querySelector('.banner-track');
    if (!banner || !bannerTrack) return;
    const baseText = bannerTrack.querySelector('.banner-text');
    const textContent = baseText?.textContent?.trim();
    if (!textContent) return;

    bannerTrack.innerHTML = '';

    const sequence = document.createElement('div');
    sequence.className = 'banner-sequence';
    bannerTrack.appendChild(sequence);

    const makeSpan = () => {
      const span = document.createElement('span');
      span.className = 'banner-text';
      span.textContent = textContent;
      return span;
    };

    sequence.appendChild(makeSpan());

    const bannerWidth = banner.offsetWidth || 0;
    let safety = 0;
    while (sequence.scrollWidth < bannerWidth + 80 && safety < 20) {
      sequence.appendChild(makeSpan());
      safety += 1;
    }

    const clone = sequence.cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');
    bannerTrack.appendChild(clone);

    const sequenceWidth = sequence.scrollWidth || sequence.offsetWidth || 0;
    const speed = 60;
    const duration = Math.max(12, sequenceWidth / speed);
    bannerTrack.style.setProperty('--banner-duration', `${duration}s`);
  };

  const loadSiteChrome = () =>
    fetch('nav.html')
      .then((response) => response.text())
      .then((html) => {
        container.innerHTML = html;
        normalizeNavLinks();
        initAnnouncementBanner();
      })
      .catch(() => {
        // Ignore fetch errors so the page still renders.
      })
      .finally(() => {
        document.dispatchEvent(new Event('siteChromeReady'));
      });

  window.siteChromeReady = loadSiteChrome();
  window.addEventListener('resize', initAnnouncementBanner);
})();
