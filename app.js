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
  // 2. DYNAMIC PROBLEMS SCANNER FEED
  // ==========================================
  const problems = [
    {
      cat: "ventas",
      catName: "Ventas y clientes",
      icon: "▲",
      title: "Muchos seguidores, pocas ventas",
      desc: "82.000 seguidores no sirven de mucho si no entran clientes a la tienda."
    },
    {
      cat: "ventas",
      catName: "Ventas y clientes",
      icon: "●",
      title: "Clientes que preguntan y desaparecen",
      desc: "Piden precio, preguntan stock y nunca compran."
    },
    {
      cat: "ventas",
      catName: "Ventas y clientes",
      icon: "✖",
      title: "Baja recompra",
      desc: "Muchos clientes compran una vez al año cuando sale un juego importante."
    },
    {
      cat: "ventas",
      catName: "Ventas y clientes",
      icon: "■",
      title: "Ticket medio bajo",
      desc: "Compran un juego pero no accesorios, garantías o complementos."
    },
    {
      cat: "ventas",
      catName: "Ventas y clientes",
      icon: "▲",
      title: "Pérdida de clientes hacia Amazon y tiendas digitales",
      desc: "Steam, PlayStation Store, Xbox Store y Nintendo venden sin costes de tienda física."
    },
    {
      cat: "ventas",
      catName: "Ventas y clientes",
      icon: "●",
      title: "Falta de fidelización",
      desc: "No existe una relación continua con el jugador."
    },
    {
      cat: "operaciones",
      catName: "Operaciones",
      icon: "✖",
      title: "Exceso de stock",
      desc: "Productos que se quedan meses ocupando espacio."
    },
    {
      cat: "operaciones",
      catName: "Operaciones",
      icon: "■",
      title: "Falta de stock",
      desc: "Justo cuando llega un lanzamiento importante."
    },
    {
      cat: "operaciones",
      catName: "Operaciones",
      icon: "▲",
      title: "Mala previsión de demanda",
      desc: "No saber cuántas unidades pedir."
    },
    {
      cat: "operaciones",
      catName: "Operaciones",
      icon: "●",
      title: "Diferencias entre tiendas",
      desc: "Una vende mucho un producto y otra no."
    },
    {
      cat: "operaciones",
      catName: "Operaciones",
      icon: "✖",
      title: "Procesos manuales",
      desc: "Inventario, consultas y tareas administrativas consumen tiempo."
    },
    {
      cat: "marketing",
      catName: "Marketing",
      icon: "■",
      title: "Crear contenido constantemente",
      desc: "Necesitan publicar todos los días."
    },
    {
      cat: "marketing",
      catName: "Marketing",
      icon: "▲",
      title: "No saber qué contenido genera ventas",
      desc: "Muchos likes, pocas compras."
    },
    {
      cat: "marketing",
      catName: "Marketing",
      icon: "●",
      title: "No aprovechar los datos de los clientes",
      desc: "Tienen información pero no la utilizan."
    },
    {
      cat: "marketing",
      catName: "Marketing",
      icon: "✖",
      title: "Campañas genéricas",
      desc: "Todo el mundo recibe el mismo mensaje."
    },
    {
      cat: "atencion",
      catName: "Atención al cliente",
      icon: "■",
      title: "Miles de preguntas repetidas",
      desc: "Disponibilidad, precios, horarios, reservas, preventas."
    },
    {
      cat: "atencion",
      catName: "Atención al cliente",
      icon: "▲",
      title: "Respuestas lentas",
      desc: "El cliente se va a la competencia."
    },
    {
      cat: "atencion",
      catName: "Atención al cliente",
      icon: "●",
      title: "Experiencia distinta según el vendedor",
      desc: "Cada empleado atiende de una forma diferente."
    },
    {
      cat: "direccion",
      catName: "Dirección y crecimiento",
      icon: "✖",
      title: "Tomar decisiones por intuición",
      desc: "No disponer de análisis claros para decidir."
    },
    {
      cat: "direccion",
      catName: "Dirección y crecimiento",
      icon: "■",
      title: "No saber cómo aplicar IA realmente",
      desc: "Todo el mundo habla de IA, pero pocos saben cómo generar ventas reales con ella."
    }
  ];

  const problemsStream = document.getElementById('problems-stream');
  const streamLoader = document.getElementById('stream-loader');
  
  let currentIndex = 0;
  const batchSize = 3;
  let isLoading = false;

  function createProblemCard(problem) {
    const card = document.createElement('div');
    card.className = 'problem-card';
    card.setAttribute('data-cat', problem.cat);
    
    card.innerHTML = `
      <div class="problem-category">${problem.catName}</div>
      <h3 class="problem-title">
        <span class="ico">${problem.icon}</span>
        ${problem.title}
      </h3>
      <p class="problem-desc">${problem.desc}</p>
    `;
    
    return card;
  }

  function loadNextBatch() {
    if (isLoading || currentIndex >= problems.length) return;
    isLoading = true;
    
    if (streamLoader) {
      streamLoader.style.opacity = '1';
    }
    
    setTimeout(() => {
      const end = Math.min(currentIndex + batchSize, problems.length);
      
      // Play glitch sound for subsequent chunks
      if (currentIndex > 0) {
        playSound('glitch');
      }

      for (let i = currentIndex; i < end; i++) {
        const problem = problems[i];
        const card = createProblemCard(problem);
        if (problemsStream) {
          problemsStream.appendChild(card);
        }
        
        // Trigger CSS transition
        setTimeout(() => {
          card.classList.add('animate-in');
        }, (i - currentIndex) * 150);
      }
      
      currentIndex = end;
      isLoading = false;
      
      // Check if all problems are loaded
      if (currentIndex >= problems.length) {
        if (streamLoader) {
          streamLoader.classList.add('completed');
          const loaderTextEl = streamLoader.querySelector('.loader-text');
          if (loaderTextEl) {
            loaderTextEl.innerText = "ESCÁNER COMPLETADO // 20 PUNTOS CRÍTICOS IDENTIFICADOS";
          }
        }
        playSound('levelup');
        loaderObserver.unobserve(streamLoader);
      }
    }, 600);
  }

  const loaderObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !isLoading) {
        loadNextBatch();
      }
    });
  }, {
    root: null,
    rootMargin: '150px',
    threshold: 0.1
  });

  // Initial load
  loadNextBatch();
  
  if (streamLoader) {
    loaderObserver.observe(streamLoader);
  }


  // ==========================================
  // 4. GLOBAL HERO AND CTA BUTTON EVENT WRAPPERS
  // ==========================================
  
  const heroBtn = document.getElementById('heroBtn');
  heroBtn.addEventListener('click', (e) => {
    playSound('coin');
  });

  const ctaBtn = document.getElementById('ctaBtn');
  if (ctaBtn) {
    ctaBtn.addEventListener('click', () => {
      playSound('coin');
    });
  }

});
