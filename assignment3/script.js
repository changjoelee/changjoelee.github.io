const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const clock = document.getElementById("clock");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particles = [];
let isDragging = false;
let globalTime = 0;

// Special phrase for dragging
const dragPhrase = [
  "the",
  "time",
  "will",
  "heal",
  "your",
  "pain",
  "in",
  "your",
  "heart",
  "tik",
  "tok",
  "tik",
  "tok",
];
let dragWordIndex = 0;

class TimeParticle {
  constructor(x, y, word) {
    this.x = x;
    this.y = y;
    this.word = word;
    this.vx = (Math.random() - 0.5) * 0.5; // Further reduced speed
    this.vy = (Math.random() - 0.5) * 0.5; // Further reduced speed
    this.life = 1;
    this.decay = Math.random() * 0.005 + 0.002; // Much longer duration
    this.size = Math.random() * 16 + 14; // Slightly larger size for better readability
    this.hue = Math.random() * 360; // Each particle has different color
    this.saturation = 60 + Math.random() * 40; // 60-100% saturation
    this.lightness = 50 + Math.random() * 30; // 50-80% brightness
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.vx *= 0.995; // Even less friction for longer, slower movement
    this.vy *= 0.995; // Even less friction for longer, slower movement
    this.life -= this.decay;

    // Much reduced gravity effect
    this.vy += 0.02;

    // Much slower color change
    this.hue += 0.2;
  }

  draw() {
    ctx.save();
    ctx.globalAlpha = this.life;
    ctx.fillStyle = `hsl(${this.hue}, ${this.saturation}%, ${this.lightness}%)`;
    ctx.shadowColor = `hsl(${this.hue}, ${this.saturation}%, ${this.lightness}%)`;
    ctx.shadowBlur = 15;
    ctx.font = `${this.size}px Courier New`;
    ctx.textAlign = "center";
    ctx.fillText(this.word, this.x, this.y);
    ctx.restore();
  }
}

function createTimeTrail(x, y) {
  const trail = document.createElement("div");

  // Completely random angle
  const angle = Math.random() * 360;

  // Long and sharp elliptical wound size
  const width = 3 + Math.random() * 4; // 3-7px
  const height = 60 + Math.random() * 40; // 60-100px

  // Set all styles inline directly (no class usage)
  trail.style.cssText = `
        position: absolute;
        width: ${width}px;
        height: ${height}px;
        left: ${x - width / 2}px;
        top: ${y - height / 2}px;
        pointer-events: none;
        z-index: 1;
        border-radius: 50%;
        transform: rotate(${angle}deg);
        transform-origin: center center;
    `;

  // Wound-like color - deep red to black
  const intensity = 0.8 + Math.random() * 0.2;
  const gradient = `radial-gradient(ellipse, 
        rgba(${Math.floor(220 * intensity)}, ${Math.floor(
    20 * intensity
  )}, ${Math.floor(20 * intensity)}, 0.95) 0%,
        rgba(${Math.floor(180 * intensity)}, ${Math.floor(
    15 * intensity
  )}, ${Math.floor(15 * intensity)}, 0.85) 30%,
        rgba(${Math.floor(120 * intensity)}, ${Math.floor(
    10 * intensity
  )}, ${Math.floor(10 * intensity)}, 0.7) 60%,
        rgba(${Math.floor(60 * intensity)}, ${Math.floor(
    5 * intensity
  )}, 0, 0.5) 80%,
        transparent 100%)`;
  trail.style.background = gradient;

  // Wound glow effect
  trail.style.boxShadow = `
        0 0 15px rgba(${Math.floor(200 * intensity)}, ${Math.floor(
    30 * intensity
  )}, ${Math.floor(30 * intensity)}, 0.8),
        inset 0 0 8px rgba(0, 0, 0, 0.6)`;

  document.body.appendChild(trail);

  // Wound slowly begins to heal - horizontal direction closes faster
  setTimeout(() => {
    trail.style.transition = "all 10s ease-out";
    trail.style.opacity = "0";
    // scaleX smaller, scaleY less reduced to create wound closing from sides
    trail.style.transform = `rotate(${angle}deg) scaleY(0.3) scaleX(0.01)`;
    trail.style.filter = "brightness(0.3)";
    trail.style.borderRadius = "70%";

    setTimeout(() => {
      if (trail.parentNode) {
        trail.parentNode.removeChild(trail);
      }
    }, 10000);
  }, 300);
}

function drawBackground() {
  // Simple dark background
  ctx.fillStyle = "#0a0a0a";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawTimeFlow() {
  // Lines representing the flow of time - red horizontal lines moving down 10 pixels per second (discrete steps)
  ctx.strokeStyle = `rgba(255, 0, 0, 0.5)`;
  ctx.lineWidth = 1;

  const lineSpacing = 100;
  const pixelsPerSecond = 10;

  // Use real time instead of frame count for accurate 1-second intervals
  const currentTime = Date.now();
  const startTime = window.startTime || (window.startTime = currentTime);
  const secondsPassed = Math.floor((currentTime - startTime) / 1000);
  const discreteOffset = secondsPassed * pixelsPerSecond;

  // Draw multiple lines across the screen
  for (let i = -2; i < 10; i++) {
    ctx.beginPath();
    const y =
      (discreteOffset + i * lineSpacing) % (canvas.height + lineSpacing);
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }
}

function updateClock() {
  const now = new Date();
  const timeString = now.toLocaleTimeString("en-US");
  clock.textContent = timeString;
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawBackground();
  drawTimeFlow();

  // Update and draw particles
  particles = particles.filter((particle) => {
    particle.update();
    particle.draw();
    return particle.life > 0;
  });

  // No automatic particle generation - only on user interaction

  globalTime++;
  requestAnimationFrame(animate);
}

// Event listeners
canvas.addEventListener("click", (e) => {
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  // Only create wound on click, no words
  createTimeTrail(x, y);
});

canvas.addEventListener("mousedown", (e) => {
  isDragging = true;
  dragWordIndex = 0; // Reset phrase when starting new drag
});

canvas.addEventListener("mousemove", (e) => {
  if (isDragging) {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Generate time traces during drag (special phrase words and wounds) - reduced frequency
    if (Math.random() < 0.15) {
      const word = dragPhrase[dragWordIndex % dragPhrase.length];
      dragWordIndex++;

      const particle = new TimeParticle(x, y, word);
      particle.vx = (Math.random() - 0.5) * 0.2; // Much slower speed during drag
      particle.vy = (Math.random() - 0.5) * 0.2;
      particles.push(particle);
      createTimeTrail(x, y);
    }
  }
});

canvas.addEventListener("mouseup", () => {
  isDragging = false;
});

// Handle window resize
window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

// Start
setInterval(updateClock, 1000);
updateClock();
animate();
