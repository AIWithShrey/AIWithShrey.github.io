// Neural Network Animation System
// Creates interactive neural network visualizations on canvas elements

(function() {
  'use strict';

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

    update(mouse) {
      if (mouse.x !== undefined) {
        var dx = mouse.x - this.x;
        var dy = mouse.y - this.y;
        var dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150) {
          this.activation = Math.min(this.activation + 0.05, 1);
        }
      }

      if (this.activation > 0.1) {
        for (var i = 0; i < this.neighbors.length; i++) {
          if (Math.random() < 0.1) {
            this.neighbors[i].activation = Math.min(this.neighbors[i].activation + 0.02, 1);
          }
        }
      }

      this.activation *= 0.96;
      if (this.activation < 0.01) this.activation = 0;

      this.x += this.vx;
      this.y += this.vy;

      var dxBase = this.baseX - this.x;
      var dyBase = this.baseY - this.y;
      this.vx += dxBase * 0.0005;
      this.vy += dyBase * 0.0005;
      this.vx *= 0.99;
      this.vy *= 0.99;
    }

    draw(ctx, colors) {
      for (var i = 0; i < this.neighbors.length; i++) {
        var neighbor = this.neighbors[i];
        var maxActivation = Math.max(this.activation, neighbor.activation);
        if (maxActivation > 0.01) {
          ctx.beginPath();
          ctx.moveTo(this.x, this.y);
          ctx.lineTo(neighbor.x, neighbor.y);
          ctx.strokeStyle = colors.synapse + (maxActivation * 0.5) + ')';
          ctx.lineWidth = 1 + maxActivation;
          ctx.stroke();
        }
      }

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

  function createNeuralNetwork(canvas, opts) {
    if (!canvas) return null;

    opts = opts || {};
    var ctx = canvas.getContext('2d');
    var densityFactor = opts.densityFactor || 25000;
    var isFixed = opts.fixed === true;
    var colors = {
      node: 'rgba(242, 233, 0, ',
      synapse: 'rgba(217, 32, 49, '
    };

    var mouse = { x: undefined, y: undefined };
    var neurons = [];
    var animId = null;

    function resize() {
      if (isFixed) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      } else {
        var parent = canvas.parentElement;
        if (parent) {
          canvas.width = parent.offsetWidth;
          canvas.height = parent.offsetHeight;
        }
      }
      initNeurons();
    }

    function initNeurons() {
      neurons = [];
      var numNeurons = Math.min((canvas.width * canvas.height) / densityFactor, 200);
      var minDist = 50;
      var maxAttempts = 50;

      for (var i = 0; i < numNeurons; i++) {
        for (var attempt = 0; attempt < maxAttempts; attempt++) {
          var x = Math.random() * canvas.width;
          var y = Math.random() * canvas.height;
          var tooClose = false;

          for (var j = 0; j < neurons.length; j++) {
            var dx = x - neurons[j].x;
            var dy = y - neurons[j].y;
            if (Math.sqrt(dx * dx + dy * dy) < minDist) {
              tooClose = true;
              break;
            }
          }

          if (!tooClose) {
            neurons.push(new Neuron(x, y));
            break;
          }
        }
      }

      // Connect neighbors
      for (var n = 0; n < neurons.length; n++) {
        var neuron = neurons[n];
        var others = neurons.filter(function(o) { return o !== neuron; });
        others.sort(function(a, b) {
          var d1 = (a.x - neuron.x) * (a.x - neuron.x) + (a.y - neuron.y) * (a.y - neuron.y);
          var d2 = (b.x - neuron.x) * (b.x - neuron.x) + (b.y - neuron.y) * (b.y - neuron.y);
          return d1 - d2;
        });
        neuron.neighbors = others.slice(0, 3);
      }
    }

    function animate() {
      animId = requestAnimationFrame(animate);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (var i = 0; i < neurons.length; i++) {
        neurons[i].update(mouse);
        neurons[i].draw(ctx, colors);
      }
    }

    // Mouse tracking
    if (isFixed) {
      window.addEventListener('mousemove', function(e) {
        mouse.x = e.x;
        mouse.y = e.y;
      });
      window.addEventListener('mouseout', function() {
        mouse.x = undefined;
        mouse.y = undefined;
      });
    } else {
      canvas.addEventListener('mousemove', function(e) {
        var rect = canvas.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
      });
      canvas.addEventListener('mouseout', function() {
        mouse.x = undefined;
        mouse.y = undefined;
      });
    }

    window.addEventListener('resize', resize);
    resize();
    animate();

    return {
      destroy: function() {
        if (animId) cancelAnimationFrame(animId);
      }
    };
  }

  // Expose globally
  window.createNeuralNetwork = createNeuralNetwork;

  document.addEventListener('DOMContentLoaded', function() {
    // Full-page background canvas
    var bgCanvas = document.getElementById('hero-canvas');
    if (bgCanvas) {
      createNeuralNetwork(bgCanvas, { fixed: true, densityFactor: 25000 });
    }

    // Hero mini canvas (split hero section)
    var heroMini = document.getElementById('hero-mini-canvas');
    if (heroMini) {
      createNeuralNetwork(heroMini, { fixed: false, densityFactor: 12000 });
    }

    // Scroll reveal observers
    var observerOptions = { root: null, threshold: 0.1 };
    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) entry.target.classList.add('active');
      });
    }, observerOptions);

    function initObservers() {
      document.querySelectorAll('.reveal').forEach(function(el) {
        observer.observe(el);
      });
    }

    initObservers();
    window.reinitCanvasObservers = initObservers;
  });
})();
