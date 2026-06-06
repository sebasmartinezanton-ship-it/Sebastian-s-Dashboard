(function () {
  'use strict';

  /* ─────────────────────────────────────────────
     THEME DEFINITIONS
  ───────────────────────────────────────────── */
  const THEMES = {
    mesh: {
      name: 'Mesh',
      accent: '#6366f1',
      preview: 'radial-gradient(circle at 75% 20%, rgba(99,102,241,0.7) 0%, transparent 55%), radial-gradient(circle at 20% 80%, rgba(0,176,185,0.6) 0%, transparent 55%), radial-gradient(circle at 50% 50%, rgba(236,72,153,0.4) 0%, transparent 60%), #050506',
      layer: function () { return ''; },
    },
    synthwave: {
      name: 'Synth',
      accent: '#ff00ff',
      preview: 'linear-gradient(180deg, #0d0015 0%, #1a0033 45%, #cc0088 70%, #ff6b00 100%)',
      layer: function () {
        return '<div class="sw-stars"></div>' +
               '<div class="sw-sun"></div>' +
               '<div class="sw-horizon"></div>' +
               '<div class="sw-grid"></div>' +
               '<div class="sw-scanlines"></div>';
      },
    },
    aurora: {
      name: 'Aurora',
      accent: '#00e5aa',
      preview: 'linear-gradient(180deg, #060f1a 0%, #0a1929 40%, rgba(0,200,120,0.35) 60%, #0d2137 80%, #060f1a 100%)',
      layer: function () {
        return '<div class="au-band au-1"></div>' +
               '<div class="au-band au-2"></div>' +
               '<div class="au-band au-3"></div>' +
               '<div class="au-ground"></div>' +
               '<div class="au-trees"></div>' +
               '<div class="au-snow"></div>';
      },
    },
    cyberpunk: {
      name: 'Cyber',
      accent: '#00ffff',
      preview: 'linear-gradient(135deg, #000000 0%, #001010 50%, #000510 100%)',
      layer: function () {
        return '<div class="cp-grid"></div>' +
               '<div class="cp-diag"></div>' +
               '<div class="cp-glow-left"></div>' +
               '<div class="cp-glow-right"></div>' +
               '<div class="cp-city"></div>' +
               '<div class="cp-glitch"></div>';
      },
    },
    volcanic: {
      name: 'Volcanic',
      accent: '#ff6600',
      preview: 'radial-gradient(ellipse at 25% 100%, rgba(255,80,0,0.8) 0%, transparent 55%), radial-gradient(ellipse at 85% 100%, rgba(200,20,0,0.7) 0%, transparent 50%), #050000',
      layer: function () {
        var embers = '';
        for (var i = 0; i < 12; i++) {
          var left = (Math.random() * 90 + 5).toFixed(1);
          var delay = (Math.random() * 8).toFixed(2);
          var dur = (3.5 + Math.random() * 5).toFixed(2);
          embers += '<div class="vl-ember" style="left:' + left + '%;animation-delay:' + delay + 's;animation-duration:' + dur + 's"></div>';
        }
        return '<div class="vl-lava vl-1"></div>' +
               '<div class="vl-lava vl-2"></div>' +
               '<div class="vl-lava vl-3"></div>' +
               '<div class="vl-cracks"></div>' +
               embers;
      },
    },
    matrix: {
      name: 'Matrix',
      accent: '#00ff41',
      preview: 'linear-gradient(180deg, #000800 0%, #001200 100%)',
      layer: function () {
        var cols = '';
        for (var i = 0; i < 32; i++) {
          var left   = (i * 3.1 + Math.random() * 1.5).toFixed(1);
          var delay  = (Math.random() * 5).toFixed(2);
          var dur    = (2.5 + Math.random() * 5).toFixed(2);
          var height = (30 + Math.random() * 35).toFixed(0);
          var op     = (0.25 + Math.random() * 0.55).toFixed(2);
          cols += '<div class="mx-col" style="left:' + left + '%;animation-delay:-' + delay + 's;animation-duration:' + dur + 's;height:' + height + '%;opacity:' + op + '"></div>';
        }
        return '<div class="mx-bg"></div>' + cols + '<div class="mx-glow"></div>';
      },
    },
    ocean: {
      name: 'Ocean',
      accent: '#00c8ff',
      preview: 'linear-gradient(180deg, #020b18 0%, #051a38 40%, #061a35 70%, #030d1c 100%)',
      layer: function () {
        var bubbles = '';
        for (var i = 0; i < 14; i++) {
          var left  = (Math.random() * 90 + 5).toFixed(1);
          var size  = (4 + Math.random() * 10).toFixed(1);
          var delay = (Math.random() * 10).toFixed(2);
          var dur   = (5 + Math.random() * 8).toFixed(2);
          bubbles += '<div class="oc-bubble" style="left:' + left + '%;bottom:5%;width:' + size + 'px;height:' + size + 'px;animation-delay:-' + delay + 's;animation-duration:' + dur + 's"></div>';
        }
        return '<div class="oc-caustic oc-c1"></div>' +
               '<div class="oc-caustic oc-c2"></div>' +
               '<div class="oc-caustic oc-c3"></div>' +
               '<div class="oc-surface"></div>' +
               bubbles +
               '<div class="oc-bio oc-bio1"></div>' +
               '<div class="oc-bio oc-bio2"></div>';
      },
    },
    sakura: {
      name: 'Sakura',
      accent: '#ff80aa',
      preview: 'radial-gradient(ellipse at 60% 30%, rgba(255,100,150,0.5) 0%, transparent 55%), radial-gradient(ellipse at 30% 80%, rgba(180,60,120,0.4) 0%, transparent 50%), #1a0d1a',
      layer: function () {
        var petals = '';
        for (var i = 0; i < 18; i++) {
          var left  = (Math.random() * 100).toFixed(1);
          var w     = (6 + Math.random() * 8).toFixed(1);
          var h     = (Math.random() > 0.5 ? w * 0.75 : w * 0.6).toFixed(1);
          var delay = (Math.random() * 14).toFixed(2);
          var dur   = (8 + Math.random() * 10).toFixed(2);
          var rot   = Math.random() > 0.5 ? 'scaleX(-1)' : '';
          petals += '<div class="sk-petal" style="left:' + left + '%;width:' + w + 'px;height:' + h + 'px;animation-delay:-' + delay + 's;animation-duration:' + dur + 's;transform:' + rot + '"></div>';
        }
        return '<div class="sk-mist"></div>' + petals + '<div class="sk-glow"></div>';
      },
    },
    space: {
      name: 'Space',
      accent: '#a855f7',
      preview: 'radial-gradient(ellipse at 20% 20%, rgba(150,0,255,0.5) 0%, transparent 45%), radial-gradient(ellipse at 80% 60%, rgba(255,80,200,0.4) 0%, transparent 45%), radial-gradient(ellipse at 50% 90%, rgba(0,100,255,0.4) 0%, transparent 40%), #00000f',
      layer: function () {
        return '<div class="sp-stars-far"></div>' +
               '<div class="sp-stars-near"></div>' +
               '<div class="sp-nebula sp-n1"></div>' +
               '<div class="sp-nebula sp-n2"></div>' +
               '<div class="sp-nebula sp-n3"></div>' +
               '<div class="sp-flare"></div>';
      },
    },
    blueprint: {
      name: 'Blueprint',
      accent: '#60a5fa',
      preview: 'linear-gradient(160deg, #0a1e3a 0%, #0d2847 60%, #0a2040 100%)',
      layer: function () {
        return '<div class="bp-grid-major"></div>' +
               '<div class="bp-grid-minor"></div>' +
               '<div class="bp-origin"></div>' +
               '<div class="bp-crosshair"></div>' +
               '<div class="bp-corner bp-tl"></div>' +
               '<div class="bp-corner bp-tr"></div>' +
               '<div class="bp-corner bp-bl"></div>' +
               '<div class="bp-corner bp-br"></div>';
      },
    },
    brutalist: {
      name: 'Brutal',
      accent: '#dc2626',
      preview: 'repeating-linear-gradient(-45deg, transparent, transparent 6px, rgba(220,38,38,0.15) 6px, rgba(220,38,38,0.15) 12px), #1c1c1c',
      layer: function () {
        return '<div class="br-concrete"></div>' +
               '<div class="br-grid"></div>' +
               '<div class="br-block br-b1"></div>' +
               '<div class="br-block br-b2"></div>' +
               '<div class="br-stripe"></div>' +
               '<div class="br-accent"></div>';
      },
    },
    liquid: {
      name: 'Liquid',
      accent: '#c8d0ff',
      preview: 'linear-gradient(135deg, #111115 0%, #1e1e2a 35%, #181820 65%, #111115 100%)',
      layer: function () {
        return '<div class="lm-base"></div>' +
               '<div class="lm-blob lm-b1"></div>' +
               '<div class="lm-blob lm-b2"></div>' +
               '<div class="lm-blob lm-b3"></div>' +
               '<div class="lm-sheen"></div>' +
               '<div class="lm-mercury"></div>';
      },
    },
    topo: {
      name: 'Topo',
      accent: '#7eb8e8',
      preview: 'radial-gradient(circle at 55% 45%, rgba(100,180,255,0.3) 0%, transparent 40%), radial-gradient(circle at 20% 70%, rgba(80,160,255,0.2) 0%, transparent 40%), #080e18',
      layer: function () {
        return '<div class="tg-lines tg-l1"></div>' +
               '<div class="tg-lines tg-l2"></div>' +
               '<div class="tg-lines tg-l3"></div>' +
               '<div class="tg-glow"></div>';
      },
    },
    zen: {
      name: 'Zen',
      accent: '#5c5fa0',
      preview: 'repeating-linear-gradient(168deg, transparent 0px, transparent 9px, rgba(180,155,120,0.18) 9px, rgba(180,155,120,0.18) 10px), #f5f1e8',
      layer: function () {
        return '<div class="zn-sand"></div>' +
               '<div class="zn-waves"></div>' +
               '<div class="zn-accent"></div>' +
               '<div class="zn-stone zn-s1"></div>' +
               '<div class="zn-stone zn-s2"></div>' +
               '<div class="zn-stone zn-s3"></div>';
      },
    },
    forest: {
      name: 'Forest',
      accent: '#22c55e',
      preview: 'radial-gradient(ellipse at 30% 80%, rgba(0,100,20,0.6) 0%, transparent 50%), radial-gradient(ellipse at 80% 60%, rgba(0,60,10,0.5) 0%, transparent 50%), #020a06',
      layer: function () {
        var fireflies = '';
        for (var i = 0; i < 18; i++) {
          var left  = (5 + Math.random() * 90).toFixed(1);
          var bot   = (10 + Math.random() * 60).toFixed(1);
          var delay = (Math.random() * 10).toFixed(2);
          var dur   = (4 + Math.random() * 6).toFixed(2);
          fireflies += '<div class="fo-firefly" style="left:' + left + '%;bottom:' + bot + '%;animation-delay:-' + delay + 's;animation-duration:' + dur + 's"></div>';
        }
        return '<div class="fo-ambient fo-a1"></div>' +
               '<div class="fo-ambient fo-a2"></div>' +
               '<div class="fo-trees-back"></div>' +
               '<div class="fo-trees-front"></div>' +
               '<div class="fo-mist"></div>' +
               fireflies;
      },
    },
  };

  var current = 'mesh';
  var animEnabled = true;
  var panelOpen = false;

  /* ─────────────────────────────────────────────
     APPLY THEME
  ───────────────────────────────────────────── */
  function applyTheme(name, skipSave) {
    if (!THEMES[name]) name = 'mesh';
    current = name;

    // Fade effect
    document.documentElement.classList.add('theme-switching');
    setTimeout(function () {
      document.documentElement.classList.remove('theme-switching');
    }, 200);

    // Set data-theme on <html>
    document.documentElement.setAttribute('data-theme', name);

    // Update theme layer
    var layer = document.getElementById('theme-layer');
    if (layer) {
      layer.innerHTML = THEMES[name].layer();
      // Re-randomize volcanic embers on each apply (already random from factory fn)
    }

    // Update animations state
    applyAnimationState();

    // Update switcher UI
    updateSwitcherActive(name);

    // Save preference
    if (!skipSave) {
      try { localStorage.setItem('dashboard-theme', name); } catch (e) {}
    }
  }

  /* ─────────────────────────────────────────────
     ANIMATION TOGGLE
  ───────────────────────────────────────────── */
  function applyAnimationState() {
    if (!animEnabled) {
      document.documentElement.style.setProperty('--anim-play-state', 'paused');
      addNoAnimStyle();
    } else {
      document.documentElement.style.removeProperty('--anim-play-state');
      removeNoAnimStyle();
    }
  }

  function addNoAnimStyle() {
    if (document.getElementById('no-anim-style')) return;
    var s = document.createElement('style');
    s.id = 'no-anim-style';
    s.textContent = '#theme-layer *, #theme-layer { animation-play-state: paused !important; } body::before { animation-play-state: paused !important; }';
    document.head.appendChild(s);
  }

  function removeNoAnimStyle() {
    var s = document.getElementById('no-anim-style');
    if (s) s.parentNode.removeChild(s);
  }

  /* ─────────────────────────────────────────────
     UPDATE SWITCHER ACTIVE STATE
  ───────────────────────────────────────────── */
  function updateSwitcherActive(name) {
    var items = document.querySelectorAll('.tp-theme');
    items.forEach(function (el) {
      if (el.dataset.theme === name) {
        el.classList.add('active');
        el.style.setProperty('--tp-accent', THEMES[name].accent);
      } else {
        el.classList.remove('active');
      }
    });
    var toggle = document.getElementById('tp-anim-toggle');
    if (toggle) toggle.classList.toggle('on', animEnabled);
  }

  /* ─────────────────────────────────────────────
     BUILD SWITCHER UI
  ───────────────────────────────────────────── */
  function buildSwitcherUI() {
    // Floating button
    var btn = document.createElement('button');
    btn.id = 'theme-btn';
    btn.setAttribute('aria-label', 'Switch theme');
    btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M2 12h3M19 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12"/></svg>';
    document.body.appendChild(btn);

    // Panel
    var panel = document.createElement('div');
    panel.id = 'theme-panel';
    panel.classList.add('hidden');

    var themeKeys = Object.keys(THEMES);
    var gridItems = themeKeys.map(function (key) {
      var t = THEMES[key];
      return '<div class="tp-theme" data-theme="' + key + '">' +
        '<div class="tp-preview" style="background:' + t.preview + '"></div>' +
        '<span class="tp-name">' + t.name + '</span>' +
        '</div>';
    }).join('');

    panel.innerHTML =
      '<div class="tp-title">Theme</div>' +
      '<div class="tp-grid">' + gridItems + '</div>' +
      '<div class="tp-divider"></div>' +
      '<div class="tp-anim-row">' +
        '<span class="tp-anim-label">' +
          '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>' +
          'Animations' +
        '</span>' +
        '<div class="tp-toggle on" id="tp-anim-toggle"></div>' +
      '</div>';

    document.body.appendChild(panel);

    // Wire theme clicks
    panel.querySelectorAll('.tp-theme').forEach(function (el) {
      el.addEventListener('click', function () {
        applyTheme(el.dataset.theme);
        closePanel();
      });
    });

    // Wire animation toggle
    var animToggle = document.getElementById('tp-anim-toggle');
    animToggle.addEventListener('click', function () {
      animEnabled = !animEnabled;
      animToggle.classList.toggle('on', animEnabled);
      applyAnimationState();
      try { localStorage.setItem('dashboard-anim', animEnabled ? '1' : '0'); } catch (e) {}
    });

    // Wire button
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      togglePanel();
    });

    // Close on outside click
    document.addEventListener('click', function (e) {
      if (panelOpen && !panel.contains(e.target) && e.target !== btn) {
        closePanel();
      }
    });
  }

  function togglePanel() {
    panelOpen ? closePanel() : openPanel();
  }
  function openPanel() {
    panelOpen = true;
    var panel = document.getElementById('theme-panel');
    if (panel) panel.classList.remove('hidden');
  }
  function closePanel() {
    panelOpen = false;
    var panel = document.getElementById('theme-panel');
    if (panel) panel.classList.add('hidden');
  }

  /* ─────────────────────────────────────────────
     INIT
  ───────────────────────────────────────────── */
  function init() {
    // Inject theme layer div (behind everything)
    var layer = document.createElement('div');
    layer.id = 'theme-layer';
    document.body.insertBefore(layer, document.body.firstChild);

    // Load saved preferences
    var savedTheme, savedAnim;
    try {
      savedTheme = localStorage.getItem('dashboard-theme') || 'mesh';
      savedAnim  = localStorage.getItem('dashboard-anim');
    } catch (e) {
      savedTheme = 'mesh';
    }
    animEnabled = savedAnim !== '0';

    // Build UI
    buildSwitcherUI();

    // Apply saved theme (skipSave=true since it's already saved)
    applyTheme(savedTheme, true);
  }

  // Run after DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
