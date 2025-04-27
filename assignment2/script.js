// DOM 요소 참조
const videoElement = document.getElementById("video");
const bodyContainer = document.querySelector(".body-container");
const overlayControls = document.querySelector(".overlay-controls");
const bottomControls = document.querySelector(".bottom-controls");
const playButton = document.querySelector(".play-button");
const playIcon = document.querySelector(".play-icon");
const pauseIcon = document.querySelector(".pause-icon");
const bottomPlayButton = document.querySelector(".bottom-play-button");
const bottomPlayIcon = document.querySelector(".bottom-play-icon");
const bottomPauseIcon = document.querySelector(".bottom-pause-icon");
const rewindButton = document.querySelector(".rewind-button");
const forwardButton = document.querySelector(".forward-button");
const bottomRewindButton = document.querySelector(".bottom-rewind-button");
const bottomForwardButton = document.querySelector(".bottom-forward-button");
const muteButton = document.querySelector(".mute-button");
const volumeIcon = document.querySelector(".volume-icon");
const muteIcon = document.querySelector(".mute-icon");
const volumeSlider = document.getElementById("volume-slider");
const progressBar = document.getElementById("progress-bar");
const progressFill = document.getElementById("progress-fill");
const currentTimeElement = document.getElementById("current-time");
const durationElement = document.getElementById("duration");
const videoContainer = document.querySelector(".video-container");

// 상태 변수
let isPlaying = false;
let isMuted = false;
let controlsVisible = true;
let mouseOverVideo = false;
let controlsTimeout;
let duration = 0;

// 비디오 메타데이터 로드 시 실행
videoElement.addEventListener("loadedmetadata", () => {
  duration = videoElement.duration;
  durationElement.textContent = formatTime(duration);
});

// 타임 업데이트마다 실행
videoElement.addEventListener("timeupdate", () => {
  const currentTime = videoElement.currentTime;
  currentTimeElement.textContent = formatTime(currentTime);
  const progress = (currentTime / duration) * 100;
  progressFill.style.width = `${progress}%`;
});

// 영상 재생 끝날 때 실행
videoElement.addEventListener("ended", () => {
  setPlayState(false);
});

// 재생/일시정지 토글
function togglePlay() {
  setPlayState(!isPlaying);
}

// 재생 상태 설정
function setPlayState(state) {
  isPlaying = state;

  if (isPlaying) {
    videoElement.play();
    setPlayIcon(true);
    bodyContainer.classList.add("playing"); // 배경색 변경: 검정색

    // 재생 시작 후 1.5초 후에 컨트롤 숨기기
    if (controlsTimeout) {
      clearTimeout(controlsTimeout);
    }

    controlsTimeout = setTimeout(() => {
      if (!mouseOverVideo) {
        setControlsVisible(false);
      }
    }, 1500);
  } else {
    videoElement.pause();
    setPlayIcon(false);
    bodyContainer.classList.remove("playing"); // 배경색 변경: 흰색

    // 정지 상태에서는 항상 컨트롤 표시
    setControlsVisible(true);

    // 타이머 취소
    if (controlsTimeout) {
      clearTimeout(controlsTimeout);
    }
  }
}

// 컨트롤 표시 여부 설정
function setControlsVisible(visible) {
  controlsVisible = visible;

  if (!controlsVisible) {
    overlayControls.classList.add("hidden");
    bottomControls.classList.add("hidden");
  } else {
    overlayControls.classList.remove("hidden");
    bottomControls.classList.remove("hidden");
  }
}

// 재생/일시정지 아이콘 변경
function setPlayIcon(playing) {
  if (playing) {
    playIcon.style.display = "none";
    pauseIcon.style.display = "flex";
    bottomPlayIcon.style.display = "none";
    bottomPauseIcon.style.display = "flex";
    playButton.classList.add("playing");
    bottomPlayButton.classList.add("playing");
  } else {
    playIcon.style.display = "flex";
    pauseIcon.style.display = "none";
    bottomPlayIcon.style.display = "flex";
    bottomPauseIcon.style.display = "none";
    playButton.classList.remove("playing");
    bottomPlayButton.classList.remove("playing");
  }
}

