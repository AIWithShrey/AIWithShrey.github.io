document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');

  // Neural Colors
  const colors = {
    bg: '#050505',
    node: 'rgba(242, 233, 0, ', // Yellow
    synapse: 'rgba(217, 32, 49, ' // Red
  };

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  let mouse = { x: undefined, y: undefined };
  let neurons = [];
  let logoSpots = [];
  let imagesLoaded = 0;

  // Logo definitions - prioritized logos only
  const logos = [
    { name: 'kubernetes', url: 'https://raw.githubusercontent.com/cncf/artwork/main/projects/kubernetes/icon/color/kubernetes-icon-color.svg' },
    { name: 'kyverno', url: 'https://raw.githubusercontent.com/cncf/artwork/main/projects/kyverno/icon/color/kyverno-icon-color.svg' },
    { name: 'linux', url: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/linux/linux-original.svg' },
    { name: 'nirmata', url: 'https://nirmata.com/wp-content/uploads/2023/11/nirmata-icon.svg' },
    { name: 'pytorch', url: 'https://raw.githubusercontent.com/pytorch/pytorch/main/docs/source/_static/img/pytorch-logo-flame.svg' },
    { name: 'claude', url: '/assets/images/claude-icon.svg' }
  ];

  // Load all logo images
  function loadLogos() {
    logos.forEach(logo => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        logo.image = img;
        logo.loaded = true;
        imagesLoaded++;
        console.log(`Loaded: ${logo.name}`);
      };
      img.onerror = () => {
        logo.loaded = false;
        console.warn(`Failed to load: ${logo.name} from ${logo.url}`);
      };
      img.src = logo.url;
    });
  }

  loadLogos();

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.x;
    mouse.y = e.y;
  });

  window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    init();
  });

  window.addEventListener('mouseout', () => {
    mouse.x = undefined;
    mouse.y = undefined;
  });

  class Neuron {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.vx = (Math.random() - 0.5) * 0.5;
      this.vy = (Math.random() - 0.5) * 0.5;
      this.activation = 0;
      this.neighbors = [];
      this.baseX = x;
      this.baseY = y;
    }

    update() {
      if (mouse.x) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150) {
          this.activation = Math.min(this.activation + 0.05, 1);
        }
      }

      if (this.activation > 0.1) {
        this.neighbors.forEach(neighbor => {
          if (Math.random() < 0.1) {
            neighbor.activation = Math.min(neighbor.activation + 0.02, 1);
          }
        });
      }

      this.activation *= 0.96;
      if (this.activation < 0.01) this.activation = 0;

      this.x += this.vx;
      this.y += this.vy;

      const dxBase = this.baseX - this.x;
      const dyBase = this.baseY - this.y;
      this.vx += dxBase * 0.0005;
      this.vy += dyBase * 0.0005;
      this.vx *= 0.99;
      this.vy *= 0.99;

      this.draw();
    }

    draw() {
      this.neighbors.forEach(neighbor => {
        const maxActivation = Math.max(this.activation, neighbor.activation);
        if (maxActivation > 0.01) {
          ctx.beginPath();
          ctx.moveTo(this.x, this.y);
          ctx.lineTo(neighbor.x, neighbor.y);
          ctx.strokeStyle = colors.synapse + (maxActivation * 0.5) + ')';
          ctx.lineWidth = 1 + maxActivation;
          ctx.stroke();
        }
      });

      if (this.activation > 0.01) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, 3 + this.activation * 4, 0, Math.PI * 2);
        ctx.fillStyle = colors.node + this.activation + ')';
        ctx.shadowBlur = this.activation * 15;
        ctx.shadowColor = colors.node + '1)';
        ctx.fill();
        ctx.shadowBlur = 0;
      } else {
        ctx.beginPath();
        ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
        ctx.fill();
      }
    }
  }

  function initLogoSpots() {
    logoSpots = [];

    // Center point (where the title is - centered, upper third of viewport)
    const centerX = canvas.width / 2;
    const centerY = canvas.height * 0.35; // Title is roughly in upper third

    // Create positions scattered around the title
    // Inner ring (closer to title) and outer ring
    const positions = [];

    // Ring 1: Close orbit around title (but not overlapping)
    const innerRadius = 180;
    const innerCount = 6;
    for (let i = 0; i < innerCount; i++) {
      const angle = (i / innerCount) * Math.PI * 2 + Math.random() * 0.3;
      const radius = innerRadius + Math.random() * 60;
      positions.push({
        x: centerX + Math.cos(angle) * radius,
        y: centerY + Math.sin(angle) * radius * 0.6 // Elliptical, flatter vertically
      });
    }

    // Ring 2: Wider orbit
    const outerRadius = 300;
    const outerCount = 8;
    for (let i = 0; i < outerCount; i++) {
      const angle = (i / outerCount) * Math.PI * 2 + Math.random() * 0.4;
      const radius = outerRadius + Math.random() * 80;
      positions.push({
        x: centerX + Math.cos(angle) * radius,
        y: centerY + Math.sin(angle) * radius * 0.5
      });
    }

    // Ring 3: Even wider, sparse
    const farRadius = 450;
    const farCount = 6;
    for (let i = 0; i < farCount; i++) {
      const angle = (i / farCount) * Math.PI * 2 + Math.random() * 0.5;
      const radius = farRadius + Math.random() * 100;
      positions.push({
        x: centerX + Math.cos(angle) * radius,
        y: centerY + Math.sin(angle) * radius * 0.4
      });
    }

    // Filter out positions that are off-screen
    const validPositions = positions.filter(p =>
      p.x > 50 && p.x < canvas.width - 50 &&
      p.y > 50 && p.y < canvas.height - 50
    );

    // Shuffle positions
    validPositions.sort(() => Math.random() - 0.5);

    // Get loaded logos only
    const loadedLogos = logos.filter(l => l.loaded && l.image);

    // Minimum distance between logos
    const minLogoDist = 120;

    // Place each logo once, ensuring minimum distance
    for (let i = 0; i < loadedLogos.length; i++) {
      const logo = loadedLogos[i];

      // Find a position that's far enough from existing logos
      for (const pos of validPositions) {
        let tooClose = false;
        for (const existing of logoSpots) {
          const dx = pos.x - existing.x;
          const dy = pos.y - existing.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < minLogoDist) {
            tooClose = true;
            break;
          }
        }

        if (!tooClose) {
          logoSpots.push({
            x: pos.x,
            y: pos.y,
            logo: logo,
            size: 55 + Math.random() * 25,
            activation: 0,
            baseActivation: 0.05
          });
          break;
        }
      }
    }
  }

  function updateLogoSpots() {
    logoSpots.forEach(spot => {
      if (!spot.logo.loaded || !spot.logo.image) return;

      // Calculate activation based on nearby neurons
      let totalActivation = 0;

      neurons.forEach(neuron => {
        const dx = neuron.x - spot.x;
        const dy = neuron.y - spot.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 100) {
          totalActivation += neuron.activation * (1 - dist / 100);
        }
      });

      // Also check direct mouse proximity
      if (mouse.x) {
        const dx = mouse.x - spot.x;
        const dy = mouse.y - spot.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          totalActivation += (1 - dist / 120) * 0.6;
        }
      }

      // Smooth activation
      const targetActivation = Math.min(totalActivation, 1);
      spot.activation += (targetActivation - spot.activation) * 0.08;

      // Draw logo with activation-based opacity
      const opacity = spot.baseActivation + spot.activation * 0.7;
      if (opacity > 0.02) {
        ctx.save();
        ctx.globalAlpha = opacity;

        // Add glow effect when activated
        if (spot.activation > 0.1) {
          ctx.shadowBlur = spot.activation * 20;
          ctx.shadowColor = 'rgba(255, 255, 255, 0.5)';
        }

        // Invert filter for dark logos on dark bg
        if (spot.logo.invert) {
          ctx.filter = 'invert(1) brightness(1.2)';
        }

        const size = spot.size;
        ctx.drawImage(
          spot.logo.image,
          spot.x - size / 2,
          spot.y - size / 2,
          size,
          size
        );

        ctx.restore();
      }
    });
  }

  function init() {
    neurons = [];
    const numNeurons = (canvas.width * canvas.height) / 25000;
    const minNeuronDist = 50; // Minimum distance between neurons
    const maxAttempts = 50; // Max attempts to place a neuron

    for (let i = 0; i < numNeurons; i++) {
      let placed = false;

      for (let attempt = 0; attempt < maxAttempts && !placed; attempt++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;

        // Check distance from existing neurons
        let tooClose = false;
        for (const existing of neurons) {
          const dx = x - existing.x;
          const dy = y - existing.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < minNeuronDist) {
            tooClose = true;
            break;
          }
        }

        if (!tooClose) {
          neurons.push(new Neuron(x, y));
          placed = true;
        }
      }
    }

    neurons.forEach(neuron => {
      const others = neurons.filter(n => n !== neuron);
      others.sort((a, b) => {
        const d1 = (a.x - neuron.x)**2 + (a.y - neuron.y)**2;
        const d2 = (b.x - neuron.x)**2 + (b.y - neuron.y)**2;
        return d1 - d2;
      });
      neuron.neighbors = others.slice(0, 3);
    });

    // Delay logo spot init to allow images to load
    setTimeout(() => {
      initLogoSpots();
    }, 500);
  }

  function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw logos first (behind neurons)
    updateLogoSpots();

    neurons.forEach(neuron => neuron.update());
  }

  init();
  animate();

  // Re-init logo spots once more images have loaded
  setTimeout(() => {
    initLogoSpots();
  }, 2000);

  // Observer for scroll reveal
  const observerOptions = { root: null, threshold: 0.1 };
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('active');
    });
  }, observerOptions);

  function initCanvasObservers() {
    document.querySelectorAll('.hero, .section-heading, .modern-card, .article-card, .featured-project, .publication, .cert-card, .project-grid, .stats, .terminal')
      .forEach(el => {
        el.classList.add('reveal');
        observer.observe(el);
      });
  }

  initCanvasObservers();

  // Expose for re-initialization after view transitions
  window.reinitCanvasObservers = function() {
    initCanvasObservers();
    // Also reinit logo spots in case we're back on home page
    setTimeout(() => {
      initLogoSpots();
    }, 100);
  };
});
