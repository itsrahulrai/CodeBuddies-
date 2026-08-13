// Web Audio API Synthesizer for Mechanical Keyboard SFX & Ambient Generators

class AudioSynthesizer {
  private ctx: AudioContext | null = null;
  private rainGain: GainNode | null = null;
  private rainNode: AudioNode | null = null;
  
  private vinylGain: GainNode | null = null;
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
  public playKeyClick() {
    try {
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      // High frequency click transient
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      // Pitch variation for natural keyboard typing
      const pitch = 1800 + Math.random() * 800;
      osc.type = 'sine';
      osc.frequency.setValueAtTime(pitch, now);
      osc.frequency.exponentialRampToValueAtTime(120, now + 0.03);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.04);
    } catch {
      // Audio context error ignore
    }
  }

  // Synthesize Coffee Sip / mug sound
  public playCoffeeSip() {
    try {
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(400, now);
      osc.frequency.exponentialRampToValueAtTime(900, now + 0.15);
      osc.frequency.exponentialRampToValueAtTime(200, now + 0.3);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.32);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.33);
    } catch {
      // ignore
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
          output[i] *= 0.11; // scale volume
          b6 = white * 0.115926;
        }

        const whiteNoise = this.ctx.createBufferSource();
        whiteNoise.buffer = noiseBuffer;
        whiteNoise.loop = true;

        // Lowpass filter for soft rain sound
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
}

export const audioSynth = new AudioSynthesizer();
