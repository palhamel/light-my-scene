/* ========================================
   Light App - Core Logic
   Phase 1-4: Color Light + Custom Colors + Motion FX + Polish
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {
  const body = document.body;
  const controlPanel = document.querySelector('.control-panel');
  const swatches = document.querySelectorAll('.swatch');
  const intensitySlider = document.getElementById('intensity-slider');
  const intensityOverlay = document.querySelector('.intensity-overlay');
  const fullscreenBtn = document.getElementById('fullscreen-btn');
  const hexInput = document.getElementById('hex-input');
  const hexWrapper = document.querySelector('.hex-input-wrapper');
  const hexApplyBtn = document.getElementById('hex-apply-btn');
  const pickerBtn = document.getElementById('picker-btn');
  const colorPicker = document.getElementById('color-picker');
  const recentColorsSection = document.getElementById('recent-colors');
  const recentSwatchesContainer = document.getElementById('recent-swatches');
  const fxButtons = document.querySelectorAll('.fx-btn');
  const speedToggle = document.getElementById('speed-toggle');
  const speedButtons = document.querySelectorAll('.speed-btn');

  let currentColor = '#2A2A2A';
  let recentColors = [];
  let activeSceneId = null;
  let sceneFrameId = null;
  let speedMultiplier = 1.0;

  // --- Core Color Management ---

  const setActiveColor = (hex, source) => {
    // Stop any running scene when a static color is selected
    stopScene();

    currentColor = hex.toUpperCase();
    body.style.backgroundColor = currentColor;

    // Re-enable CSS transition for smooth static color changes
    body.style.transition = 'background-color 0.15s ease';

    // Update hex input
    hexInput.value = currentColor.replace('#', '');
    hexWrapper.classList.remove('invalid');
    hexWrapper.classList.add('valid');

    // Update color picker button and native input
    pickerBtn.style.backgroundColor = currentColor;
    colorPicker.value = currentColor;

    // Deselect all preset swatches
    swatches.forEach(s => s.classList.remove('active'));

    // Deselect all recent swatches
    const recentBtns = recentSwatchesContainer.querySelectorAll('.recent-swatch');
    recentBtns.forEach(s => s.classList.remove('active'));

    // Highlight the matching preset swatch if this color came from one
    if (source === 'preset') {
      const match = document.querySelector(`.swatch[data-color="${currentColor}"]`);
      if (match) match.classList.add('active');
    }

    // Highlight the matching recent swatch if this color came from one
    if (source === 'recent') {
      recentBtns.forEach(btn => {
        if (btn.dataset.color === currentColor) {
          btn.classList.add('active');
        }
      });
    }
  };

  // --- Preset Swatches ---

  swatches.forEach(swatch => {
    swatch.addEventListener('click', () => {
      setActiveColor(swatch.dataset.color, 'preset');
    });
  });

  // No preset swatch selected on load (default is dark gray)

  // --- Hex Input ---

  const isValidHex = (str) => /^[0-9A-Fa-f]{3}$|^[0-9A-Fa-f]{6}$/.test(str);

  const expandShortHex = (str) => {
    if (str.length === 3) {
      return str[0] + str[0] + str[1] + str[1] + str[2] + str[2];
    }
    return str;
  };

  hexInput.addEventListener('input', () => {
    const raw = hexInput.value.replace('#', '').trim();
    if (raw.length === 0) {
      hexWrapper.classList.remove('invalid', 'valid');
    } else if (isValidHex(raw)) {
      hexWrapper.classList.remove('invalid');
      hexWrapper.classList.add('valid');
    } else {
      hexWrapper.classList.remove('valid');
      hexWrapper.classList.add('invalid');
    }
  });

  const applyHexInput = () => {
    const raw = hexInput.value.replace('#', '').trim();
    if (isValidHex(raw)) {
      const expanded = expandShortHex(raw);
      const hex = '#' + expanded.toUpperCase();
      setActiveColor(hex, 'hex');
      addRecentColor(hex);
      hexInput.blur();
    }
  };

  hexInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      applyHexInput();
    }
  });

  hexApplyBtn.addEventListener('click', applyHexInput);

  // --- Color Picker ---

  colorPicker.addEventListener('input', () => {
    const hex = colorPicker.value.toUpperCase();
    setActiveColor(hex, 'picker');
  });

  colorPicker.addEventListener('change', () => {
    const hex = colorPicker.value.toUpperCase();
    addRecentColor(hex);
  });

  // --- Recent Colors ---

  const addRecentColor = (hex) => {
    hex = hex.toUpperCase();
    const isPreset = Array.from(swatches).some(s => s.dataset.color === hex);
    if (isPreset) return;

    recentColors = recentColors.filter(c => c !== hex);
    recentColors.unshift(hex);
    if (recentColors.length > 5) {
      recentColors.pop();
    }
    renderRecentColors();
  };

  const renderRecentColors = () => {
    recentSwatchesContainer.innerHTML = '';

    if (recentColors.length === 0) {
      recentColorsSection.classList.add('hidden');
      return;
    }

    recentColorsSection.classList.remove('hidden');

    recentColors.forEach(hex => {
      const btn = document.createElement('button');
      btn.className = 'recent-swatch';
      btn.dataset.color = hex;
      btn.style.backgroundColor = hex;
      btn.setAttribute('aria-label', `Recent color ${hex}`);

      if (hex === currentColor) {
        btn.classList.add('active');
      }

      btn.addEventListener('click', () => {
        setActiveColor(hex, 'recent');
      });

      recentSwatchesContainer.appendChild(btn);
    });
  };

  // --- FX Scene Engine ---

  const stopScene = () => {
    if (sceneFrameId) {
      cancelAnimationFrame(sceneFrameId);
      sceneFrameId = null;
    }
    activeSceneId = null;

    // Deselect all FX buttons
    fxButtons.forEach(btn => btn.classList.remove('active'));

    // Hide speed toggle
    speedToggle.classList.add('hidden');

    // Re-enable CSS transition
    body.style.transition = 'background-color 0.15s ease';
  };

  const startScene = (sceneId) => {
    // If tapping the already-active scene, stop it
    if (activeSceneId === sceneId) {
      stopScene();
      body.style.backgroundColor = currentColor;
      return;
    }

    // Stop previous scene if any
    if (sceneFrameId) {
      cancelAnimationFrame(sceneFrameId);
      sceneFrameId = null;
    }

    activeSceneId = sceneId;

    // Disable CSS transition for instant color changes during animation
    body.style.transition = 'none';

    // Highlight active FX button
    fxButtons.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.scene === sceneId);
    });

    // Deselect preset and recent swatches
    swatches.forEach(s => s.classList.remove('active'));
    const recentBtns = recentSwatchesContainer.querySelectorAll('.recent-swatch');
    recentBtns.forEach(s => s.classList.remove('active'));

    // Update hex input
    hexInput.value = '--';
    hexWrapper.classList.remove('invalid', 'valid');

    // Show speed toggle
    speedToggle.classList.remove('hidden');

    // Start the scene
    const scenes = { police: scenePolice, fire: sceneFire, storm: sceneStorm };
    if (scenes[sceneId]) {
      scenes[sceneId]();
    }
  };

  // --- Police Alert Lights ---

  const scenePolice = () => {
    const colors = ['#FF0000', '#000000', '#0044FF', '#000000'];
    let step = 0;
    let lastTime = performance.now();

    const baseDurations = [300, 80, 300, 80];

    const loop = (now) => {
      if (activeSceneId !== 'police') return;

      const duration = baseDurations[step] / speedMultiplier;

      if (now - lastTime >= duration) {
        body.style.backgroundColor = colors[step];
        step = (step + 1) % colors.length;
        lastTime = now;
      }

      sceneFrameId = requestAnimationFrame(loop);
    };

    body.style.backgroundColor = colors[0];
    sceneFrameId = requestAnimationFrame(loop);
  };

  // --- Fire Flicker ---

  const sceneFire = () => {
    const palette = ['#FF4500', '#FF6600', '#FF8C00', '#FFB347', '#CC2200'];
    let lastTime = performance.now();
    let nextInterval = 120;

    const loop = (now) => {
      if (activeSceneId !== 'fire') return;

      if (now - lastTime >= nextInterval) {
        const color = palette[Math.floor(Math.random() * palette.length)];
        body.style.backgroundColor = color;
        // Randomize next interval: 80-200ms at medium speed
        nextInterval = (80 + Math.random() * 120) / speedMultiplier;
        lastTime = now;
      }

      sceneFrameId = requestAnimationFrame(loop);
    };

    body.style.backgroundColor = palette[0];
    sceneFrameId = requestAnimationFrame(loop);
  };

  // --- Lightning Storm ---

  const sceneStorm = () => {
    const baseColor = '#1a1a2e';
    const flashColor = '#FFFFFF';
    let lastTime = performance.now();
    let state = 'dark';
    let flashesLeft = 0;
    let nextDuration = 1000 + Math.random() * 3000;

    const loop = (now) => {
      if (activeSceneId !== 'storm') return;

      const elapsed = now - lastTime;

      if (state === 'dark' && elapsed >= nextDuration / speedMultiplier) {
        // Start a flash burst
        flashesLeft = 2 + Math.floor(Math.random() * 2); // 2-3 flashes
        state = 'flash-on';
        body.style.backgroundColor = flashColor;
        lastTime = now;
        nextDuration = 50 + Math.random() * 70; // flash duration 50-120ms
      } else if (state === 'flash-on' && elapsed >= nextDuration / speedMultiplier) {
        // End this flash
        body.style.backgroundColor = baseColor;
        flashesLeft--;
        lastTime = now;

        if (flashesLeft > 0) {
          state = 'flash-gap';
          nextDuration = 80; // gap between flashes
        } else {
          state = 'dark';
          nextDuration = 1000 + Math.random() * 3000; // dark pause 1-4s
        }
      } else if (state === 'flash-gap' && elapsed >= nextDuration / speedMultiplier) {
        // Start next flash in burst
        state = 'flash-on';
        body.style.backgroundColor = flashColor;
        lastTime = now;
        nextDuration = 50 + Math.random() * 70;
      }

      sceneFrameId = requestAnimationFrame(loop);
    };

    body.style.backgroundColor = baseColor;
    sceneFrameId = requestAnimationFrame(loop);
  };

  // --- FX Button Handlers ---

  fxButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      startScene(btn.dataset.scene);
    });
  });

  // --- Speed Toggle ---

  speedButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      speedMultiplier = parseFloat(btn.dataset.speed);

      speedButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Restart the active scene with new speed
      if (activeSceneId) {
        const currentScene = activeSceneId;
        cancelAnimationFrame(sceneFrameId);
        sceneFrameId = null;

        const scenes = { police: scenePolice, fire: sceneFire, storm: sceneStorm };
        if (scenes[currentScene]) {
          scenes[currentScene]();
        }
      }
    });
  });

  // --- Intensity Slider ---

  const updateIntensity = (value) => {
    intensityOverlay.style.opacity = 1 - (value / 100);
  };

  intensitySlider.addEventListener('input', () => {
    updateIntensity(intensitySlider.value);
  });

  // --- Fullscreen Toggle ---

  const enterFullscreen = () => {
    const el = document.documentElement;
    if (el.requestFullscreen) {
      el.requestFullscreen();
    } else if (el.webkitRequestFullscreen) {
      el.webkitRequestFullscreen();
    }
  };

  const exitFullscreen = () => {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    }
  };

  const isFullscreen = () => {
    return !!(document.fullscreenElement || document.webkitFullscreenElement);
  };

  let panelHidden = false;

  const hideControls = () => {
    controlPanel.classList.add('hidden');
    panelHidden = true;
    // Attempt fullscreen on supported browsers (silent fail on iPad)
    enterFullscreen();
  };

  const showControls = () => {
    controlPanel.classList.remove('hidden');
    panelHidden = false;
  };

  fullscreenBtn.addEventListener('click', () => {
    hideControls();
  });

  // When fullscreen is exited externally (e.g. Esc key), show controls
  const onFullscreenChange = () => {
    if (!isFullscreen() && panelHidden) {
      showControls();
    }
  };

  document.addEventListener('fullscreenchange', onFullscreenChange);
  document.addEventListener('webkitfullscreenchange', onFullscreenChange);

  // --- Tap-to-Show Controls ---

  // Prevent clicks inside control panel from toggling it
  controlPanel.addEventListener('click', (e) => {
    e.stopPropagation();
  });

  body.addEventListener('click', () => {
    if (!panelHidden) return;
    showControls();
  });

  // --- Keyboard Shortcuts ---

  const presetKeys = ['1', '2', '3', '4', '5', '6'];
  const swatchArray = Array.from(swatches);

  document.addEventListener('keydown', (e) => {
    // Skip if typing in hex input
    if (document.activeElement === hexInput) return;

    if (e.key === ' ' || e.code === 'Space') {
      e.preventDefault();
      if (panelHidden) {
        showControls();
        if (isFullscreen()) exitFullscreen();
      } else {
        hideControls();
      }
    }

    if (presetKeys.includes(e.key)) {
      const index = parseInt(e.key) - 1;
      if (swatchArray[index]) {
        setActiveColor(swatchArray[index].dataset.color, 'preset');
      }
    }
  });

  // --- Wake Lock API ---

  let wakeLock = null;

  const requestWakeLock = async () => {
    try {
      if ('wakeLock' in navigator) {
        wakeLock = await navigator.wakeLock.request('screen');
      }
    } catch (err) {
      // Silent failure -- wake lock not supported or denied
    }
  };

  // Request on load
  requestWakeLock();

  // Re-request when tab becomes visible again
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      requestWakeLock();
    }
  });

  // --- Info Overlay ---

  const infoBtn = document.getElementById('info-btn');
  const infoOverlay = document.getElementById('info-overlay');
  const infoCloseBtn = document.getElementById('info-close-btn');

  infoBtn.addEventListener('click', () => {
    infoOverlay.classList.add('visible');
  });

  infoCloseBtn.addEventListener('click', () => {
    infoOverlay.classList.remove('visible');
  });

  infoOverlay.addEventListener('click', (e) => {
    if (e.target === infoOverlay) {
      infoOverlay.classList.remove('visible');
    }
    e.stopPropagation();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && infoOverlay.classList.contains('visible')) {
      infoOverlay.classList.remove('visible');
    }
  });

  // --- Service Worker Registration ---

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('service-worker.js').catch(() => {
      // Silent failure -- service worker not critical
    });
  }
});
