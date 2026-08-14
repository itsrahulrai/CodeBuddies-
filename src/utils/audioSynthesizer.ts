// Web Audio API Synthesizer for Mechanical Keyboard SFX, Server Room, Coding FX & Ambient Generators

export type KeyboardSwitchType = 'thock' | 'clicky' | 'creamy';

class AudioSynthesizer {
  private ctx: AudioContext | null = null;
  
  // Ambient Sound Generators
  private rainGain: GainNode | null = null;
  private rainNode: AudioNode | null = null;
  
  private cityGain: GainNode | null = null;
  private cityNode: AudioNode | null = null;

  private cafeGain: GainNode | null = null;
  private cafeNode: AudioNode | null = null;

  private serverGain: GainNode | null = null;
  private serverNode: AudioNode | null = null;

  private keyboardTimer: NodeJS.Timeout | null = null;
  private keyboardVolume = 0.5;
  private currentSwitchType: KeyboardSwitchType = 'thock';

  private vinylGain: GainNode | null = null;
  private vinylNode: AudioNode | null = null;

  private waveGain: GainNode | null = null;
  private waveOsc1: OscillatorNode | null = null;
  private waveOsc2: OscillatorNode | null = null;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Synthesize crisp mechanical keyboard switch sounds (Thock / Clicky / Creamy)
  public playKeyClick(volumeScale = 1, switchType: KeyboardSwitchType = 'thock') {
    try {
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      if (switchType === 'thock') {
        // Deep, rich, lubricated mechanical linear thock
        const pitch = 320 + Math.random() * 80;
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(pitch, now);
        osc.frequency.exponentialRampToValueAtTime(60, now + 0.045);

        const targetGain = 0.22 * volumeScale;
        gain.gain.setValueAtTime(targetGain, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.055);
      } else if (switchType === 'clicky') {
        // High-pitched tactile Cherry MX Blue click
        const pitch = 1900 + Math.random() * 600;
        osc.type = 'sine';
        osc.frequency.setValueAtTime(pitch, now);
        osc.frequency.exponentialRampToValueAtTime(140, now + 0.025);

        const targetGain = 0.15 * volumeScale;
        gain.gain.setValueAtTime(targetGain, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.035);
      } else {
        // Creamy subtle tactile switch
        const pitch = 550 + Math.random() * 120;
        osc.type = 'sine';
        osc.frequency.setValueAtTime(pitch, now);
        osc.frequency.exponentialRampToValueAtTime(90, now + 0.04);

        const targetGain = 0.16 * volumeScale;
        gain.gain.setValueAtTime(targetGain, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.045);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.05);
      }
    } catch {
      // Audio context error ignore
    }
  }

  // Mechanical Keyboard Continuous Typing Loop
  public setKeyboardActive(active: boolean, volume = 0.5, switchType: KeyboardSwitchType = 'thock') {
    this.keyboardVolume = volume;
    this.currentSwitchType = switchType;
    if (active) {
      if (!this.keyboardTimer) {
        const scheduleNextKey = () => {
          this.playKeyClick(this.keyboardVolume, this.currentSwitchType);
          // Realistic coder bursts with pauses between functions
          const delay = Math.random() < 0.2 ? 350 + Math.random() * 600 : 75 + Math.random() * 110;
          this.keyboardTimer = setTimeout(scheduleNextKey, delay);
        };
        scheduleNextKey();
      }
    } else {
      if (this.keyboardTimer) {
        clearTimeout(this.keyboardTimer);
        this.keyboardTimer = null;
      }
    }
  }

  // Synthesize Server Room / Datacenter Cooling Fans & Rack Hum
  public setServerActive(active: boolean, volume = 0.4) {
    this.initContext();
    if (!this.ctx) return;

    if (active) {
      if (!this.serverNode) {
        const bufferSize = 2 * this.ctx.sampleRate;
        const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);

        for (let i = 0; i < bufferSize; i++) {
          output[i] = (Math.random() * 2 - 1) * 0.07;
        }

        const fanNoise = this.ctx.createBufferSource();
        fanNoise.buffer = noiseBuffer;
        fanNoise.loop = true;

        // Bandpass filter centered at 380Hz for server rack fan air-cooling whoosh
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.value = 380;
        filter.Q.value = 0.8;

        // Sub-bass 60Hz server transformer hum
        const humOsc = this.ctx.createOscillator();
        humOsc.type = 'sine';
        humOsc.frequency.value = 60;

        const humGain = this.ctx.createGain();
        humGain.gain.value = 0.15;

        this.serverGain = this.ctx.createGain();
        this.serverGain.gain.value = volume * 0.4;

        fanNoise.connect(filter);
        filter.connect(this.serverGain);
        humOsc.connect(humGain);
        humGain.connect(this.serverGain);
        this.serverGain.connect(this.ctx.destination);

        fanNoise.start();
        humOsc.start();
        this.serverNode = fanNoise;
      } else if (this.serverGain) {
        this.serverGain.gain.setValueAtTime(volume * 0.4, this.ctx.currentTime);
      }
    } else {
      if (this.serverNode) {
        try {
          (this.serverNode as AudioBufferSourceNode).stop();
        } catch { /* ignore */ }
        this.serverNode = null;
        this.serverGain = null;
      }
    }
  }

  // Build Success Major Triad Chime (C5 -> E5 -> G5 -> C6)
  public playBuildSuccess() {
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      
      notes.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        const startTime = now + idx * 0.08;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, startTime);

        gain.gain.setValueAtTime(0.12, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.35);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.start(startTime);
        osc.stop(startTime + 0.38);
      });
    } catch { /* ignore */ }
  }

  // Git Push Synced Confirmation (Swoosh + Chord)
  public playGitPush() {
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.18);

      gain.gain.setValueAtTime(0.14, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.25);
    } catch { /* ignore */ }
  }

  // Terminal Bell Beep (ANSI / Retro 880Hz Pip)
  public playTerminalBell() {
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, now);

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.14);
    } catch { /* ignore */ }
  }

  // Synthesize City Traffic & Night Atmosphere
  public setCityActive(active: boolean, volume = 0.5) {
    this.initContext();
    if (!this.ctx) return;

    if (active) {
      if (!this.cityNode) {
        const bufferSize = 2 * this.ctx.sampleRate;
        const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        let lastOut = 0.0;

        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          output[i] = (lastOut + (0.02 * white)) / 1.02;
          lastOut = output[i];
          output[i] *= 3.5;
        }

        const brownNoise = this.ctx.createBufferSource();
        brownNoise.buffer = noiseBuffer;
        brownNoise.loop = true;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 220;

        this.cityGain = this.ctx.createGain();
        this.cityGain.gain.value = volume * 0.4;

        brownNoise.connect(filter);
        filter.connect(this.cityGain);
        this.cityGain.connect(this.ctx.destination);

        brownNoise.start();
        this.cityNode = brownNoise;
      } else if (this.cityGain) {
        this.cityGain.gain.setValueAtTime(volume * 0.4, this.ctx.currentTime);
      }
    } else {
      if (this.cityNode) {
        try {
          (this.cityNode as AudioBufferSourceNode).stop();
        } catch { /* ignore */ }
        this.cityNode = null;
        this.cityGain = null;
      }
    }
  }

  // Toggle Ambient Rain Generator
  public setRainActive(active: boolean, volume = 0.5) {
    this.initContext();
    if (!this.ctx) return;

    if (active) {
      if (!this.rainNode) {
        const bufferSize = 2 * this.ctx.sampleRate;
        const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;

        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          b0 = 0.99886 * b0 + white * 0.0555179;
          b1 = 0.99332 * b1 + white * 0.0750759;
          b2 = 0.96900 * b2 + white * 0.1538520;
          b3 = 0.86650 * b3 + white * 0.3104856;
          b4 = 0.55000 * b4 + white * 0.5329522;
          b5 = -0.7616 * b5 - white * 0.0168980;
          output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
          output[i] *= 0.11;
          b6 = white * 0.115926;
        }

        const whiteNoise = this.ctx.createBufferSource();
        whiteNoise.buffer = noiseBuffer;
        whiteNoise.loop = true;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 1000;

        this.rainGain = this.ctx.createGain();
        this.rainGain.gain.value = volume * 0.3;

        whiteNoise.connect(filter);
        filter.connect(this.rainGain);
        this.rainGain.connect(this.ctx.destination);

        whiteNoise.start();
        this.rainNode = whiteNoise;
      } else if (this.rainGain) {
        this.rainGain.gain.setValueAtTime(volume * 0.3, this.ctx.currentTime);
      }
    } else {
      if (this.rainNode) {
        try {
          (this.rainNode as AudioBufferSourceNode).stop();
        } catch { /* ignore */ }
        this.rainNode = null;
        this.rainGain = null;
      }
    }
  }

  // Toggle Cafe Ambience Generator
  public setCafeActive(active: boolean, volume = 0.4) {
    this.initContext();
    if (!this.ctx) return;

    if (active) {
      if (!this.cafeNode) {
        const bufferSize = 2 * this.ctx.sampleRate;
        const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);

        for (let i = 0; i < bufferSize; i++) {
          output[i] = (Math.random() * 2 - 1) * 0.08;
        }

        const noise = this.ctx.createBufferSource();
        noise.buffer = noiseBuffer;
        noise.loop = true;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.value = 650;
        filter.Q.value = 1.2;

        this.cafeGain = this.ctx.createGain();
        this.cafeGain.gain.value = volume * 0.25;

        noise.connect(filter);
        filter.connect(this.cafeGain);
        this.cafeGain.connect(this.ctx.destination);

        noise.start();
        this.cafeNode = noise;
      } else if (this.cafeGain) {
        this.cafeGain.gain.setValueAtTime(volume * 0.25, this.ctx.currentTime);
      }
    } else {
      if (this.cafeNode) {
        try {
          (this.cafeNode as AudioBufferSourceNode).stop();
        } catch { /* ignore */ }
        this.cafeNode = null;
        this.cafeGain = null;
      }
    }
  }

  // Toggle Vinyl Crackle Generator
  public setVinylActive(active: boolean, volume = 0.3) {
    this.initContext();
    if (!this.ctx) return;

    if (active) {
      if (!this.vinylNode) {
        const bufferSize = this.ctx.sampleRate;
        const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);

        for (let i = 0; i < bufferSize; i++) {
          output[i] = Math.random() < 0.003 ? (Math.random() * 2 - 1) * 0.6 : 0;
        }

        const vinyl = this.ctx.createBufferSource();
        vinyl.buffer = noiseBuffer;
        vinyl.loop = true;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'highpass';
        filter.frequency.value = 2000;

        this.vinylGain = this.ctx.createGain();
        this.vinylGain.gain.value = volume * 0.35;

        vinyl.connect(filter);
        filter.connect(this.vinylGain);
        this.vinylGain.connect(this.ctx.destination);

        vinyl.start();
        this.vinylNode = vinyl;
      } else if (this.vinylGain) {
        this.vinylGain.gain.setValueAtTime(volume * 0.35, this.ctx.currentTime);
      }
    } else {
      if (this.vinylNode) {
        try {
          (this.vinylNode as AudioBufferSourceNode).stop();
        } catch { /* ignore */ }
        this.vinylNode = null;
        this.vinylGain = null;
      }
    }
  }

  // Toggle Binaural Focus Waves
  public setWavesActive(active: boolean, volume = 0.4) {
    this.initContext();
    if (!this.ctx) return;

    if (active) {
      if (!this.waveOsc1) {
        const now = this.ctx.currentTime;
        this.waveOsc1 = this.ctx.createOscillator();
        this.waveOsc2 = this.ctx.createOscillator();
        this.waveGain = this.ctx.createGain();

        // 200 Hz Base + 207 Hz Delta Beat = 7Hz Theta Wave for deep coding focus
        this.waveOsc1.frequency.setValueAtTime(200, now);
        this.waveOsc2.frequency.setValueAtTime(207, now);

        this.waveGain.gain.setValueAtTime(volume * 0.15, now);

        this.waveOsc1.connect(this.waveGain);
        this.waveOsc2.connect(this.waveGain);
        this.waveGain.connect(this.ctx.destination);

        this.waveOsc1.start();
        this.waveOsc2.start();
      } else if (this.waveGain) {
        this.waveGain.gain.setValueAtTime(volume * 0.15, this.ctx.currentTime);
      }
    } else {
      if (this.waveOsc1) {
        try {
          this.waveOsc1.stop();
          this.waveOsc2?.stop();
        } catch { /* ignore */ }
        this.waveOsc1 = null;
        this.waveOsc2 = null;
        this.waveGain = null;
      }
    }
  }

  // Play gentle coffee sip / mug chime
  public playCoffeeSip() {
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(580, now);
      osc.frequency.exponentialRampToValueAtTime(320, now + 0.18);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.22);
    } catch {
      // Audio context error fallback
    }
  }
}

export const audioSynth = new AudioSynthesizer();

