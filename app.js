// Play N Trade - Retail AI Landing Page Interactivity & Web Audio engine

document.addEventListener('DOMContentLoaded', () => {
  
  // ==========================================
  // 1. WEB AUDIO API SYNTHESIZER ENGINE
  // ==========================================
  let audioCtx = null;
  let isMuted = true;

  const audioToggleBtn = document.getElementById('audioToggle');
  const audioIcon = document.getElementById('audioIcon');
  const audioText = document.getElementById('audioText');

  // SVG Paths for Audio Toggle
  const SVG_MUTE = "M16.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77zM3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z";
  const SVG_UNMUTE = "M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z";

  function initAudio() {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  function playSound(type) {
    if (isMuted) return;
    initAudio();
    
    const now = audioCtx.currentTime;
    
    if (type === 'coin') {
      // Retro ascending chime (level enter)
      const osc1 = audioCtx.createOscillator();
      const osc2 = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      
      osc1.type = 'square';
      osc2.type = 'square';
      
      osc1.frequency.setValueAtTime(523.25, now); // C5
      osc1.frequency.setValueAtTime(659.25, now + 0.1); // E5
      osc1.frequency.setValueAtTime(783.99, now + 0.2); // G5
      osc1.frequency.setValueAtTime(1046.50, now + 0.3); // C6
      
      osc2.frequency.setValueAtTime(261.63, now); // C4
      osc2.frequency.setValueAtTime(329.63, now + 0.1); // E4
      
      gainNode.gain.setValueAtTime(0.1, now);
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
      
      osc1.connect(gainNode);
      osc2.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      
      osc1.start(now);
      osc1.stop(now + 0.5);
      osc2.start(now);
      osc2.stop(now + 0.3);
      
    } else if (type === 'levelup') {
      // Classic gaming powerup chime
      const osc = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(330, now); // E4
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.15); // A5
      osc.frequency.setValueAtTime(1320, now + 0.15); // E6
      osc.frequency.exponentialRampToValueAtTime(1760, now + 0.4); // A6
      
      gainNode.gain.setValueAtTime(0.15, now);
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.55);
      
      osc.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      
      osc.start(now);
      osc.stop(now + 0.6);
      
    } else if (type === 'glitch') {
      // Dynamic low alarm glitch sweep
      const osc = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(180, now);
      osc.frequency.linearRampToValueAtTime(80, now + 0.2);
      osc.frequency.setValueAtTime(120, now + 0.2);
      osc.frequency.linearRampToValueAtTime(60, now + 0.4);
      
      gainNode.gain.setValueAtTime(0.12, now);
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.45);
      
      osc.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      
      osc.start(now);
      osc.stop(now + 0.5);
      
    } else if (type === 'click') {
      // Short select click sound
      const osc = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.exponentialRampToValueAtTime(150, now + 0.08);
      
      gainNode.gain.setValueAtTime(0.08, now);
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
      
      osc.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      
      osc.start(now);
      osc.stop(now + 0.1);
    }
  }

  // Audio Toggle Button handler
  audioToggleBtn.addEventListener('click', () => {
    isMuted = !isMuted;
    initAudio();
    if (isMuted) {
      audioIcon.innerHTML = `<path d="${SVG_MUTE}" />`;
      audioText.innerText = "SONIDO: OFF";
    } else {
      audioIcon.innerHTML = `<path d="${SVG_UNMUTE}" />`;
      audioText.innerText = "SONIDO: ON";
      playSound('coin');
    }
  });


  // ==========================================
  // 2. SCROLL EVENTS & INTERSECTION OBSERVER
  // ==========================================
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15
  };

  const levelObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
        
        // Trigger small entry animations
        const cardId = entry.target.id;
        const levelNum = cardId.replace('level-', '');
        
        // Custom widget entries
        if (levelNum === '1') {
          animateL1Counter();
        } else if (levelNum === '9') {
          animateL9Map();
        }
      }
    });
  }, observerOptions);

  // Observe all level cards
  document.querySelectorAll('.level-card').forEach(card => {
    levelObserver.observe(card);
  });


  // ==========================================
  // 3. LEVEL SPECIFIC CONTROLLERS & ACTIONS
  // ==========================================

  // Level 1: Follower Counter Count-Up
  let l1CounterAnimated = false;
  function animateL1Counter() {
    if (l1CounterAnimated) return;
    l1CounterAnimated = true;
    
    const counterEl = document.getElementById('l1-counter');
    let count = 0;
    const target = 82800;
    const duration = 1200; // ms
    const startTime = performance.now();
    
    function update(timestamp) {
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing out quadratic
      const easeVal = progress * (2 - progress);
      const currentVal = Math.floor(easeVal * target);
      
      counterEl.innerText = currentVal.toLocaleString('es-ES');
      
      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        counterEl.innerText = target.toLocaleString('es-ES');
      }
    }
    requestAnimationFrame(update);
  }

  // Level 5: Personalized Recommendations Selector
  const l5Tabs = [
    { id: 'l5-c1', name: 'PlayStation', offer: 'Recomendado: 15% Descuento en Mandos DualSense + PS Plus' },
    { id: 'l5-c2', name: 'Nintendo', offer: 'Recomendado: Reserva Mario Wonders con Pegatinas Especiales' },
    { id: 'l5-c3', name: 'PC', offer: 'Recomendado: 20% Dto en Teclados Mecánicos e Interruptores' },
    { id: 'l5-c4', name: 'Xbox', offer: 'Recomendado: Canjea 3 Meses de Game Pass Ultimate' }
  ];

  l5Tabs.forEach(tab => {
    const el = document.getElementById(tab.id);
    if (el) {
      el.addEventListener('click', () => {
        playSound('click');
        // Clear all active
        l5Tabs.forEach(t => document.getElementById(t.id).classList.remove('active-profile'));
        // Activate current
        el.classList.add('active-profile');
        // Update labels
        document.getElementById('l5-offer').innerText = `Filtro Activo: Oferta especial para fans de ${tab.name}`;
        
        const card = document.getElementById('level-5');
        if (card.classList.contains('solution-active')) {
          document.getElementById('l5-custom-rec').innerText = tab.offer;
        } else {
          document.getElementById('l5-custom-rec').innerText = "Oferta personalizada oculta. ¡Activa la IA!";
        }
      });
    }
  });

  // Level 9: Map stores connection animation
  function animateL9Map() {
    // Add glowing lines dynamically to store locations if active
    const mapContainer = document.querySelector('.l9-map-container');
    const markers = document.querySelectorAll('.map-marker');
    
    // Connect markers with SVG paths on map if solution is active
    const card = document.getElementById('level-9');
    if (card.classList.contains('solution-active')) {
      // Connect markers
      let svg = mapContainer.querySelector('.l9-map-svg');
      // Clear old connection lines if any
      svg.querySelectorAll('.conn-line').forEach(l => l.remove());
      
      const positions = [
        { x: '30%', y: '40%' },
        { x: '45%', y: '50%' },
        { x: '55%', y: '35%' },
        { x: '70%', y: '60%' }
      ];
      
      // Draw dynamic lines
      for (let i = 0; i < positions.length - 1; i++) {
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('class', 'conn-line');
        line.setAttribute('x1', parseFloat(positions[i].x) * 4 + '%');
        line.setAttribute('y1', parseFloat(positions[i].y) * 1.8 + '%');
        line.setAttribute('x2', parseFloat(positions[i+1].x) * 4 + '%');
        line.setAttribute('y2', parseFloat(positions[i+1].y) * 1.8 + '%');
        line.setAttribute('stroke', '#00ffd2');
        line.setAttribute('stroke-width', '2px');
        line.setAttribute('stroke-dasharray', '5 5');
        line.setAttribute('style', 'animation: dash 1s linear infinite; opacity: 0.8;');
        
        svg.appendChild(line);
      }
    }
  }


  // ==========================================
  // 4. SOLUTION TOGGLE TRIGGER CONTROLLERS
  // ==========================================
  const activateButtons = document.querySelectorAll('.btn-activate-solution');

  activateButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const levelNum = btn.getAttribute('data-level');
      const card = document.getElementById(`level-${levelNum}`);
      const tag = document.getElementById(`tag-${levelNum}`);
      
      if (card.classList.contains('problem-active')) {
        // ACTIVATE IA SOLUTION
        card.classList.remove('problem-active');
        card.classList.add('solution-active');
        tag.innerText = "SOLUCIÓN IA COMPILADA";
        btn.innerText = "Ver Problema de nuevo";
        playSound('levelup');

        // Execute specific level transition adjustments
        triggerLevelSpecialEffect(levelNum, true);
      } else {
        // BACK TO PROBLEM STATE
        card.classList.remove('solution-active');
        card.classList.add('problem-active');
        tag.innerText = "PROBLEMA DETECTADO";
        btn.innerText = "Activar Solución IA";
        playSound('glitch');

        triggerLevelSpecialEffect(levelNum, false);
      }
    });
  });

  // Level-specific dynamic state toggles
  function triggerLevelSpecialEffect(level, active) {
    if (level === '1') {
      const stream = document.getElementById('l1-stream');
      const dots = document.getElementById('l1-dots');
      const label = document.getElementById('l1-funnel-label');
      
      if (active) {
        label.innerText = "Flujo continuo de compradores";
        dots.innerHTML = `
          <div class="buyer-dot"></div>
          <div class="buyer-dot"></div>
          <div class="buyer-dot"></div>
          <div class="buyer-dot"></div>
          <div class="buyer-dot"></div>
        `;
      } else {
        label.innerText = "Pocos compradores reales";
        dots.innerHTML = `<div class="buyer-dot"></div>`;
      }
    }
    
    if (level === '4') {
      const badge = document.getElementById('l4-badge');
      if (active) {
        badge.innerText = "IN STOCK (AUTO)";
      } else {
        badge.innerText = "OUT OF STOCK";
      }
    }
    
    if (level === '5') {
      const recLabel = document.getElementById('l5-custom-rec');
      if (active) {
        const activeTab = document.querySelector('.l5-card.active-profile');
        const tabData = l5Tabs.find(t => t.id === activeTab.id);
        recLabel.innerText = tabData.offer;
      } else {
        recLabel.innerText = "Oferta personalizada oculta. ¡Activa la IA!";
      }
    }
    
    if (level === '8') {
      const rec = document.getElementById('l8-recommendation');
      if (active) {
        rec.innerText = "RECOMENDACIÓN: Mando Switch Pro con 15% Descuento";
      } else {
        rec.innerText = "Sin recomendaciones en pantalla";
      }
    }
    
    if (level === '9') {
      animateL9Map();
    }
    
    if (level === '10') {
      const text = document.getElementById('l10-display');
      if (active) {
        text.innerText = "LEVEL UP";
      } else {
        text.innerText = "GAME OVER";
      }
    }
  }


  // ==========================================
  // 5. GLOBAL HERO AND CTA BUTTON EVENT WRAPPERS
  // ==========================================
  
  const heroBtn = document.getElementById('heroBtn');
  heroBtn.addEventListener('click', (e) => {
    playSound('coin');
  });

  const ctaBtn = document.getElementById('ctaBtn');
  ctaBtn.addEventListener('click', () => {
    playSound('coin');
    // Open a prompt message or register alert to start
    alert('🎮 ¡PARTIDA INICIADA! Reservando tu espacio en la conferencia virtual con Pau Martí Felip...');
  });

});
