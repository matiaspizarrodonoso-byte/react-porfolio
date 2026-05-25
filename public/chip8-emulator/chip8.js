class Chip8 {
  constructor() {
    // MEMORIA — 4096 bytes en total
    // Los primeros 512 bytes (0x000 a 0x1FF) eran usados por el intérprete original
    // Los programas/ROMs se cargan a partir de 0x200
    this.memory = new Uint8Array(4096);

    // REGISTROS - 16 registros de propósito general, llamados V0 a VF
    // VF es especial: se usa como "flag" (bandera) para colisiones y otros resultados
    this.registers = new Uint8Array(16);

    // REGISTRO I - registro de 16 bits usado para guardar direcciones de memoria
    // Se usa principalmente con instrucciones que leen o escriben en memoria
    this.indexRegister = 0;

    // PROGRAM COUNTER - apunta a la instrucción actual en memoria
    // Empieza en 0x200 porque ahí es donde comienza toda ROM de CHIP-8
    this.pc = 0x200;

    // STACK - guarda direcciones de retorno cuando el programa llama a una subrutina
    // Tiene 16 niveles de profundidad (puedes hacer hasta 16 llamadas anidadas)
    this.stack = new Uint16Array(16);

    // STACK POINTER - indica cuál es la posición actual del stack
    // Empieza en -1 porque el stack esta vacío
    this.sp = -1;

    // DISPLAY — la pantalla es de 64 columnas × 32 filas
    // Cada posición es un booleano: true = píxel encendido, false = apagado
    // Usamos Uint8Array donde 1 = encendido, 0 = apagado
    this.display = new Uint8Array(64 * 32);

    // TIMERS - dos contadores que bajan a 60HZ (60 veces por segundo)
    // delayTimer: se usa para sincronizar timing en juegos
    // soundTimer: cuando es mayor que 0, el CHIP-8 emite un pitido
    this.delayTimer = 0;
    this.soundTimer = 0;

    // Teclado - 16 teclas (0x0 a 0xF)
    // Cada posición es true si la tecla está presionada, false si no
    this.keys = new Uint8Array(16);

    // FLAG - indica si la pantalla cambió y hay que redibujarla
    this.drawFlag = false;

    // Flag para la instrucción FX0A (esperar tecla)
    this.waitingForKey = false;
    this.keyRegister = 0;

    // Cargamos las fuentes al iniciar
    this.loadFonts();
  }

  loadFonts() {
    // Los 16 caracteres hexadecimales (0-F), cada uno ocupa 5 bytes
    const fonts = [
      0xF0, 0x90, 0x90, 0x90, 0xF0, // 0
      0x20, 0x60, 0x20, 0x20, 0x70, // 1
      0xF0, 0x10, 0xF0, 0x80, 0xF0, // 2
      0xF0, 0x10, 0xF0, 0x10, 0xF0, // 3
      0x90, 0x90, 0xF0, 0x10, 0x10, // 4
      0xF0, 0x80, 0xF0, 0x10, 0xF0, // 5
      0xF0, 0x80, 0xF0, 0x90, 0xF0, // 6
      0xF0, 0x10, 0x20, 0x40, 0x40, // 7
      0xF0, 0x90, 0xF0, 0x90, 0xF0, // 8
      0xF0, 0x90, 0xF0, 0x10, 0xF0, // 9
      0xF0, 0x90, 0xF0, 0x90, 0x90, // A
      0xE0, 0x90, 0xE0, 0x90, 0xE0, // B
      0xF0, 0x80, 0x80, 0x80, 0xF0, // C
      0xE0, 0x90, 0x90, 0x90, 0xE0, // D
      0xF0, 0x80, 0xF0, 0x80, 0xF0, // E
      0xF0, 0x80, 0xF0, 0x80, 0x80  // F
    ];

    // Los guardamos en memoria a partir de la posición 0x050
    // Esta es la convención estándar — los programas asumen que están ahí
    for (let i = 0; i < fonts.length; i++) {
      this.memory[0x050 + i] = fonts[i];
    }
  }

  loadROM(romData) {
    // romData es un Uint8Array con los bytes del archivo
    // Lo copiamos en memoria a partir de 0x200
    for (let i = 0; i < romData.length; i++) {
      this.memory[0x200 + i] = romData[i];
    }
  }

  reset() {
    this.memory.fill(0);
    this.registers.fill(0);
    this.indexRegister = 0;
    this.pc = 0x200;
    this.stack.fill(0);
    this.sp = -1;
    this.display.fill(0);
    this.delayTimer = 0;
    this.soundTimer = 0;
    this.keys.fill(0);
    this.drawFlag = false;
    this.waitingForKey = false;
    this.keyRegister = 0;
    this.loadFonts();
  }

  fetch() {
    // Leemos el byte en la posición actual del PC
    // y el siguiente byte (PC + 1)
    const byte1 = this.memory[this.pc];
    const byte2 = this.memory[this.pc + 1];

    // Los unimos en un opcode de 16 bits
    // byte1 va a la parte alta (lo subimos 8 posiciones con <<)
    // byte2 va a la parte baja (lo unimos con |)
    const opcode = (byte1 << 8) | byte2;

    // Avanzamos el PC en 2 para la próxima instrucción
    this.pc += 2;

    return opcode;
  }

  decode(opcode) {
    // El primer nibble identifica el tipo de instrucción
    const tipo = (opcode >> 12) & 0xF;

    // X e Y son índices de registros (V0-VF)
    // Se usan en casi todas las instrucciones
    const x = (opcode >> 8) & 0xF;
    const y = (opcode >> 4) & 0xF;

    // n es un valor de 4 bits (0-15)
    const n = opcode & 0xF;

    // nn es un valor de 8 bits completo (los dos nibbles bajos juntos)
    // Se usa cuando la instrucción necesita un número más grande
    const nn = opcode & 0xFF;

    // nnn es una dirección de memoria de 12 bits (los tres nibbles bajos)
    // Se usa para saltar a una posición de memoria
    const nnn = opcode & 0xFFF;

    return { tipo, x, y, n, nn, nnn };
  }

  execute(opcode) {
    const { tipo, x, y, n, nn, nnn } = this.decode(opcode);

    switch (tipo) {
      case 0x0:
        if (opcode === 0x00E0) {
          // 00E0 — Limpiar la pantalla
          this.display.fill(0);
          this.drawFlag = true;
        } else if (opcode === 0x00EE) {
          // 00EE — Retornar de una subrutina
          this.pc = this.stack[this.sp];
          this.sp--;
        }
        break;

      case 0x1:
        // 1NNN — Saltar a la dirección NNN
        this.pc = nnn;
        break;

      case 0x2:
        // 2NNN — Llamar a subrutina en NNN
        this.sp++;
        this.stack[this.sp] = this.pc;
        this.pc = nnn;
        break;

      case 0x3:
        // 3XNN — Saltar si VX == NN
        if (this.registers[x] === nn) {
          this.pc += 2;
        }
        break;

      case 0x4:
        // 4XNN — Saltar si VX != NN
        if (this.registers[x] !== nn) {
          this.pc += 2;
        }
        break;

      case 0x5:
        // 5XY0 — Saltar si VX == VY
        if (this.registers[x] === this.registers[y]) {
          this.pc += 2;
        }
        break;

      case 0x6:
        // 6XNN — Cargar valor en VX
        this.registers[x] = nn;
        break;

      case 0x7:
        // 7XNN — Sumar NN a VX
        this.registers[x] += nn;
        break;

      case 0x8: {
        // 8XY0-8XYE — Operaciones aritméticas/lógicas
        const vy = this.registers[y];
        const vx = this.registers[x];
        let temp;

        switch (n) {
          case 0x0:
            // 8XY0 — Vx = Vy
            this.registers[x] = vy;
            break;

          case 0x1:
            // 8XY1 — Vx = Vx OR Vy
            this.registers[x] = vx | vy;
            break;

          case 0x2:
            // 8XY2 — Vx = Vx AND Vy
            this.registers[x] = vx & vy;
            break;

          case 0x3:
            // 8XY3 — Vx = Vx XOR Vy
            this.registers[x] = vx ^ vy;
            break;

          case 0x4: {
            // 8XY4 — Vx = Vx + Vy, VF = carry
            temp = vx + vy;
            this.registers[x] = temp & 0xFF;
            this.registers[0xF] = temp > 0xFF ? 1 : 0;
            break;
          }

          case 0x5: {
            // 8XY5 — Vx = Vx - Vy, VF = NOT borrow
            temp = vx - vy;
            this.registers[x] = temp & 0xFF;
            this.registers[0xF] = vx >= vy ? 1 : 0;
            break;
          }

          case 0x6: {
            // 8XY6 — Vx = Vx >> 1, VF = LSB
            this.registers[0xF] = vx & 0x1;
            this.registers[x] = vx >> 1;
            break;
          }

          case 0x7: {
            // 8XY7 — Vx = Vy - Vx, VF = NOT borrow
            temp = vy - vx;
            this.registers[x] = temp & 0xFF;
            this.registers[0xF] = vy >= vx ? 1 : 0;
            break;
          }

          case 0xE: {
            // 8XYE — Vx = Vx << 1, VF = MSB
            this.registers[0xF] = (vx >> 7) & 0x1;
            this.registers[x] = (vx << 1) & 0xFF;
            break;
          }

          default:
            console.warn(`Opcode 8 desconocido: 0x${opcode.toString(16).toUpperCase()}`);
        }
        break;
      }

      case 0x9:
        // 9XY0 — Saltar si VX != VY
        if (this.registers[x] !== this.registers[y]) {
          this.pc += 2;
        }
        break;

      case 0xA:
        // ANNN — Cargar dirección en el registro I
        this.indexRegister = nnn;
        break;

      case 0xB:
        // BNNN — Saltar a NNN + V0
        this.pc = nnn + this.registers[0];
        break;

      case 0xC:
        // CXNN — Número aleatorio AND NN, guardarlo en VX
        const aleatorio = Math.floor(Math.random() * 256);
        this.registers[x] = aleatorio & nn;
        break;

      case 0xD: {
        // DXYN — Dibujar sprite
        const posX = this.registers[x] % 64;
        const posY = this.registers[y] % 32;
        this.registers[0xF] = 0;

        for (let fila = 0; fila < n; fila++) {
          const spriteByte = this.memory[this.indexRegister + fila];

          for (let bit = 0; bit < 8; bit++) {
            if ((spriteByte & (0x80 >> bit)) !== 0) {
              const px = (posX + bit) % 64;
              const py = (posY + fila) % 32;
              const idx = py * 64 + px;

              if (this.display[idx] === 1) {
                this.registers[0xF] = 1;
              }

              this.display[idx] ^= 1;
            }
          }
        }

        this.drawFlag = true;
        break;
      }

      case 0xE:
        switch (nn) {
          case 0x9E:
            // EX9E — Saltar si tecla Vx presionada
            if (this.keys[this.registers[x]] === 1) {
              this.pc += 2;
            }
            break;

          case 0xA1:
            // EXA1 — Saltar si tecla Vx NO presionada
            if (this.keys[this.registers[x]] === 0) {
              this.pc += 2;
            }
            break;

          default:
            console.warn(`Opcode E desconocido: 0x${opcode.toString(16).toUpperCase()}`);
        }
        break;

      case 0xF:
        switch (nn) {
          case 0x07:
            // FX07 — Vx = delayTimer
            this.registers[x] = this.delayTimer;
            break;

          case 0x0A:
            // FX0A — Esperar tecla, guardar en Vx
            this.waitingForKey = true;
            this.keyRegister = x;
            break;

          case 0x15:
            // FX15 — delayTimer = Vx
            this.delayTimer = this.registers[x];
            break;

          case 0x18:
            // FX18 — soundTimer = Vx
            this.soundTimer = this.registers[x];
            break;

          case 0x1E:
            // FX1E — I = I + Vx
            this.indexRegister += this.registers[x];
            break;

          case 0x29:
            // FX29 — I = sprite addr de char Vx
            this.indexRegister = 0x050 + (this.registers[x] & 0xF) * 5;
            break;

          case 0x33:
            // FX33 — BCD de Vx en I, I+1, I+2
            const val = this.registers[x];
            this.memory[this.indexRegister] = Math.floor(val / 100);
            this.memory[this.indexRegister + 1] = Math.floor((val % 100) / 10);
            this.memory[this.indexRegister + 2] = val % 10;
            break;

          case 0x55:
            // FX55 — Guardar V0-Vx en memoria desde I
            for (let i = 0; i <= x; i++) {
              this.memory[this.indexRegister + i] = this.registers[i];
            }
            // En implementaciones modernas, I no se incrementa
            this.indexRegister += x + 1;
            break;

          case 0x65:
            // FX65 — Cargar V0-Vx desde memoria desde I
            for (let i = 0; i <= x; i++) {
              this.registers[i] = this.memory[this.indexRegister + i];
            }
            this.indexRegister += x + 1;
            break;

          default:
            console.warn(`Opcode F desconocido: 0x${opcode.toString(16).toUpperCase()}`);
        }
        break;

      default:
        console.warn(`Opcode desconocido: 0x${opcode.toString(16).toUpperCase()}`);
    }
  }

  step() {
    // 1. Si estamos esperando tecla, no ejecutamos
    if (this.waitingForKey) {
      return;
    }

    // 2. Leer la instrucción de memoria
    const opcode = this.fetch();

    // 3. Ejecutar (decodificar está dentro de execute)
    this.execute(opcode);

    return opcode;
  }

  setKey(key) {
    this.keys[key] = 1;
    if (this.waitingForKey) {
      this.registers[this.keyRegister] = key;
      this.waitingForKey = false;
    }
  }

  clearKey(key) {
    this.keys[key] = 0;
  }

  updateTimers() {
    if (this.delayTimer > 0) {
      this.delayTimer--;
    }
    if (this.soundTimer > 0) {
      this.soundTimer--;
    }
  }
}
