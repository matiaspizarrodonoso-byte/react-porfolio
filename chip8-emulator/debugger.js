// debugger.js — Panel de debugging visual

class Debugger {
  constructor() {
    this.opcodeLog = [];
    this.MAX_LOG = 20;
    this.paused = false;
    this.miniCtx = null;
    this.miniData = null;
    this._cachedRegs = new Array(16).fill(null);
    this._stackCells = [];
    this._logCells = [];
    this._prevStackSP = -1;
    this._prevStackData = null;
    this._prevLogLength = 0;
    this._buildRegisterGrid();
    this._initMiniPreview();
    this._buildStackCells();
    this._buildLogCells();
  }

  _buildRegisterGrid() {
    const grid = document.getElementById("reg-grid");
    if (!grid) return;

    for (let i = 0; i < 16; i++) {
      const label = "V" + i.toString(16).toUpperCase();
      const span = document.createElement("span");
      span.className = "reg-value";
      span.id = `v${i.toString(16).toUpperCase()}`;
      span.textContent = "00";

      const item = document.createElement("div");
      item.className = "reg-item";
      item.innerHTML = `<span class="reg-label">${label}</span>`;
      item.appendChild(span);

      grid.appendChild(item);
      this._cachedRegs[i] = span;
    }
  }

  _initMiniPreview() {
    const canvas = document.getElementById("mini-canvas");
    if (!canvas) return;
    this.miniCtx = canvas.getContext("2d");
    this.miniData = this.miniCtx.createImageData(64, 32);
  }

  _buildStackCells() {
    const container = document.getElementById("stack-values");
    if (!container) return;
    container.innerHTML = "";

    for (let i = 0; i < 16; i++) {
      const div = document.createElement("div");
      div.className = "stack-entry";
      div.style.display = "none";
      container.appendChild(div);
      this._stackCells.push(div);
    }
  }

  _buildLogCells() {
    const container = document.getElementById("opcode-log-values");
    if (!container) return;
    container.innerHTML = "";

    for (let i = 0; i < this.MAX_LOG; i++) {
      const div = document.createElement("div");
      div.className = "log-entry";
      container.appendChild(div);
      this._logCells.push(div);
    }
  }

  logOpcode(opcode) {
    const hex = "0x" + opcode.toString(16).toUpperCase().padStart(4, "0");
    this.opcodeLog.push(hex);
    if (this.opcodeLog.length > this.MAX_LOG) {
      this.opcodeLog.shift();
    }
  }

  update(chip8) {
    // Registros V0-VF
    for (let i = 0; i < 16; i++) {
      if (this._cachedRegs[i]) {
        this._cachedRegs[i].textContent = chip8.registers[i].toString(16).toUpperCase().padStart(2, "0");
      }
    }

    // I, PC, SP
    const iVal = document.getElementById("reg-i");
    const pcVal = document.getElementById("reg-pc");
    const spVal = document.getElementById("reg-sp");
    if (iVal) iVal.textContent = "0x" + chip8.indexRegister.toString(16).toUpperCase().padStart(4, "0");
    if (pcVal) pcVal.textContent = "0x" + chip8.pc.toString(16).toUpperCase().padStart(4, "0");
    if (spVal) spVal.textContent = "0x" + (chip8.sp + 1).toString(16).toUpperCase().padStart(2, "0");

    // Timers
    const delayEl = document.getElementById("timer-delay");
    const soundEl = document.getElementById("timer-sound");
    if (delayEl) delayEl.textContent = chip8.delayTimer;
    if (soundEl) soundEl.textContent = chip8.soundTimer;

    // Stack (actualización sin reflow)
    if (chip8.sp !== this._prevStackSP) {
      for (let i = 0; i < 16; i++) {
        if (i <= chip8.sp && chip8.sp >= 0) {
          this._stackCells[i].textContent = "0x" + chip8.stack[i].toString(16).toUpperCase().padStart(4, "0");
          this._stackCells[i].style.display = "";
        } else {
          this._stackCells[i].style.display = "none";
        }
      }
      this._prevStackSP = chip8.sp;
    }

    // Opcode Log (actualización sin reflow)
    const logLen = this.opcodeLog.length;
    for (let i = 0; i < this.MAX_LOG; i++) {
      if (i < logLen) {
        this._logCells[i].textContent = this.opcodeLog[i];
        this._logCells[i].className = "log-entry" + (i === logLen - 1 ? " log-latest" : "");
      } else {
        this._logCells[i].textContent = "";
      }
    }

    // Mini display preview
    this._renderMini(chip8.display);
  }

  _renderMini(display) {
    if (!this.miniData) return;
    const data = this.miniData.data;

    for (let i = 0; i < 64 * 32; i++) {
      const px = i * 4;
      if (display[i] === 1) {
        data[px] = 0xA8;
        data[px + 1] = 0xFF;
        data[px + 2] = 0x78;
      } else {
        data[px] = 0x00;
        data[px + 1] = 0x00;
        data[px + 2] = 0x00;
      }
      data[px + 3] = 255;
    }

    this.miniCtx.putImageData(this.miniData, 0, 0);
  }
}

// ── Instancia global ────────────────────────────────────────
const debuggerInstance = new Debugger();

function logOpcode(opcode) {
  debuggerInstance.logOpcode(opcode);
}

function debuggerUpdate() {
  if (typeof chip8 !== "undefined") {
    debuggerInstance.update(chip8);
  }
}