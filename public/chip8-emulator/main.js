// main.js — Game loop, timers, sonido, input, carga de ROMs

const canvas = document.getElementById("pantalla");
const soundIndicator = document.getElementById("sound-indicator");
const romLoadBtn = document.getElementById("load-rom-btn");
const romFileInput = document.getElementById("rom-file-input");
const romSelect = document.getElementById("rom-select");
const resetBtn = document.getElementById("reset-btn");
const pauseBtn = document.getElementById("pause-btn");
const stepBtn = document.getElementById("step-btn");
const debugBtn = document.getElementById("debug-btn");
const dropZone = document.getElementById("drop-zone");
const statusText = document.getElementById("status-text");
const fpsCounter = document.getElementById("fps-counter");

const chip8 = new Chip8();
const renderer = new Renderer(canvas);
const sound = new SoundManager();

let running = false;
let animFrameId = null;
let frameCount = 0;
const INSTRUCTIONS_PER_FRAME = 10;
let fpsFrames = 0;
let fpsLastTime = 0;

// ── Mapeo de teclas: 1234/QWER/ASDF/ZXCV → 0-F ──────────────
const KEY_MAP = {
  "1": 0x1, "2": 0x2, "3": 0x3, "4": 0xC,
  "q": 0x4, "w": 0x5, "e": 0x6, "r": 0xD,
  "a": 0x7, "s": 0x8, "d": 0x9, "f": 0xE,
  "z": 0xA, "x": 0x0, "c": 0xB, "v": 0xF
};

const loadedROMs = {};
let currentROM = null; // { name, data } — ROM activa para reset

// ── TIMERS 60Hz ──────────────────────────────────────────────
let _prevSoundActive = false;

setInterval(() => {
  chip8.updateTimers();

  const isActive = chip8.soundTimer > 0;

  if (isActive !== _prevSoundActive) {
    _prevSoundActive = isActive;
    if (isActive) {
      sound.play();
      soundIndicator.textContent = "SOUND: ON";
      soundIndicator.classList.add("active");
    } else {
      sound.stop();
      soundIndicator.textContent = "SOUND: OFF";
      soundIndicator.classList.remove("active");
    }
  }
}, 1000 / 60);

// ── GAME LOOP (fijo a 60fps) ─────────────────────────────────
// ── GAME LOOP (fijo a 60fps) ─────────────────────────────────
const TARGET_FPS = 60;
const FRAME_DURATION = 1000 / TARGET_FPS; // 16.67ms
let lastFrameTime = 0;

function gameLoop(timestamp) {
  if (!running) return;

  animFrameId = requestAnimationFrame(gameLoop);

  // ── Limitar a 60fps independiente del monitor ──
  const elapsed = timestamp - lastFrameTime;
  if (elapsed < FRAME_DURATION) return; // Aún no toca el siguiente frame

  // Compensar drift acumulado (en lugar de lastFrameTime = timestamp)
  lastFrameTime = timestamp - (elapsed % FRAME_DURATION);

  // FPS counter (actualizar cada ~0.5s)
  fpsFrames++;
  if (timestamp - fpsLastTime > 500) {
    const fps = Math.round(fpsFrames * 1000 / (timestamp - fpsLastTime));
    fpsCounter.textContent = fps + " FPS";
    fpsFrames = 0;
    fpsLastTime = timestamp;
  }

  // 10 instrucciones fijas por frame (estándar CHIP-8)
  for (let i = 0; i < INSTRUCTIONS_PER_FRAME; i++) {
    const opcode = chip8.step();
    if (typeof logOpcode === "function" && opcode !== undefined) {
      logOpcode(opcode);
    }
  }

  // Render
  if (chip8.drawFlag) {
    renderer.render(chip8.display);
    chip8.drawFlag = false;
  }

  // Debugger a ~15fps (cada 4 frames)
  frameCount++;
  if (frameCount % 4 === 0 && typeof debuggerUpdate === "function") {
    debuggerUpdate();
  }
}

function startLoop() {
  if (running) return;
  running = true;
  lastFrameTime = performance.now(); // ← resetear aquí también
  fpsLastTime = performance.now();
  fpsFrames = 0;
  pauseBtn.textContent = "Pause";
  animFrameId = requestAnimationFrame(gameLoop);
}

function stopLoop() {
  running = false;
  pauseBtn.textContent = "Resume";
  if (animFrameId) {
    cancelAnimationFrame(animFrameId);
    animFrameId = null;
  }
}

// ── INPUT (con filtro de repetición) ──────────────────────────
document.addEventListener("keydown", (e) => {
  if (e.repeat) return;

  // Keyboard shortcuts (solo si no estamos escribiendo en un input/select)
  const tag = document.activeElement && document.activeElement.tagName;
  if (tag !== "INPUT" && tag !== "SELECT") {
    switch (e.key) {
      case " ":
        e.preventDefault();
        pauseBtn.click();
        return;
      case "s":
      case "S":
        if (!e.ctrlKey) { stepBtn.click(); return; }
        break;
    }
    if (e.ctrlKey) {
      switch (e.key.toLowerCase()) {
        case "r": e.preventDefault(); resetBtn.click(); return;
      }
    }
  }

  const key = e.key.toLowerCase();
  if (key in KEY_MAP) {
    e.preventDefault();
    chip8.setKey(KEY_MAP[key]);
    sound.audioCtx.resume();
  }
});

