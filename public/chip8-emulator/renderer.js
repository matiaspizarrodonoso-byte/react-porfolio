class Renderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");

    this.escala = 10;
    this.ancho = 64;
    this.alto = 32;

    this.colorOn = [0xA8, 0xFF, 0x78];
    this.colorOff = [0, 0, 0];

    // Offscreen canvas a resolución nativa (64×32)
    this.bufferCanvas = document.createElement("canvas");
    this.bufferCanvas.width = this.ancho;
    this.bufferCanvas.height = this.alto;
    this.bufferCtx = this.bufferCanvas.getContext("2d");

    // ImageData solo para el buffer pequeño
    this.data = this.bufferCtx.createImageData(this.ancho, this.alto);

    // Desactivar suavizado para escalado pixelado
    this.ctx.imageSmoothingEnabled = false;
  }

  render(display) {
    const pixels = this.data.data;

    // Solo 2048 escrituras (64×32), sin loop de escala
    for (let i = 0; i < this.ancho * this.alto; i++) {
      const px = i * 4;
      const on = display[i] === 1;
      pixels[px]     = on ? 0xA8 : 0;
      pixels[px + 1] = on ? 0xFF : 0;
      pixels[px + 2] = on ? 0x78 : 0;
      pixels[px + 3] = 255;
    }

    this.bufferCtx.putImageData(this.data, 0, 0);

    // GPU escala de 64×32 → 640×320
    this.ctx.drawImage(
      this.bufferCanvas,
      0, 0, this.ancho, this.alto,
      0, 0, this.ancho * this.escala, this.alto * this.escala
    );
  }

  limpiar() {
    this.ctx.fillStyle = "#000000";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }
}