// 볼륨 아이콘 변경
function setVolumeIcon(muted) {
  if (muted) {
    volumeIcon.style.display = "none";
    muteIcon.style.display = "flex";
  } else {
    volumeIcon.style.display = "flex";
    muteIcon.style.display = "none";
  }
}

// 10초 뒤로
function handleRewind() {
  videoElement.currentTime = Math.max(0, videoElement.currentTime - 10);
}

// 10초 앞으로
function handleForward() {
  videoElement.currentTime = Math.min(duration, videoElement.currentTime + 10);
}

// 음소거 토글
function toggleMute() {
  isMuted = !isMuted;
  videoElement.muted = isMuted;
  setVolumeIcon(isMuted);

  if (isMuted) {
    volumeSlider.value = 0;
  } else {
    // 이전 볼륨으로 복원 (0이 아닌 값)
    volumeSlider.value =
      volumeSlider.value === "0" ? "0.5" : volumeSlider.value;
  }
}

// 볼륨 변경
function handleVolumeChange() {
  const newVolume = parseFloat(volumeSlider.value);
  videoElement.volume = newVolume;
  isMuted = newVolume === 0;
  setVolumeIcon(isMuted);
}

// 진행 막대 클릭 시 영상 이동
function handleProgressClick(e) {
  const rect = progressBar.getBoundingClientRect();
  const pos = (e.clientX - rect.left) / rect.width;
  videoElement.currentTime = pos * duration;
}

// 시간 포맷 함수
function formatTime(time) {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
}

// 버튼 클릭시 파동 효과를 위한 함수
function createRipple(event, button) {
  const rect = button.getBoundingClientRect();

  const diameter = Math.max(rect.width, rect.height);
  const radius = diameter / 2;

  const ripple = document.createElement("span");
  ripple.classList.add("ripple");
  ripple.style.width = ripple.style.height = `${diameter}px`;
  ripple.style.left = `${event.clientX - rect.left - radius}px`;
  ripple.style.top = `${event.clientY - rect.top - radius}px`;

  button.appendChild(ripple);

  // 파동 효과가 끝난 후 제거
  setTimeout(() => {
    ripple.remove();
  }, 600);
}

// 이벤트 리스너 등록
videoContainer.addEventListener("click", togglePlay);
playButton.addEventListener("click", (e) => {
  e.stopPropagation();
  createRipple(e, playButton);
  togglePlay();
});
bottomPlayButton.addEventListener("click", (e) => {
  createRipple(e, bottomPlayButton);
  togglePlay();
});

rewindButton.addEventListener("click", (e) => {
  e.stopPropagation();
  createRipple(e, rewindButton);
  handleRewind();
});
bottomRewindButton.addEventListener("click", (e) => {
  createRipple(e, bottomRewindButton);
  handleRewind();
});

forwardButton.addEventListener("click", (e) => {
  e.stopPropagation();
  createRipple(e, forwardButton);
  handleForward();
});
bottomForwardButton.addEventListener("click", (e) => {
  createRipple(e, bottomForwardButton);
  handleForward();
});

muteButton.addEventListener("click", (e) => {
  createRipple(e, muteButton);
  toggleMute();
});
volumeSlider.addEventListener("input", handleVolumeChange);
progressBar.addEventListener("click", handleProgressClick);

// 마우스가 비디오 위에 있을 때 컨트롤 표시
videoContainer.addEventListener("mouseenter", () => {
  mouseOverVideo = true;

  if (isPlaying) {
    setControlsVisible(true);

    // 마우스가 비디오 위에 있어도 1.5초 후 다시 숨김
    if (controlsTimeout) {
      clearTimeout(controlsTimeout);
    }

    controlsTimeout = setTimeout(() => {
      if (isPlaying) {
        setControlsVisible(false);
      }
    }, 1500);
  }
});

videoContainer.addEventListener("mouseleave", () => {
  mouseOverVideo = false;
});
