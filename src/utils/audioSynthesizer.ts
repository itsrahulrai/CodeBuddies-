// Web Audio API Synthesizer for Mechanical Keyboard SFX, City Noise & Ambient Generators

class AudioSynthesizer {
  private ctx: AudioContext | null = null;
  private rainGain: GainNode | null = null;
  private rainNode: AudioNode | null = null;
  
  private cityGain: GainNode | null = null;
  private cityNode: AudioNode | null = null;

  private cafeGain: GainNode | null = null;
  private cafeNode: AudioNode | null = null;

  private keyboardTimer: NodeJS.Timeout | null = null;
  private keyboardVolume = 0.5;

  private vinylGain: GainNode | null = null;
  private vinylNode: AudioNode | null = null;
  private vinylInterval: number | null = null;

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

  // Synthesize crisp mechanical keyboard switch sound
  public playKeyClick(volumeScale = 1) {
    try {
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      const pitch = 1700 + Math.random() * 800;
      osc.type = 'sine';
      osc.frequency.setValueAtTime(pitch, now);
      osc.frequency.exponentialRampToValueAtTime(120, now + 0.03);

      const targetGain = 0.12 * volumeScale;
      gain.gain.setValueAtTime(targetGain, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.04);
    } catch {
      // Audio context error ignore
    }
  }

  // Mechanical Keyboard Continuous Typing Loop
  public setKeyboardActive(active: boolean, volume = 0.5) {
    this.keyboardVolume = volume;
    if (active) {
      if (!this.keyboardTimer) {
        const scheduleNextKey = () => {
          this.playKeyClick(this.keyboardVolume);
          // Random burst typing rhythm
          const delay = Math.random() < 0.25 ? 250 + Math.random() * 500 : 80 + Math.random() * 120;
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

  // Synthesize City Traffic & Night Atmosphere (Deep Brown/Pink filtered noise with gentle swell)
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

        // Bandpass/Lowpass filter for deep city hum and distant traffic
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

  // Toggle Ambient Rain Generator (Pink noise filter)
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
          // Sparse high spikes to imitate dust crackles on vinyl
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
