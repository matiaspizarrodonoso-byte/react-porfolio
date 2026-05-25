class SoundManager {
  constructor() {
    // Crear AudioContext 1 sola vez
    this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    this.oscillator = null;
    this.active = false;
    this.volume = 0.1;
  }

  play() {
    if (this.active) return;

    // Resume si está suspendido (política de autoplay)
    if (this.audioCtx.state === "suspended") {
      this.audioCtx.resume();
    }

    this.oscillator = this.audioCtx.createOscillator();
    this.oscillator.type = "square";
    this.oscillator.frequency.setValueAtTime(440, this.audioCtx.currentTime);

    const gain = this.audioCtx.createGain();
    gain.gain.setValueAtTime(this.volume, this.audioCtx.currentTime);

    this.oscillator.connect(gain);
    gain.connect(this.audioCtx.destination);
    this.oscillator.start();
    this.active = true;
  }

  stop() {
    if (!this.active || !this.oscillator) return;

    this.oscillator.stop();
    this.oscillator.disconnect();
    this.oscillator = null;
    this.active = false;
  }
}
