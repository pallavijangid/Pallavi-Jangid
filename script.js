(function () {
  const isFinePointer = window.matchMedia('(pointer: fine)').matches;
  const body = document.body;
  const pages = [
    { page: document.querySelector('.works-page'), rail: document.querySelector('.works-rail'), axis: 'x' },
    { page: document.querySelector('.project-page'), rail: document.querySelector('.project-right'), axis: 'y' }
  ].filter((entry) => entry.page && entry.rail);

  const cursorMap = {
    'roll camera': { x: 18, y: 18, anchor: 'left top' },
    action: { x: 18, y: 18, anchor: 'left top' },
    'opening scene': { x: 18, y: 18, anchor: 'left top' },
    "director's cut": { x: 18, y: 18, anchor: 'left top' },
    'roll credits': { x: 18, y: 18, anchor: 'left top' },
    'press kit': { x: 18, y: 18, anchor: 'left top' },
    cast: { x: 18, y: 18, anchor: 'left top' },
    your: { x: 18, y: 18, anchor: 'left top' },
    'roll back': { x: 18, y: 18, anchor: 'left top' },
    'enter frame': { x: 18, y: 18, anchor: 'left top' },
    '2014 | Photography': { x: 18, y: 18, anchor: 'left top' },
    '2016-20 | NIFT': { x: 18, y: 18, anchor: 'left top' },
    '2020 | Motion': { x: 18, y: 18, anchor: 'left top' },
    '2021 | Graphic': { x: 18, y: 18, anchor: 'left top' },
    '2022 | 3D': { x: 18, y: 18, anchor: 'left top' },
    '2023 | Brand': { x: 18, y: 18, anchor: 'left top' },
    '2024 | Type': { x: 18, y: 18, anchor: 'left top' },
    '2025 | GenAI': { x: 18, y: 18, anchor: 'left top' }
  };

  const ensureCursor = () => {
    let cursor = document.querySelector('.custom-cursor');
    if (cursor) return cursor;
    cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    cursor.innerHTML = `
      <div class="custom-cursor-dot"></div>
      <div class="custom-cursor-pill" style="display:none"></div>
    `;
    body.appendChild(cursor);
    return cursor;
  };

  const cursor = isFinePointer ? ensureCursor() : null;
  const dot = cursor ? cursor.querySelector('.custom-cursor-dot') : null;
  const pill = cursor ? cursor.querySelector('.custom-cursor-pill') : null;

  let cursorX = 0;
  let cursorY = 0;
  let hideTimer = null;
  let activeLabel = '';
  let activePointerDown = false;
  let activeCursorBg = '';

  const setPosition = (x, y, label, overrideOffset = null) => {
    if (!cursor || !dot || !pill) return;
    updateCursorPosition(x, y, label, overrideOffset);
  };

  const showDot = (x, y) => {
    if (!cursor || !dot || !pill) return;
    activeLabel = '';
    activeCursorBg = '';
    dot.style.display = 'block';
    pill.style.display = 'none';
    setPosition(x, y, '');
    cursor.classList.add('is-visible');
    window.clearTimeout(hideTimer);
  };

  const setCursorColors = (background = '', text = '') => {
    if (!pill) return;
    pill.style.background = background || 'var(--cursor-bg)';
    pill.style.color = text || 'var(--cursor-text)';
  };

  const showLabel = (x, y, label, overrideOffset = null, background = '', text = '') => {
    if (!cursor || !dot || !pill) return;
    activeLabel = label;
    activeCursorBg = background || '';
    dot.style.display = 'none';
    pill.style.display = 'inline-flex';
    setCursorColors(background, text);
    pill.textContent = label;
    pill.classList.remove('is-dimmed');
    setPosition(x, y, label, overrideOffset);
    cursor.classList.add('is-visible');
    window.clearTimeout(hideTimer);
    hideTimer = window.setTimeout(() => {
      pill.classList.add('is-dimmed');
      window.setTimeout(() => {
        if (cursor) cursor.classList.remove('is-visible');
      }, 2000);
    }, 3000);
  };

  const syncCursor = (event) => {
    cursorX = event.clientX;
    cursorY = event.clientY;
    if (!cursor) return;
    if (!activeLabel) {
      cursor.style.left = `${cursorX}px`;
      cursor.style.top = `${cursorY}px`;
    } else {
      setPosition(cursorX, cursorY, activeLabel);
    }
  };

  const attachCursorTargets = () => {
    if (!cursor) return;

    const targetElements = document.querySelectorAll('[data-cursor]');
    targetElements.forEach((el) => {
      const label = el.getAttribute('data-cursor');
      const offset = el.getAttribute('data-cursor-offset');
      const background = el.getAttribute('data-cursor-color') || '';
      const text = el.getAttribute('data-cursor-text') || '';

      const resolveLabel = () => label;
      const resolveOffset = () => {
        if (!offset) return null;
        const [dx, dy] = offset.split(',').map((v) => parseFloat(v.trim()) || 0);
        return { x: dx, y: dy, anchor: 'left top' };
      };

      const moveForElement = () => resolveOffset();

      el.addEventListener('pointerenter', () => {
        if (!activePointerDown) {
          showLabel(cursorX, cursorY, resolveLabel(), moveForElement(), background, text);
        }
      });

      el.addEventListener('pointerleave', () => {
        if (!activePointerDown) {
          showDot(cursorX, cursorY);
        }
      });

      el.addEventListener('pointerdown', () => {
        activePointerDown = true;
        showLabel(cursorX, cursorY, resolveLabel(), moveForElement(), background, text);
      });

      el.addEventListener('pointerup', () => {
        activePointerDown = false;
        window.clearTimeout(hideTimer);
        hideTimer = window.setTimeout(() => {
          if (cursor) cursor.classList.remove('is-visible');
        }, 3000);
      });
    });

    const homeCluster = document.querySelector('.home-canvas');
    if (homeCluster) {
      let moveTimer = null;
      homeCluster.addEventListener('pointermove', (event) => {
        syncCursor(event);
        const interactive = event.target.closest('[data-cursor]');
        if (interactive) return;
        showLabel(event.clientX, event.clientY, 'roll camera');
        window.clearTimeout(moveTimer);
        moveTimer = window.setTimeout(() => {
          if (cursor) cursor.classList.remove('is-visible');
        }, 3000);
      });
      homeCluster.addEventListener('pointerleave', () => {
        showDot(cursorX, cursorY);
      });
    }
  };

  const clampCursorToViewport = (left, top) => {
    if (!cursor || !pill || !dot) return { left, top };
    const node = pill.style.display !== 'none' ? pill : dot;
    const rect = node.getBoundingClientRect();
    const padding = 6;
    const maxLeft = Math.max(padding, window.innerWidth - rect.width - padding);
    const maxTop = Math.max(padding, window.innerHeight - rect.height - padding);
    return {
      left: Math.min(Math.max(left, padding), maxLeft),
      top: Math.min(Math.max(top, padding), maxTop)
    };
  };

  const updateCursorPosition = (x, y, label, overrideOffset = null) => {
    if (!cursor) return;
    const cfg = cursorMap[label] || { x: 18, y: 18, anchor: 'left top' };
    const shift = overrideOffset || cfg;
    const clamped = clampCursorToViewport(x + shift.x, y + shift.y);
    cursor.style.left = `${clamped.left}px`;
    cursor.style.top = `${clamped.top}px`;
    cursor.style.transform = 'translate3d(0, 0, 0)';
    cursor.style.transformOrigin = shift.anchor || cfg.anchor;
    if (activeCursorBg && pill) {
      pill.style.background = activeCursorBg;
    }
  };

  const attachScrollRouting = () => {
    pages.forEach(({ page, rail, axis }) => {
      const isMobileWorks = axis === 'x' && window.matchMedia('(max-width: 768px)').matches;
      if (isMobileWorks) return;
      // On mobile, the project page uses native vertical scroll on .project-shell.
      // Skip JS routing so event.preventDefault() doesn't block touch scroll.
      const isMobileProject = axis === 'y' && window.matchMedia('(max-width: 768px)').matches;
      if (isMobileProject) return;

      let touchStartY = 0;
      let touchStartX = 0;
      let touchActive = false;
      let touchGestureX = 0;
      let touchGestureY = 0;
      let touchBackTriggered = false;
      const scrollTarget = rail;

      const routeScroll = (deltaX, deltaY) => {
        const primaryDelta = Math.abs(deltaX) > Math.abs(deltaY) ? deltaX : deltaY;

        if (axis === 'x') {
          scrollTarget.scrollLeft += deltaY || deltaX;
          return;
        }

        scrollTarget.scrollTop += primaryDelta * 1;
      };

      const maybeGoBackToWorks = (deltaX, deltaY, source) => {
        if (axis !== 'y') return false;
        const horizontalGesture = Math.abs(deltaX) > Math.abs(deltaY) * 1.2;
        if (!horizontalGesture) return false;

        if (source === 'wheel') {
          if (deltaX < -40) {
            window.location.href = '/works/';
            return true;
          }
          return false;
        }

        if (deltaX > 40) {
          touchBackTriggered = true;
          return true;
        }

        return false;
      };

      const wheelHandler = (event) => {
        event.preventDefault();
        if (maybeGoBackToWorks(event.deltaX, event.deltaY, 'wheel')) return;
        routeScroll(event.deltaX, event.deltaY);
      };

      const touchStartHandler = (event) => {
        const touch = event.touches[0];
        if (!touch) return;
        touchStartX = touch.clientX;
        touchStartY = touch.clientY;
        touchActive = true;
        touchGestureX = 0;
        touchGestureY = 0;
        touchBackTriggered = false;
      };

      const touchMoveHandler = (event) => {
        if (!touchActive) return;
        const touch = event.touches[0];
        if (!touch) return;
        const deltaX = touchStartX - touch.clientX;
        const deltaY = touchStartY - touch.clientY;
        touchStartX = touch.clientX;
        touchStartY = touch.clientY;
        touchGestureX += deltaX;
        touchGestureY += deltaY;
        if (maybeGoBackToWorks(touchGestureX, touchGestureY, 'touch')) {
          event.preventDefault();
          return;
        }
        routeScroll(deltaX, deltaY);
        event.preventDefault();
      };

      window.addEventListener(
        'wheel',
        wheelHandler,
        { passive: false, capture: true }
      );

      window.addEventListener(
        'touchstart',
        touchStartHandler,
        { passive: true, capture: true }
      );

      window.addEventListener(
        'touchmove',
        touchMoveHandler,
        { passive: false, capture: true }
      );

      const touchEndHandler = () => {
        if (touchBackTriggered) {
          window.location.href = '/works/';
        }
        touchActive = false;
        touchBackTriggered = false;
      };

      window.addEventListener('touchend', touchEndHandler, { capture: true });
    });
  };

  if (cursor) {
    window.addEventListener('pointermove', (event) => {
      syncCursor(event);
      if (!cursor.classList.contains('is-visible')) {
        showDot(event.clientX, event.clientY);
      }
    });

    window.addEventListener('pointerdown', (event) => {
      syncCursor(event);
      activePointerDown = true;
    });

    window.addEventListener('pointerup', () => {
      activePointerDown = false;
    });

    attachCursorTargets();
    showDot(window.innerWidth / 2, window.innerHeight / 2);
  }

  const homeTitle = document.querySelector('.top-role.active');
  if (homeTitle) {
    homeTitle.setAttribute('role', 'button');
    homeTitle.tabIndex = 0;
    homeTitle.addEventListener('click', () => window.location.reload());
    homeTitle.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        window.location.reload();
      }
    });
  }

  attachScrollRouting();
})();
