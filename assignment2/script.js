document.addEventListener("DOMContentLoaded", function () {
  // Select required elements
  const video = document.getElementById("video");
  const centerPlayBtn = document.getElementById("center-play");
  const bottomPlayBtn = document.getElementById("bottom-play");
  const centerRewindBtn = document.getElementById("center-rewind");
  const bottomRewindBtn = document.getElementById("bottom-rewind");
  const centerForwardBtn = document.getElementById("center-forward");
  const bottomForwardBtn = document.getElementById("bottom-forward");
  const muteBtn = document.getElementById("mute-button");
  const volumeSlider = document.getElementById("volume-slider");
  const fullscreenBtn = document.getElementById("fullscreen-button");
  const progressContainer = document.getElementById("progress-container");
  const progressBar = document.getElementById("progress-bar");
  const currentTimeElement = document.getElementById("current-time");
  const durationElement = document.getElementById("duration");
  const container = document.getElementById("container");
  const svgBackground = document.getElementById("svg-background");
  const centerControls = document.querySelector(".center-controls");
  const bottomControls = document.querySelector(".bottom-controls");
  const settingsButton = document.getElementById("settings-button");
  const settingsMenu = document.getElementById("settings-menu");
  const speedMenuButton = document.getElementById("speed-menu-button");
  const qualityMenuButton = document.getElementById("quality-menu-button");
  const mainSettings = document.getElementById("main-settings");
  const speedMenu = document.getElementById("speed-menu");
  const qualityMenu = document.getElementById("quality-menu");
  const speedBackButton = document.getElementById("speed-back-button");
  const qualityBackButton = document.getElementById("quality-back-button");
  const speedOptions = document.querySelectorAll(".speed-option");
  const qualityOptions = document.querySelectorAll(".quality-option");
  const currentSpeed = document.getElementById("current-speed");
  const currentQuality = document.getElementById("current-quality");
  const speedIndicator = document.getElementById("speed-indicator");
  const speedValue = document.getElementById("speed-value");
  const addCommentBtn = document.getElementById("add-comment");
  const newCommentInput = document.getElementById("new-comment");
  const commentsList = document.getElementById("comments-list");
  const commentsCount = document.getElementById("comments-count");
  const toggleCommentsBtn = document.getElementById("toggle-comments");
  const commentsContainer = document.getElementById("comments-container");

  // Initialize volume
  video.volume = volumeSlider.value;

  // Generate topographic SVG background
  function generateSimpleTopographicBackground() {
    const width = window.innerWidth;
    const height = window.innerHeight;

    // Simple SVG gradient background
    const svgContent = `
        <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="grad" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
              <stop offset="0%" stop-color="#a855f7" stop-opacity="0.3"/>
              <stop offset="100%" stop-color="#6b21a8" stop-opacity="0.1"/>
            </radialGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="2.5" result="blur"/>
              <feComposite in="SourceGraphic" in2="blur" operator="over"/>
            </filter>
          </defs>
          <rect width="100%" height="100%" fill="url(#grad)"/>
          
          <!-- Simplified curves to replace topographic effect -->
          <path d="M0,${height * 0.8} C${width * 0.3},${height * 0.6} ${
      width * 0.7
    },${height * 0.9} ${width},${height * 0.7}" 
                stroke="rgba(200, 100, 240, 0.3)" fill="none" stroke-width="1" filter="url(#glow)"/>
          <path d="M0,${height * 0.6} C${width * 0.4},${height * 0.3} ${
      width * 0.6
    },${height * 0.7} ${width},${height * 0.5}" 
                stroke="rgba(220, 130, 240, 0.2)" fill="none" stroke-width="1.5" filter="url(#glow)"/>
          <path d="M0,${height * 0.4} C${width * 0.3},${height * 0.7} ${
      width * 0.7
    },${height * 0.2} ${width},${height * 0.3}" 
                stroke="rgba(240, 150, 255, 0.15)" fill="none" stroke-width="2" filter="url(#glow)"/>
        </svg>
      `;

    svgBackground.innerHTML = svgContent;
  }

  // Generate initial background
  generateSimpleTopographicBackground();

  // Regenerate background on window resize
  window.addEventListener("resize", generateSimpleTopographicBackground);

  // Play/Pause functionality
  function togglePlay() {
    if (video.paused) {
      video
        .play()
        .then(() => {
          // Darken background when playback starts
          container.classList.remove("bg-white");
          container.classList.add("bg-black");
          svgBackground.classList.remove("opacity-30");
          svgBackground.classList.add("opacity-70");
          svgBackground.classList.add("neon-pulse");

          // Hide play icon and show pause icon
          document
            .querySelectorAll(".play-icon")
            .forEach((icon) => icon.classList.add("hidden"));
          document
            .querySelectorAll(".pause-icon")
            .forEach((icon) => icon.classList.remove("hidden"));
        })
        .catch((error) => {
          console.error("Video playback error:", error);
        });
    } else {
      video.pause();
      // Brighten background when paused
      container.classList.remove("bg-black");
      container.classList.add("bg-white");
      svgBackground.classList.remove("opacity-70");
      svgBackground.classList.add("opacity-30");
      svgBackground.classList.remove("neon-pulse");

      // Hide pause icon and show play icon
      document
        .querySelectorAll(".pause-icon")
        .forEach((icon) => icon.classList.add("hidden"));
      document
        .querySelectorAll(".play-icon")
        .forEach((icon) => icon.classList.remove("hidden"));
    }
  }

  // Play/Pause button event listeners
  centerPlayBtn.addEventListener("click", togglePlay);
  bottomPlayBtn.addEventListener("click", togglePlay);
  video.addEventListener("click", togglePlay);

  // 10 seconds backward button
  function rewind() {
    video.currentTime = Math.max(0, video.currentTime - 10);
  }

  // 10 seconds forward button
  function forward() {
    video.currentTime = Math.min(video.duration, video.currentTime + 10);
  }

  // Backward/Forward button event listeners
  centerRewindBtn.addEventListener("click", rewind);
  bottomRewindBtn.addEventListener("click", rewind);
  centerForwardBtn.addEventListener("click", forward);
  bottomForwardBtn.addEventListener("click", forward);

  // Mute button
  function toggleMute() {
    video.muted = !video.muted;

    // Change icon based on mute state
    if (video.muted) {
      document.querySelector(".volume-icon").classList.add("hidden");
      document.querySelector(".mute-icon").classList.remove("hidden");
      volumeSlider.value = 0;
    } else {
      document.querySelector(".mute-icon").classList.add("hidden");
      document.querySelector(".volume-icon").classList.remove("hidden");
      volumeSlider.value = video.volume;
    }
  }

  // Mute button event listener
  muteBtn.addEventListener("click", toggleMute);

  // Volume slider
  volumeSlider.addEventListener("input", function () {
    video.volume = this.value;
    video.muted = this.value === 0;

    // Update icons based on volume
    if (this.value === 0) {
      document.querySelector(".volume-icon").classList.add("hidden");
      document.querySelector(".mute-icon").classList.remove("hidden");
    } else {
      document.querySelector(".mute-icon").classList.add("hidden");
      document.querySelector(".volume-icon").classList.remove("hidden");
    }
  });

  // Format time display (converts seconds to MM:SS format)
  function formatTime(time) {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  }

  // Update progress bar and time display during playback
  video.addEventListener("timeupdate", function () {
    const currentTime = video.currentTime;
    const duration = video.duration;

    // Update progress bar
    if (!isNaN(duration)) {
      const progressPercent = (currentTime / duration) * 100;
      progressBar.style.width = `${progressPercent}%`;

      // Update time display
      currentTimeElement.textContent = formatTime(currentTime);
    }
  });

  // Update duration display once metadata is loaded
  video.addEventListener("loadedmetadata", function () {
    durationElement.textContent = formatTime(video.duration);
  });

  // Click on progress bar to seek
  progressContainer.addEventListener("click", function (e) {
    const rect = this.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    video.currentTime = pos * video.duration;
  });

  // Fullscreen functionality
  fullscreenBtn.addEventListener("click", function () {
    if (!document.fullscreenElement) {
      if (video.requestFullscreen) {
        video.requestFullscreen();
      } else if (video.webkitRequestFullscreen) {
        // Safari
        video.webkitRequestFullscreen();
      } else if (video.msRequestFullscreen) {
        // IE11
        video.msRequestFullscreen();
      } else if (video.mozRequestFullScreen) {
        // Firefox
        video.mozRequestFullScreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      }
    }
  });

  // Settings menu toggle
  settingsButton.addEventListener("click", function () {
    settingsMenu.classList.toggle("hidden");
    mainSettings.classList.remove("hidden");
    speedMenu.classList.add("hidden");
    qualityMenu.classList.add("hidden");
  });

  // Close settings menu when clicking elsewhere
  document.addEventListener("click", function (e) {
    if (!settingsMenu.contains(e.target) && e.target !== settingsButton) {
      settingsMenu.classList.add("hidden");
    }
  });

  // Open speed submenu
  speedMenuButton.addEventListener("click", function () {
    mainSettings.classList.add("hidden");
    speedMenu.classList.remove("hidden");
  });

  // Open quality submenu
  qualityMenuButton.addEventListener("click", function () {
    mainSettings.classList.add("hidden");
    qualityMenu.classList.remove("hidden");
  });

  // Back to main settings from speed submenu
  speedBackButton.addEventListener("click", function () {
    speedMenu.classList.add("hidden");
    mainSettings.classList.remove("hidden");
  });

  // Back to main settings from quality submenu
  qualityBackButton.addEventListener("click", function () {
    qualityMenu.classList.add("hidden");
    mainSettings.classList.remove("hidden");
  });

  // Change playback speed
  speedOptions.forEach((option) => {
    option.addEventListener("click", function () {
      const speed = parseFloat(this.dataset.speed);
      video.playbackRate = speed;

      // Update selected option
      speedOptions.forEach((opt) => opt.classList.remove("selected"));
      this.classList.add("selected");

      // Update displayed speed
      currentSpeed.textContent = `${speed}x`;
      speedValue.textContent = `${speed}x`;

      // Show speed indicator briefly
      speedIndicator.classList.remove("hidden");
      setTimeout(() => {
        speedIndicator.classList.add("hidden");
      }, 1500);
    });
  });

  // Change video quality
  qualityOptions.forEach((option) => {
    option.addEventListener("click", function () {
      const quality = this.dataset.quality;
      const src = this.dataset.src;
      const currentTime = video.currentTime;
      const wasPlaying = !video.paused;

      // Update video source
      video.querySelector("source").src = src;
      video.load();

      // Restore playback position and state
      video.addEventListener("loadedmetadata", function onceLoaded() {
        video.currentTime = currentTime;
        if (wasPlaying) {
          video.play();
        }
        video.removeEventListener("loadedmetadata", onceLoaded);
      });

      // Update selected option
      qualityOptions.forEach((opt) => opt.classList.remove("selected"));
      this.classList.add("selected");

      // Update displayed quality
      currentQuality.textContent = quality;

      // Close settings menu
      settingsMenu.classList.add("hidden");
    });
  });

  // Initial comments data
  const initialComments = [
    {
      id: 1,
      author: "MovieLover",
      text: "The colors in this video are beautiful!",
      time: "3 days ago",
      likes: 12,
    },
    {
      id: 2,
      author: "VideoArtist",
      text: "What software was used to create these effects?",
      time: "2 days ago",
      likes: 5,
    },
    {
      id: 3,
      author: "MediaGuy",
      text: "The background music is perfect. Amazing visuals.",
      time: "1 day ago",
      likes: 8,
    },
  ];

  // Display comments
  function displayComments(comments) {
    commentsList.innerHTML = "";
    comments.forEach((comment) => {
      const commentElement = document.createElement("div");
      commentElement.className = "comment";
      commentElement.innerHTML = `
          <div class="comment-header">
            <span class="comment-author">${comment.author}</span>
            <span class="comment-time">${comment.time}</span>
          </div>
          <p class="comment-text">${comment.text}</p>
          <button class="like-button" data-id="${comment.id}">
            <span>♥</span> 
            <span>Like ${comment.likes}</span>
          </button>
        `;
      commentsList.appendChild(commentElement);
    });

    // Add like functionality to the new comments
    document.querySelectorAll(".like-button").forEach((button) => {
      button.addEventListener("click", function () {
        const id = parseInt(this.dataset.id);
        likeComment(id);
      });
    });

    // Update comments count
    commentsCount.textContent = comments.length;
  }

  // Add initial comments
  displayComments(initialComments);

  // Add new comment
  addCommentBtn.addEventListener("click", function () {
    const commentText = newCommentInput.value.trim();
    if (commentText) {
      const newComment = {
        id: initialComments.length + 1,
        author: "Current User",
        text: commentText,
        time: "Just now",
        likes: 0,
      };

      // Add to beginning of array
      initialComments.unshift(newComment);

      // Update display
      displayComments(initialComments);

      // Clear input
      newCommentInput.value = "";
    }
  });

  // Allow submitting comments with Enter key
  newCommentInput.addEventListener("keydown", function (e) {
    if (e.key === "Enter" && this.value.trim()) {
      addCommentBtn.click();
    }
  });

  // Like a comment
  function likeComment(id) {
    const commentIndex = initialComments.findIndex((c) => c.id === id);
    if (commentIndex !== -1) {
      initialComments[commentIndex].likes++;
      displayComments(initialComments);
    }
  }

  // Toggle comments visibility
  toggleCommentsBtn.addEventListener("click", function () {
    commentsContainer.classList.toggle("hidden");
    this.textContent = commentsContainer.classList.contains("hidden")
      ? "Expand"
      : "Collapse";
  });
});
document.addEventListener("DOMContentLoaded", function () {
  // Select required elements
  const video = document.getElementById("video");
  const centerPlayBtn = document.getElementById("center-play");
  const bottomPlayBtn = document.getElementById("bottom-play");
  const centerRewindBtn = document.getElementById("center-rewind");
  const bottomRewindBtn = document.getElementById("bottom-rewind");
  const centerForwardBtn = document.getElementById("center-forward");
  const bottomForwardBtn = document.getElementById("bottom-forward");
  const muteBtn = document.getElementById("mute-button");
  const volumeSlider = document.getElementById("volume-slider");
  const fullscreenBtn = document.getElementById("fullscreen-button");
  const progressContainer = document.getElementById("progress-container");
  const progressBar = document.getElementById("progress-bar");
  const currentTimeElement = document.getElementById("current-time");
  const durationElement = document.getElementById("duration");
  const container = document.getElementById("container");
  const svgBackground = document.getElementById("svg-background");
  const centerControls = document.querySelector(".center-controls");
  const bottomControls = document.querySelector(".bottom-controls");
  const settingsButton = document.getElementById("settings-button");
  const settingsMenu = document.getElementById("settings-menu");
  const speedMenuButton = document.getElementById("speed-menu-button");
  const qualityMenuButton = document.getElementById("quality-menu-button");
  const mainSettings = document.getElementById("main-settings");
  const speedMenu = document.getElementById("speed-menu");
  const qualityMenu = document.getElementById("quality-menu");
  const speedBackButton = document.getElementById("speed-back-button");
  const qualityBackButton = document.getElementById("quality-back-button");
  const speedOptions = document.querySelectorAll(".speed-option");
  const qualityOptions = document.querySelectorAll(".quality-option");
  const currentSpeed = document.getElementById("current-speed");
  const currentQuality = document.getElementById("current-quality");
  const speedIndicator = document.getElementById("speed-indicator");
  const speedValue = document.getElementById("speed-value");
  const addCommentBtn = document.getElementById("add-comment");
  const newCommentInput = document.getElementById("new-comment");
  const commentsList = document.getElementById("comments-list");
  const commentsCount = document.getElementById("comments-count");
  const toggleCommentsBtn = document.getElementById("toggle-comments");
  const commentsContainer = document.getElementById("comments-container");

  // Initialize volume
  video.volume = volumeSlider.value;

  // SimplexNoise implementation (for topographic patterns)
  class SimplexNoise {
    constructor(random = Math.random) {
      this.p = new Uint8Array(256);
      this.perm = new Uint8Array(512);
      this.permMod12 = new Uint8Array(512);

      const p = this.p;
      for (let i = 0; i < 256; i++) {
        p[i] = i;
      }

      for (let i = 255; i > 0; i--) {
        const n = Math.floor((i + 1) * random());
        const q = p[i];
        p[i] = p[n];
        p[n] = q;
      }

      for (let i = 0; i < 512; i++) {
        this.perm[i] = p[i & 255];
        this.permMod12[i] = this.perm[i] % 12;
      }
    }

    noise2D(xin, yin) {
      const F2 = 0.5 * (Math.sqrt(3) - 1);
      const G2 = (3 - Math.sqrt(3)) / 6;

      const s = (xin + yin) * F2;
      const i = Math.floor(xin + s);
      const j = Math.floor(yin + s);
      const t = (i + j) * G2;

      const X0 = i - t;
      const Y0 = j - t;
      const x0 = xin - X0;
      const y0 = yin - Y0;

      let i1, j1;
      if (x0 > y0) {
        i1 = 1;
        j1 = 0;
      } else {
        i1 = 0;
        j1 = 1;
      }

      const x1 = x0 - i1 + G2;
      const y1 = y0 - j1 + G2;
      const x2 = x0 - 1 + 2 * G2;
      const y2 = y0 - 1 + 2 * G2;

      const ii = i & 255;
      const jj = j & 255;

      const t0 = 0.5 - x0 * x0 - y0 * y0;
      const t1 = 0.5 - x1 * x1 - y1 * y1;
      const t2 = 0.5 - x2 * x2 - y2 * y2;

      const gi0 = this.permMod12[ii + this.perm[jj]];
      const gi1 = this.permMod12[ii + i1 + this.perm[jj + j1]];
      const gi2 = this.permMod12[ii + 1 + this.perm[jj + 1]];

      const n0 = t0 < 0 ? 0 : t0 * t0 * t0 * t0 * this.dot(gi0, x0, y0);
      const n1 = t1 < 0 ? 0 : t1 * t1 * t1 * t1 * this.dot(gi1, x1, y1);
      const n2 = t2 < 0 ? 0 : t2 * t2 * t2 * t2 * this.dot(gi2, x2, y2);

      return 70 * (n0 + n1 + n2);
    }

    dot(gi, x, y) {
      return this.grad3[gi][0] * x + this.grad3[gi][1] * y;
    }

    grad3 = [
      [1, 1],
      [-1, 1],
      [1, -1],
      [-1, -1],
      [1, 0],
      [-1, 0],
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
      [0, 1],
      [0, -1],
    ];
  }

  // Generate topographic SVG background
  function generateTopographicSVG() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const seed = 42; // Consistent seed for repeatable pattern

    // Initialize random generator with seed
    const randomGenerator = () => {
      seed = (seed * 16807) % 2147483647;
      return seed / 2147483647;
    };

    const noise = new SimplexNoise(randomGenerator);
    const resolution = 50; // Grid resolution
    const lines = 12; // Number of contour lines

    const cellWidth = width / resolution;
    const cellHeight = height / resolution;

    // Generate noise field
    const field = [];
    for (let y = 0; y <= resolution; y++) {
      field[y] = [];
      for (let x = 0; x <= resolution; x++) {
        // Adjust coordinates for more natural curves
        const nx = (x / resolution) * 3;
        const ny = (y / resolution) * 3;
        // Multiple layer noise for more complex patterns
        const value =
          0.6 * noise.noise2D(nx, ny) +
          0.3 * noise.noise2D(nx * 2, ny * 2) +
          0.1 * noise.noise2D(nx * 4, ny * 4);

        field[y][x] = value;
      }
    }

    // Create SVG paths
    let paths = [];

    // For each contour level
    for (let l = 0; l < lines; l++) {
      const threshold = -1 + (l * 2) / (lines - 1); // Contour levels from -1 to 1

      let isolines = [];
      let currentLine = [];

      // For each cell in the grid, calculate contours
      for (let y = 0; y < resolution; y++) {
        for (let x = 0; x < resolution; x++) {
          const tl = field[y][x];
          const tr = field[y][x + 1];
          const bl = field[y + 1][x];
          const br = field[y + 1][x + 1];

          // Check if the cell needs processing (contour passes through)
          if (
            (tl > threshold && tr <= threshold) ||
            (tl <= threshold && tr > threshold) ||
            (tr > threshold && br <= threshold) ||
            (tr <= threshold && br > threshold) ||
            (br > threshold && bl <= threshold) ||
            (br <= threshold && bl > threshold) ||
            (bl > threshold && tl <= threshold) ||
            (bl <= threshold && tl > threshold)
          ) {
            // Find contour points inside the cell
            const points = [];

            // Check top edge
            if (
              (tl > threshold && tr <= threshold) ||
              (tl <= threshold && tr > threshold)
            ) {
              const ratio = (threshold - tl) / (tr - tl);
              points.push({
                x: x * cellWidth + ratio * cellWidth,
                y: y * cellHeight,
              });
            }

            // Check right edge
            if (
              (tr > threshold && br <= threshold) ||
              (tr <= threshold && br > threshold)
            ) {
              const ratio = (threshold - tr) / (br - tr);
              points.push({
                x: (x + 1) * cellWidth,
                y: y * cellHeight + ratio * cellHeight,
              });
            }

            // Check bottom edge
            if (
              (br > threshold && bl <= threshold) ||
              (br <= threshold && bl > threshold)
            ) {
              const ratio = (threshold - br) / (bl - br);
              points.push({
                x: (x + 1) * cellWidth - ratio * cellWidth,
                y: (y + 1) * cellHeight,
              });
            }

            // Check left edge
            if (
              (bl > threshold && tl <= threshold) ||
              (bl <= threshold && tl > threshold)
            ) {
              const ratio = (threshold - bl) / (tl - bl);
              points.push({
                x: x * cellWidth,
                y: (y + 1) * cellHeight - ratio * cellHeight,
              });
            }

            // Typically get 2 points, connect them to create a contour segment
            if (points.length >= 2) {
              currentLine.push(
                `M${points[0].x},${points[0].y} L${points[1].x},${points[1].y}`
              );
            }
          }
        }
      }

      if (currentLine.length > 0) {
        const pathString = currentLine.join(" ");
        isolines.push(pathString);
      }

      if (isolines.length > 0) {
        // Purple neon effect with different color and opacity based on level
        const purpleLevel = Math.floor(180 + (l / lines) * 75); // Purple saturation in 180-255 range
        const opacity = 0.1 + (l / lines) * 0.4;

        paths.push({
          d: isolines.join(" "),
          stroke: `rgba(${purpleLevel}, ${
            purpleLevel / 4
          }, ${purpleLevel}, ${opacity})`,
          strokeWidth: 0.8 + (l / lines) * 0.7, // Line thickness based on level
          filter: "url(#glow)",
        });
      }
    }

    // Generate SVG string (with filter for neon effect)
    const svgString = `
        <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="2.5" result="blur"/>
              <feComposite in="SourceGraphic" in2="blur" operator="over"/>
            </filter>
          </defs>
          ${paths
            .map(
              (path) =>
                `<path d="${path.d}" stroke="${path.stroke}" fill="none" stroke-width="${path.strokeWidth}" stroke-linejoin="round" stroke-linecap="round" filter="${path.filter}"/>`
            )
            .join("\n")}
        </svg>
      `;

    svgBackground.innerHTML = svgString;
  }

  // Generate initial background
  generateTopographicSVG();

  // Regenerate background on window resize
  window.addEventListener("resize", generateTopographicSVG);

  // Play/Pause functionality
  function togglePlay() {
    if (video.paused) {
      video
        .play()
        .then(() => {
          // Darken background when playback starts
          container.classList.remove("bg-white");
          container.classList.add("bg-black");
          svgBackground.classList.remove("opacity-30");
          svgBackground.classList.add("opacity-70");
          svgBackground.classList.add("neon-pulse");

          // Hide play icon and show pause icon
          document
            .querySelectorAll(".play-icon")
            .forEach((icon) => icon.classList.add("hidden"));
          document
            .querySelectorAll(".pause-icon")
            .forEach((icon) => icon.classList.remove("hidden"));
        })
        .catch((error) => {
          console.error("Video playback error:", error);
        });
    } else {
      video.pause();
      // Brighten background when paused
      container.classList.remove("bg-black");
      container.classList.add("bg-white");
      svgBackground.classList.remove("opacity-70");
      svgBackground.classList.add("opacity-30");
      svgBackground.classList.remove("neon-pulse");

      // Hide pause icon and show play icon
      document
        .querySelectorAll(".pause-icon")
        .forEach((icon) => icon.classList.add("hidden"));
      document
        .querySelectorAll(".play-icon")
        .forEach((icon) => icon.classList.remove("hidden"));
    }
  }

  // Play/Pause button event listeners
  centerPlayBtn.addEventListener("click", togglePlay);
  bottomPlayBtn.addEventListener("click", togglePlay);
  video.addEventListener("click", togglePlay);

  // 10 seconds backward button
  function rewind() {
    video.currentTime = Math.max(0, video.currentTime - 10);
  }

  // 10 seconds forward button
  function forward() {
    video.currentTime = Math.min(video.duration, video.currentTime + 10);
  }

  // Backward/Forward button event listeners
  centerRewindBtn.addEventListener("click", rewind);
  bottomRewindBtn.addEventListener("click", rewind);
  centerForwardBtn.addEventListener("click", forward);
  bottomForwardBtn.addEventListener("click", forward);

  // Mute button
  function toggleMute() {
    video.muted = !video.muted;

    // Change icon based on mute state
    if (video.muted) {
      document.querySelector(".volume-icon").classList.add("hidden");
      document.querySelector(".mute-icon").classList.remove("hidden");
      volumeSlider.value = 0;
    } else {
      document.querySelector(".mute-icon").classList.add("hidden");
      document.querySelector(".volume-icon").classList.remove("hidden");
      volumeSlider.value = video.volume;
    }
  }

  // Mute button event listener
  muteBtn.addEventListener("click", toggleMute);

  // Volume slider
  volumeSlider.addEventListener("input", function () {
    video.volume = this.value;
    video.muted = this.value === 0;

    // Update icons based on volume
    if (this.value === 0) {
      document.querySelector(".volume-icon").classList.add("hidden");
      document.querySelector(".mute-icon").classList.remove("hidden");
    } else {
      document.querySelector(".mute-icon").classList.add("hidden");
      document.querySelector(".volume-icon").classList.remove("hidden");
    }
  });

  // Format time display (converts seconds to MM:SS format)
  function formatTime(time) {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  }

  // Update progress bar and time display during playback
  video.addEventListener("timeupdate", function () {
    const currentTime = video.currentTime;
    const duration = video.duration;

    // Update progress bar
    if (!isNaN(duration)) {
      const progressPercent = (currentTime / duration) * 100;
      progressBar.style.width = `${progressPercent}%`;

      // Update time display
      currentTimeElement.textContent = formatTime(currentTime);
    }
  });

  // Update duration display once metadata is loaded
  video.addEventListener("loadedmetadata", function () {
    durationElement.textContent = formatTime(video.duration);
  });

  // Click on progress bar to seek
  progressContainer.addEventListener("click", function (e) {
    const rect = this.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    video.currentTime = pos * video.duration;
  });

  // Fullscreen functionality
  fullscreenBtn.addEventListener("click", function () {
    if (!document.fullscreenElement) {
      if (video.requestFullscreen) {
        video.requestFullscreen();
      } else if (video.webkitRequestFullscreen) {
        // Safari
        video.webkitRequestFullscreen();
      } else if (video.msRequestFullscreen) {
        // IE11
        video.msRequestFullscreen();
      } else if (video.mozRequestFullScreen) {
        // Firefox
        video.mozRequestFullScreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      }
    }
  });

  // Settings menu toggle
  settingsButton.addEventListener("click", function () {
    settingsMenu.classList.toggle("hidden");
    mainSettings.classList.remove("hidden");
    speedMenu.classList.add("hidden");
    qualityMenu.classList.add("hidden");
  });

  // Close settings menu when clicking elsewhere
  document.addEventListener("click", function (e) {
    if (!settingsMenu.contains(e.target) && e.target !== settingsButton) {
      settingsMenu.classList.add("hidden");
    }
  });

  // Open speed submenu
  speedMenuButton.addEventListener("click", function () {
    mainSettings.classList.add("hidden");
    speedMenu.classList.remove("hidden");
  });

  // Open quality submenu
  qualityMenuButton.addEventListener("click", function () {
    mainSettings.classList.add("hidden");
    qualityMenu.classList.remove("hidden");
  });

  // Back to main settings from speed submenu
  speedBackButton.addEventListener("click", function () {
    speedMenu.classList.add("hidden");
    mainSettings.classList.remove("hidden");
  });

  // Back to main settings from quality submenu
  qualityBackButton.addEventListener("click", function () {
    qualityMenu.classList.add("hidden");
    mainSettings.classList.remove("hidden");
  });

  // Change playback speed
  speedOptions.forEach((option) => {
    option.addEventListener("click", function () {
      const speed = parseFloat(this.dataset.speed);
      video.playbackRate = speed;

      // Update selected option
      speedOptions.forEach((opt) => opt.classList.remove("selected"));
      this.classList.add("selected");

      // Update displayed speed
      currentSpeed.textContent = `${speed}x`;
      speedValue.textContent = `${speed}x`;

      // Show speed indicator briefly
      speedIndicator.classList.remove("hidden");
      setTimeout(() => {
        speedIndicator.classList.add("hidden");
      }, 1500);
    });
  });

  // Change video quality
  qualityOptions.forEach((option) => {
    option.addEventListener("click", function () {
      const quality = this.dataset.quality;
      const src = this.dataset.src;
      const currentTime = video.currentTime;
      const wasPlaying = !video.paused;

      // Update video source
      video.querySelector("source").src = src;
      video.load();

      // Restore playback position and state
      video.addEventListener("loadedmetadata", function onceLoaded() {
        video.currentTime = currentTime;
        if (wasPlaying) {
          video.play();
        }
        video.removeEventListener("loadedmetadata", onceLoaded);
      });

      // Update selected option
      qualityOptions.forEach((opt) => opt.classList.remove("selected"));
      this.classList.add("selected");

      // Update displayed quality
      currentQuality.textContent = quality;

      // Close settings menu
      settingsMenu.classList.add("hidden");
    });
  });

  // Initial comments data
  const initialComments = [
    {
      id: 1,
      author: "MovieLover",
      text: "The colors in this video are beautiful!",
      time: "3 days ago",
      likes: 12,
    },
    {
      id: 2,
      author: "VideoArtist",
      text: "What software was used to create these effects?",
      time: "2 days ago",
      likes: 5,
    },
    {
      id: 3,
      author: "MediaGuy",
      text: "The background music is perfect. Amazing visuals.",
      time: "1 day ago",
      likes: 8,
    },
  ];

  // Display comments
  function displayComments(comments) {
    commentsList.innerHTML = "";
    comments.forEach((comment) => {
      const commentElement = document.createElement("div");
      commentElement.className = "comment";
      commentElement.innerHTML = `
          <div class="comment-header">
            <span class="comment-author">${comment.author}</span>
            <span class="comment-time">${comment.time}</span>
          </div>
          <p class="comment-text">${comment.text}</p>
          <button class="like-button" data-id="${comment.id}">
            <span>♥</span> 
            <span>Like ${comment.likes}</span>
          </button>
        `;
      commentsList.appendChild(commentElement);
    });

    // Add like functionality to the new comments
    document.querySelectorAll(".like-button").forEach((button) => {
      button.addEventListener("click", function () {
        const id = parseInt(this.dataset.id);
        likeComment(id);
      });
    });

    // Update comments count
    commentsCount.textContent = comments.length;
  }

  // Add initial comments
  displayComments(initialComments);

  // Add new comment
  addCommentBtn.addEventListener("click", function () {
    const commentText = newCommentInput.value.trim();
    if (commentText) {
      const newComment = {
        id: initialComments.length + 1,
        author: "Current User",
        text: commentText,
        time: "Just now",
        likes: 0,
      };

      // Add to beginning of array
      initialComments.unshift(newComment);

      // Update display
      displayComments(initialComments);

      // Clear input
      newCommentInput.value = "";
    }
  });

  // Allow submitting comments with Enter key
  newCommentInput.addEventListener("keydown", function (e) {
    if (e.key === "Enter" && this.value.trim()) {
      addCommentBtn.click();
    }
  });

  // Like a comment
  function likeComment(id) {
    const commentIndex = initialComments.findIndex((c) => c.id === id);
    if (commentIndex !== -1) {
      initialComments[commentIndex].likes++;
      displayComments(initialComments);
    }
  }

  // Toggle comments visibility
  toggleCommentsBtn.addEventListener("click", function () {
    commentsContainer.classList.toggle("hidden");
    this.textContent = commentsContainer.classList.contains("hidden")
      ? "Expand"
      : "Collapse";
  });
});
