// Web Audio API Synthesizer for Mechanical Keyboard SFX, Server Room, Coding FX & Ambient Generators

export type KeyboardSwitchType = 'thock' | 'clicky' | 'creamy';

export class AudioSynthesizer {
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

  // Funny & Playful Thock Keystrokes (Cartoon Boing, Rubber Duck Quack, Pop, Pew Pew, Slide Whistle, etc.)
  public playFunnyKeystroke(volumeScale = 1): { name: string; emoji: string } {
    try {
      this.initContext();
      if (!this.ctx) return { name: 'Thock', emoji: '⌨️' };

      const now = this.ctx.currentTime;
      const funnySoundTypes = ['boing', 'rubber_duck', 'bubble_pop', 'laser_pew', 'slide_whistle', 'mega_thock', 'arcade_coin', 'wobble_spring'];
      const chosen = funnySoundTypes[Math.floor(Math.random() * funnySoundTypes.length)];

      switch (chosen) {
        case 'boing': {
          // Cartoon Spring Boing
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          const lfo = this.ctx.createOscillator();
          const lfoGain = this.ctx.createGain();

          osc.type = 'sine';
          osc.frequency.setValueAtTime(220, now);
          osc.frequency.exponentialRampToValueAtTime(680, now + 0.15);

          lfo.frequency.setValueAtTime(28, now);
          lfoGain.gain.setValueAtTime(45, now);
          lfo.connect(osc.frequency);

          gain.gain.setValueAtTime(0.24 * volumeScale, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

          osc.connect(gain);
          gain.connect(this.ctx.destination);

          lfo.start(now);
          osc.start(now);
          lfo.stop(now + 0.3);
          osc.stop(now + 0.3);
          return { name: 'Cartoon Boing!', emoji: '🌀' };
        }

        case 'rubber_duck': {
          // Hilarious Rubber Duck Squeak / Quack
          const osc1 = this.ctx.createOscillator();
          const osc2 = this.ctx.createOscillator();
          const gain = this.ctx.createGain();

          osc1.type = 'sawtooth';
          osc2.type = 'triangle';

          osc1.frequency.setValueAtTime(950, now);
          osc1.frequency.linearRampToValueAtTime(450, now + 0.09);
          osc1.frequency.linearRampToValueAtTime(800, now + 0.15);

          osc2.frequency.setValueAtTime(475, now);
          osc2.frequency.linearRampToValueAtTime(225, now + 0.09);
          osc2.frequency.linearRampToValueAtTime(400, now + 0.15);

          const filter = this.ctx.createBiquadFilter();
          filter.type = 'bandpass';
          filter.frequency.setValueAtTime(1100, now);
          filter.Q.setValueAtTime(3.5, now);

          gain.gain.setValueAtTime(0.22 * volumeScale, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

          osc1.connect(filter);
          osc2.connect(filter);
          filter.connect(gain);
          gain.connect(this.ctx.destination);

          osc1.start(now);
          osc2.start(now);
          osc1.stop(now + 0.22);
          osc2.stop(now + 0.22);
          return { name: 'Rubber Duck Quack!', emoji: '🦆' };
        }

        case 'bubble_pop': {
          // Satisfying Cartoon Water Drop / Bubble Pop
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();

          osc.type = 'sine';
          osc.frequency.setValueAtTime(350, now);
          osc.frequency.exponentialRampToValueAtTime(1600, now + 0.07);

          gain.gain.setValueAtTime(0.3 * volumeScale, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

          osc.connect(gain);
          gain.connect(this.ctx.destination);

          osc.start(now);
          osc.stop(now + 0.12);
          return { name: 'Bubble Pop!', emoji: '🫧' };
        }

        case 'laser_pew': {
          // Retro 8-bit Arcade Sci-Fi Laser Pew
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();

          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(1800, now);
          osc.frequency.exponentialRampToValueAtTime(120, now + 0.14);

          gain.gain.setValueAtTime(0.2 * volumeScale, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);

          osc.connect(gain);
          gain.connect(this.ctx.destination);

          osc.start(now);
          osc.stop(now + 0.18);
          return { name: 'Pew Pew Laser!', emoji: '🔫' };
        }

        case 'slide_whistle': {
          // Comical Slide Whistle Glissando
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();

          osc.type = 'sine';
          osc.frequency.setValueAtTime(1200, now);
          osc.frequency.exponentialRampToValueAtTime(350, now + 0.2);

          gain.gain.setValueAtTime(0.22 * volumeScale, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

          osc.connect(gain);
          gain.connect(this.ctx.destination);

          osc.start(now);
          osc.stop(now + 0.26);
          return { name: 'Slide Whistle!', emoji: '🪈' };
        }

        case 'arcade_coin': {
          // Super Mario / Retro Coin 2-Tone Chirp (B5 -> E6)
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();

          osc.type = 'sine';
          osc.frequency.setValueAtTime(987.77, now); // B5
          osc.frequency.setValueAtTime(1318.51, now + 0.07); // E6

          gain.gain.setValueAtTime(0.22 * volumeScale, now);
          gain.gain.setValueAtTime(0.22 * volumeScale, now + 0.07);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

          osc.connect(gain);
          gain.connect(this.ctx.destination);

          osc.start(now);
          osc.stop(now + 0.32);
          return { name: 'Arcade Coin!', emoji: '🪙' };
        }

        case 'wobble_spring': {
          // Funny Springy Vibrato Wobble
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();

          osc.type = 'triangle';
          osc.frequency.setValueAtTime(440, now);
          osc.frequency.linearRampToValueAtTime(220, now + 0.05);
          osc.frequency.linearRampToValueAtTime(550, now + 0.1);
          osc.frequency.linearRampToValueAtTime(180, now + 0.18);

          gain.gain.setValueAtTime(0.25 * volumeScale, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

          osc.connect(gain);
          gain.connect(this.ctx.destination);

          osc.start(now);
          osc.stop(now + 0.24);
          return { name: 'Springy Boing!', emoji: '⚡' };
        }

        default: {
          // Mega Juicy Ultra-Thock with Rich Woody Resonance
          const osc = this.ctx.createOscillator();
          const osc2 = this.ctx.createOscillator();
          const gain = this.ctx.createGain();

          osc.type = 'triangle';
          osc.frequency.setValueAtTime(420, now);
          osc.frequency.exponentialRampToValueAtTime(45, now + 0.06);

          osc2.type = 'sine';
          osc2.frequency.setValueAtTime(180, now);
          osc2.frequency.exponentialRampToValueAtTime(30, now + 0.08);

          gain.gain.setValueAtTime(0.32 * volumeScale, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

          osc.connect(gain);
          osc2.connect(gain);
          gain.connect(this.ctx.destination);

          osc.start(now);
          osc2.start(now);
          osc.stop(now + 0.1);
          osc2.stop(now + 0.1);
          return { name: 'Mega Thock!', emoji: '💥' };
        }
      }
    } catch {
      return { name: 'Thock', emoji: '⌨️' };
    }
  }

  // Hilarious Developer Dialogues & Voice Lines
  public static readonly CODER_DIALOGUES = [
    {
      id: 'ai_use_karo',
      speaker: 'टेक फाउंडर 🤖',
      tagline: 'प्रोजेक्ट में AI लगाओ!',
      hindiText: 'भाई प्रोजेक्ट में AI का यूज़ करो! सब कुछ AI से बनाओ!',
      spokenText: 'Bhai project mein AI ka use karo na! Thoda AI aur deep learning ghusa do, sab automatic ho jayega!',
      emoji: '🧠',
      badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
      sfx: 'laser',
      pitch: 1.15
    },
    {
      id: 'ye_kya_bawasir',
      speaker: 'सीनियर रिव्यूअर 🤦‍♂️',
      tagline: 'ये क्या बवासीर बना दिए!',
      hindiText: 'अरे भाई ये क्या बवासीर बना दिए हो!',
      spokenText: 'Arre bhai ye kya bawasir bana diye ho! Pura code phat gaya!',
      emoji: '🤦‍♂️',
      badgeColor: 'bg-red-500/20 text-red-300 border-red-500/40',
      sfx: 'facepalm',
      pitch: 0.95
    },
    {
      id: 'ye_kya_bawal_chiz',
      speaker: 'हैकर ब्रो 😎',
      tagline: 'ये क्या बवाल चीज़ बना दिए!',
      hindiText: 'अरे भाई ये क्या बवाल चीज़ बना दिए! एकदम सॉलिड!',
      spokenText: 'Arre bhai ye kya bawal cheez bana diye ho! Ekdum solid, maza aa gaya!',
      emoji: '🔥',
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
      sfx: 'cheer',
      pitch: 1.2
    },
    {
      id: 'matha_pagla_diye',
      speaker: 'फ्रस्ट्रेटेड कोडर 🤯',
      tagline: 'माथा पगला दिए भाई!',
      hindiText: 'अरे भाई ये क्या बना दिए, पूरा माथा पगला दिए भाई!',
      spokenText: 'Arre bhai ye kya bana diye ho, pura matha pagla diye bhai! Kahi se kuch nahi chal raha!',
      emoji: '🤯',
      badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
      sfx: 'dramatic',
      pitch: 1.25
    },
    {
      id: 'project_kab_tak',
      speaker: 'प्रोजेक्ट मैनेजर 👔',
      tagline: 'प्रोजेक्ट कब तक होगा?!',
      hindiText: 'भाई प्रोजेक्ट कब तक होगा? क्लाइंट का कॉल आ रहा है!',
      spokenText: 'Bhai project kab tak hoga? Client ka phone aa raha hai, deadline kal subah hai bhai!',
      emoji: '⏰',
      badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
      sfx: 'alarm',
      pitch: 1.2
    },
    {
      id: 'localhost_chal_raha',
      speaker: 'फुल-स्टैक डेवलपर 💻',
      tagline: 'लोकलहोस्ट पे तो चल रहा था',
      hindiText: 'मेरे लोकलहोस्ट पे तो सब मस्त चल रहा था भाई!',
      spokenText: 'Bhai mere localhost par to ekdum smooth chal raha tha, production pe pata nahi kya ho gaya!',
      emoji: '⚡',
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
      sfx: 'pop',
      pitch: 1.05
    },
    {
      id: 'bug_nahi_feature',
      speaker: 'सीनियर आर्किटेक्ट 🧙‍♂️',
      tagline: 'यह बग नहीं, फ़ीचर है!',
      hindiText: 'यह बग नहीं है भाई, यह तो अनडॉक्यूमेंटेड फ़ीचर है!',
      spokenText: 'Yeh koi bug nahi hai bhai, yeh to hamara undocumented advanced feature hai!',
      emoji: '🐛',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
      sfx: 'spring',
      pitch: 1.0
    },
    {
      id: 'direct_production',
      speaker: 'जूनियर डेवलपर 🚀',
      tagline: 'डायरेक्ट प्रोडक्शन पुश कर दिया',
      hindiText: 'डायरेक्ट प्रोडक्शन पे पुश कर दिया... अब भगवान भरोसे!',
      spokenText: 'Direct production branch pe push kar diya bhai! Ab bhagwan hi bachaye!',
      emoji: '💥',
      badgeColor: 'bg-red-500/20 text-red-300 border-red-500/40',
      sfx: 'boom',
      pitch: 1.1
    },
    {
      id: 'merge_conflict',
      speaker: 'गिट मास्टर 💥',
      tagline: 'मर्ज कॉन्फ्लिक्ट आ गया भाई!',
      hindiText: 'भाई मर्ज कॉन्फ्लिक्ट आ गया! किसने मेन ब्रांच छेड़ी?!',
      spokenText: 'Arre bhai merge conflict aa gaya! Main branch pe kisne force push kiya bhai?!',
      emoji: '⚠️',
      badgeColor: 'bg-orange-500/20 text-orange-300 border-orange-500/40',
      sfx: 'error',
      pitch: 1.15
    },
    {
      id: 'two_minute_fix',
      speaker: 'निंजा कोडर ⏱️',
      tagline: 'बस 2 मिनट में फ़िक्स होगा',
      hindiText: 'बस 2 मिनट में फ़िक्स कर रहा हूँ भाई... पक्का!',
      spokenText: 'Bas do minute mein fix kar dunga bhai, bas ek semicolon miss ho gaya tha!',
      emoji: '⏳',
      badgeColor: 'bg-teal-500/20 text-teal-300 border-teal-500/40',
      sfx: 'coin',
      pitch: 1.05
    },
    {
      id: 'friday_deploy',
      speaker: 'डेवऑप्स लीड 🛑',
      tagline: 'फ्राइडे को डिप्लॉय मत करना!',
      hindiText: 'फ्राइडे शाम को डिप्लॉय मत करना भाई, वीकेंड उड़ जाएगा!',
      spokenText: 'Friday evening ko galti se bhi deploy mat karna bhai, pura weekend barbaad ho jayega!',
      emoji: '🛡️',
      badgeColor: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40',
      sfx: 'whistle',
      pitch: 1.0
    },
    {
      id: 'coffee_chai',
      speaker: 'नाइट आउल कोडर ☕',
      tagline: 'चाय लाओ, कोड पुश करो!',
      hindiText: 'कड़क चाय-कॉफ़ी लाओ भाई, आज रात कोड पूरा पुश होगा!',
      spokenText: 'Ek cup kadak chai coffee lao bhai, aaj raat ko deployment khatam karke hi soyenge!',
      emoji: '☕',
      badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40',
      sfx: 'boing',
      pitch: 1.05
    }
  ];

  // Play Developer Voice Line with Audio Effect
  public playCoderDialogue(dialogueIndex?: number): typeof AudioSynthesizer.CODER_DIALOGUES[0] {
    const list = AudioSynthesizer.CODER_DIALOGUES;
    const selected = dialogueIndex !== undefined && dialogueIndex >= 0 && dialogueIndex < list.length
      ? list[dialogueIndex]
      : list[Math.floor(Math.random() * list.length)];

    // 1. Play accompanied Web Audio SFX
    try {
      this.initContext();
      if (this.ctx) {
        const now = this.ctx.currentTime;
        switch (selected.sfx) {
          case 'alarm': {
            // Urgent Beep Beep
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(880, now);
            osc.frequency.setValueAtTime(440, now + 0.08);
            osc.frequency.setValueAtTime(880, now + 0.16);
            gain.gain.setValueAtTime(0.25, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(now);
            osc.stop(now + 0.3);
            break;
          }
          case 'laser': {
            // AI Futuristic Laser / Synth Zap
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(1600, now);
            osc.frequency.exponentialRampToValueAtTime(180, now + 0.22);
            gain.gain.setValueAtTime(0.28, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.24);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(now);
            osc.stop(now + 0.25);
            break;
          }
          case 'facepalm': {
            // Comical Wah Wah Wah Downward Horn
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(400, now);
            osc.frequency.linearRampToValueAtTime(320, now + 0.1);
            osc.frequency.linearRampToValueAtTime(250, now + 0.2);
            osc.frequency.linearRampToValueAtTime(160, now + 0.35);
            gain.gain.setValueAtTime(0.3, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(now);
            osc.stop(now + 0.42);
            break;
          }
          case 'cheer': {
            // Triumphant Fanfare Arpeggio (C-E-G-C)
            const freqs = [523.25, 659.25, 783.99, 1046.5];
            freqs.forEach((f, i) => {
              if (!this.ctx) return;
              const osc = this.ctx.createOscillator();
              const gain = this.ctx.createGain();
              osc.type = 'triangle';
              osc.frequency.setValueAtTime(f, now + i * 0.06);
              gain.gain.setValueAtTime(0.2, now + i * 0.06);
              gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.06 + 0.25);
              osc.connect(gain);
              gain.connect(this.ctx.destination);
              osc.start(now + i * 0.06);
              osc.stop(now + i * 0.06 + 0.26);
            });
            break;
          }
          case 'dramatic': {
            // Dramatic Dun Dun Dun Shock Chord
            const chords = [130.81, 155.56, 196.0]; // C minor
            chords.forEach(f => {
              if (!this.ctx) return;
              const osc = this.ctx.createOscillator();
              const gain = this.ctx.createGain();
              osc.type = 'sawtooth';
              osc.frequency.setValueAtTime(f, now);
              gain.gain.setValueAtTime(0.22, now);
              gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
              osc.connect(gain);
              gain.connect(this.ctx.destination);
              osc.start(now);
              osc.stop(now + 0.48);
            });
            break;
          }
          case 'boom': {
            // Low Deep Sub Blast
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(260, now);
            osc.frequency.exponentialRampToValueAtTime(35, now + 0.28);
            gain.gain.setValueAtTime(0.38, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(now);
            osc.stop(now + 0.36);
            break;
          }
          default: {
            // Crisp Mechanical Pop / Thock
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(520, now);
            osc.frequency.exponentialRampToValueAtTime(80, now + 0.12);
            gain.gain.setValueAtTime(0.3, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(now);
            osc.stop(now + 0.16);
            break;
          }
        }
      }
    } catch {
      // Audio error catch
    }

    // 2. Play Text-To-Speech using native SpeechSynthesis
    try {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel(); // Stop any previous speech
        const utterance = new SpeechSynthesisUtterance(selected.spokenText);
        utterance.rate = 1.05;
        utterance.pitch = selected.pitch || 1.1;
        utterance.volume = 1.0;

        // Try to pick an expressive Hindi / Indian English / English voice if available
        const voices = window.speechSynthesis.getVoices();
        const hindiVoice = voices.find(v => v.lang.includes('hi') || v.lang.includes('IN') || v.name.toLowerCase().includes('india') || v.name.toLowerCase().includes('hindi'));
        if (hindiVoice) {
          utterance.voice = hindiVoice;
        }

        window.speechSynthesis.speak(utterance);
      }
    } catch {
      // Fallback cleanly
    }

    return selected;
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