document.addEventListener("keyup", (e) => {
  const key = e.key.toLowerCase();
  if (key in KEY_MAP) {
    e.preventDefault();
    chip8.clearKey(KEY_MAP[key]);
  }
});

// ── TOGGLE DEBUGGER ──────────────────────────────────────────
debugBtn.addEventListener("click", () => {
  document.body.classList.toggle("debug-visible");
  debugBtn.textContent = document.body.classList.contains("debug-visible")
    ? "Debug ▾" : "Debug ▸";
});

// ── CARGA DE ROMs ────────────────────────────────────────────
function loadROM(romData, name) {
  stopLoop();
  currentROM = { name: name || "unnamed", data: romData };
  chip8.reset();
  chip8.loadROM(new Uint8Array(romData));
  statusText.textContent = (name ? name + " ✓" : "ROM loaded ✓");
  renderer.render(chip8.display);
  startLoop();
}

// Cargar ROMs precargadas (generadas por generate-roms.ps1) — lazy load
function loadPreloadedROMs() {
  if (typeof ROMS_DATA === "undefined") return;

  for (const name of ROMS_LIST) {
    const option = document.createElement("option");
    option.value = name;
    option.textContent = name;
    romSelect.appendChild(option);
  }
}

function decodeROM(name) {
  if (loadedROMs[name]) return loadedROMs[name];

  const b64 = ROMS_DATA[name];
  if (!b64) return null;

  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  loadedROMs[name] = bytes.buffer;
  return loadedROMs[name];
}

// Cargar ROM seleccionada del dropdown (lazy decode)
romSelect.addEventListener("change", () => {
  const name = romSelect.value;
  if (!name) return;
  const data = decodeROM(name);
  if (data) loadROM(data, name);
});

// File picker (soporta múltiples archivos)
romLoadBtn.addEventListener("click", () => {
  romFileInput.click();
});

romFileInput.addEventListener("change", (e) => {
  const files = e.target.files;
  if (!files.length) return;

  for (const file of files) {
    const reader = new FileReader();
    reader.fileName = file.name;
    reader.onload = (ev) => {
      const name = file.name.replace(/\.ch8$/i, "");
      loadedROMs[name] = ev.target.result;

      const option = document.createElement("option");
      option.value = name;
      option.textContent = name;
      romSelect.appendChild(option);

      romSelect.value = name;
      loadROM(ev.target.result, name);
    };
    reader.readAsArrayBuffer(file);
  }
});

// Drag & Drop
dropZone.addEventListener("dragover", (e) => {
  e.preventDefault();
  dropZone.classList.add("dragging");
});

dropZone.addEventListener("dragleave", () => {
  dropZone.classList.remove("dragging");
});

dropZone.addEventListener("drop", (e) => {
  e.preventDefault();
  dropZone.classList.remove("dragging");

  const file = e.dataTransfer.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.fileName = file.name;
  reader.onload = (ev) => {
    const name = file.name.replace(/\.ch8$/i, "");
    loadedROMs[name] = ev.target.result;

    const option = document.createElement("option");
    option.value = name;
    option.textContent = name;
    romSelect.appendChild(option);

    romSelect.value = name;
    loadROM(ev.target.result, name);
  };
  reader.readAsArrayBuffer(file);
});

// ── CONTROLES ────────────────────────────────────────────────
resetBtn.addEventListener("click", () => {
  if (currentROM) {
    loadROM(currentROM.data, currentROM.name);
    statusText.textContent = currentROM.name + " reset";
  } else {
    chip8.reset();
    renderer.limpiar();
    stopLoop();
    statusText.textContent = "Reset (no ROM)";
  }

  if (typeof debuggerUpdate === "function") {
    debuggerUpdate();
  }
});

pauseBtn.addEventListener("click", () => {
  if (running) {
    stopLoop();
    statusText.textContent = "Paused";
  } else {
    startLoop();
    statusText.textContent = "Running";
  }
});

stepBtn.addEventListener("click", () => {
  stopLoop();
  const opcode = chip8.step();

  if (chip8.drawFlag) {
    renderer.render(chip8.display);
    chip8.drawFlag = false;
  }

  if (typeof logOpcode === "function" && opcode !== undefined) {
    logOpcode(opcode);
  }

  if (typeof debuggerUpdate === "function") {
    debuggerUpdate();
  }

  statusText.textContent = "Stepped";
});

// Render inicial + precargar ROMs
renderer.limpiar();
loadPreloadedROMs();
