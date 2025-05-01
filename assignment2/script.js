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

          // Gradually hide center controls after 1.5 seconds
          setTimeout(() => {
            centerControls.classList.add("fade-out");
          }, 1500);
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

      // Show center controls when paused
      centerControls.classList.remove("fade-out");
    }
  }

  // Play/Pause button event listeners
  centerPlayBtn.addEventListener("click", togglePlay);
  bottomPlayBtn.addEventListener("click", togglePlay);

  // Video events
  video.addEventListener("click", togglePlay);

  // Show center controls when mouse moves over video
  video.addEventListener("mousemove", function () {
    centerControls.classList.remove("fade-out");

    // Hide controls again after 1.5 seconds if video is playing
    if (!video.paused) {
      clearTimeout(window.controlsTimeout);
      window.controlsTimeout = setTimeout(() => {
        centerControls.classList.add("fade-out");
      }, 1500);
    }
  });

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
    if (qualityMenu) {
      qualityMenu.classList.add("hidden");
    }
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
  if (qualityMenuButton && qualityMenu) {
    qualityMenuButton.addEventListener("click", function () {
      mainSettings.classList.add("hidden");
      qualityMenu.classList.remove("hidden");
    });
  }

  // Back to main settings from speed submenu
  speedBackButton.addEventListener("click", function () {
    speedMenu.classList.add("hidden");
    mainSettings.classList.remove("hidden");
  });

  // Back to main settings from quality submenu
  if (qualityBackButton && qualityMenu) {
    qualityBackButton.addEventListener("click", function () {
      qualityMenu.classList.add("hidden");
      mainSettings.classList.remove("hidden");
    });
  }

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
  if (qualityOptions) {
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
  }

  // Initial comments data
  const initialComments = [
    {
      id: 1,
      author: "Unknown User 1",
      text: "The colors in this video are beautiful!",
      time: "3 days ago",
      likes: 12,
    },
    {
      id: 2,
      author: "Unknown User 2",
      text: "What software was used to create these effects?",
      time: "2 days ago",
      likes: 5,
    },
    {
      id: 3,
      author: "Unknown User 3",
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
    // Fixed: Make sure this element exists before toggling
    if (commentsContainer) {
      commentsContainer.classList.toggle("hidden");
      this.textContent = commentsContainer.classList.contains("hidden")
        ? "Expand"
        : "Collapse";
    } else {
      console.error("Comments container not found");
    }
  });
});
