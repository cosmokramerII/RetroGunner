// 80s Retro Music Generator using Web Audio API
export class RetroMusicGenerator {
  private audioContext: AudioContext;
  private masterGain: GainNode;
  private isPlaying: boolean = false;
  private tempo: number = 150; // Faster BPM for more energy!
  private nextNoteTime: number = 0;
  private currentBeat: number = 0;
  private scheduleAheadTime: number = 0.1;
  private intervalId: number | null = null;
  private currentSection: number = 0;

  // More upbeat and catchy patterns
  private bassPattern = [
    { note: 130.81, duration: 0.2 }, // C3
    { note: 130.81, duration: 0.1 },
    { note: 164.81, duration: 0.2 }, // E3
    { note: 196.00, duration: 0.2 }, // G3
    { note: 130.81, duration: 0.2 }, // C3
    { note: 164.81, duration: 0.1 }, // E3
    { note: 196.00, duration: 0.2 }, // G3
    { note: 130.81, duration: 0.2 }, // C3
  ];

  // Catchy main melody inspired by classic arcade games
  private leadMelody = [
    // Main hook - very memorable and upbeat
    { note: 659.25, duration: 0.25 }, // E5
    { note: 783.99, duration: 0.25 }, // G5
    { note: 659.25, duration: 0.15 }, // E5
    { note: 523.25, duration: 0.15 }, // C5
    { note: 587.33, duration: 0.25 }, // D5
    { note: 0, duration: 0.1 }, // rest
    { note: 493.88, duration: 0.15 }, // B4
    { note: 523.25, duration: 0.25 }, // C5
    { note: 659.25, duration: 0.35 }, // E5
    { note: 0, duration: 0.15 }, // rest
    { note: 587.33, duration: 0.25 }, // D5
    { note: 523.25, duration: 0.25 }, // C5
    { note: 493.88, duration: 0.25 }, // B4
    { note: 440.00, duration: 0.35 }, // A4
  ];

  // Secondary melody for variation
  private altMelody = [
    { note: 783.99, duration: 0.2 }, // G5
    { note: 880.00, duration: 0.2 }, // A5
    { note: 783.99, duration: 0.15 }, // G5
    { note: 659.25, duration: 0.25 }, // E5
    { note: 587.33, duration: 0.2 }, // D5
    { note: 659.25, duration: 0.3 }, // E5
    { note: 523.25, duration: 0.25 }, // C5
    { note: 440.00, duration: 0.25 }, // A4
  ];

  private arpPattern = [
    { note: 523.25, duration: 0.05 }, // C5 - faster arps
    { note: 659.25, duration: 0.05 }, // E5
    { note: 783.99, duration: 0.05 }, // G5
    { note: 659.25, duration: 0.05 }, // E5
  ];

  constructor() {
    this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    this.masterGain = this.audioContext.createGain();
    this.masterGain.gain.value = 0.25; // Lower volume to be less annoying
    this.masterGain.connect(this.audioContext.destination);
  }

  private createOscillator(frequency: number, type: OscillatorType = 'sawtooth'): OscillatorNode {
    const oscillator = this.audioContext.createOscillator();
    oscillator.type = type;
    oscillator.frequency.value = frequency;
    return oscillator;
  }

  private createEnvelope(param: AudioParam, attack: number, decay: number, sustain: number, release: number, startTime: number, duration: number) {
    const now = startTime;
    param.cancelScheduledValues(now);
    param.setValueAtTime(0, now);
    param.linearRampToValueAtTime(1, now + attack);
    param.linearRampToValueAtTime(sustain, now + attack + decay);
    param.setValueAtTime(sustain, now + duration - release);
    param.linearRampToValueAtTime(0, now + duration);
  }

  private playBass(time: number) {
    const noteIndex = (this.currentBeat * 2) % this.bassPattern.length;
    const note = this.bassPattern[noteIndex];
    
    if (note.note === 0) return; // Rest
    if (this.currentBeat % 2 !== 0) return; // Only play on main beats

    // Smoother bass sound - less harsh
    const oscillator = this.createOscillator(note.note, 'sine');
    const oscillator2 = this.createOscillator(note.note * 2, 'triangle');
    const gain = this.audioContext.createGain();
    const gain2 = this.audioContext.createGain();
    const filter = this.audioContext.createBiquadFilter();
    
    filter.type = 'lowpass';
    filter.frequency.value = 400; // Less bright
    filter.Q.value = 2;
    
    oscillator.connect(gain);
    oscillator2.connect(gain2);
    gain.connect(filter);
    gain2.connect(filter);
    filter.connect(this.masterGain);
    
    gain.gain.value = 0.4;
    gain2.gain.value = 0.1;
    this.createEnvelope(gain.gain, 0.005, 0.02, 0.3, 0.05, time, note.duration);
    
    oscillator.start(time);
    oscillator2.start(time);
    oscillator.stop(time + note.duration);
    oscillator2.stop(time + note.duration);
  }

  private playLead(time: number) {
    // Switch between main and alt melody for variety
    const useAltMelody = Math.floor(this.currentBeat / 64) % 2 === 1;
    const melody = useAltMelody ? this.altMelody : this.leadMelody;
    const noteIndex = Math.floor(this.currentBeat / 2) % melody.length;
    const note = melody[noteIndex];
    
    if (note.note === 0) return; // Rest
    if (this.currentBeat % 2 !== 0) return; // Play every other beat

    // Softer lead sound with pulse wave
    const oscillator = this.createOscillator(note.note, 'triangle');
    const oscillator2 = this.createOscillator(note.note * 0.5, 'sine'); // Sub octave
    const gain = this.audioContext.createGain();
    const gain2 = this.audioContext.createGain();
    const filter = this.audioContext.createBiquadFilter();
    
    filter.type = 'lowpass';
    filter.frequency.value = 2000;
    filter.Q.value = 1;
    
    oscillator.connect(filter);
    oscillator2.connect(gain2);
    filter.connect(gain);
    gain.connect(this.masterGain);
    gain2.connect(this.masterGain);
    
    gain.gain.value = 0.2; // Quieter lead
    gain2.gain.value = 0.05; // Subtle sub bass
    this.createEnvelope(gain.gain, 0.01, 0.05, 0.3, 0.1, time, note.duration);
    
    oscillator.start(time);
    oscillator2.start(time);
    oscillator.stop(time + note.duration);
    oscillator2.stop(time + note.duration);
  }

  private playArpeggio(time: number) {
    // Only play arps sometimes for less clutter
    if (this.currentBeat % 4 !== 0) return;
    
    const noteIndex = this.currentBeat % this.arpPattern.length;
    const note = this.arpPattern[noteIndex];
    
    // Softer, less annoying arpeggios
    const oscillator = this.createOscillator(note.note, 'sine');
    const gain = this.audioContext.createGain();
    
    oscillator.connect(gain);
    gain.connect(this.masterGain);
    
    gain.gain.value = 0.08; // Much quieter
    this.createEnvelope(gain.gain, 0.001, 0.01, 0.05, 0.02, time, note.duration);
    
    oscillator.start(time);
    oscillator.stop(time + note.duration);
  }

  private playDrums(time: number) {
    const beat = this.currentBeat % 16;
    
    // More varied drum pattern for upbeat feel
    // Kick drum pattern
    if (beat === 0 || beat === 4 || beat === 8 || beat === 11 || beat === 12) {
      this.playKick(time);
    }
    
    // Snare on 4 and 12 for backbeat
    if (beat === 4 || beat === 12) {
      this.playSnare(time);
    }
    
    // Hi-hat pattern - more lively
    if (beat % 2 === 0 || beat === 3 || beat === 7 || beat === 11 || beat === 15) {
      this.playHiHat(time, beat % 4 === 0);
    }
  }

  private playKick(time: number) {
    // Punchier kick drum
    const oscillator = this.createOscillator(50, 'sine');
    const gain = this.audioContext.createGain();
    
    oscillator.frequency.setValueAtTime(120, time);
    oscillator.frequency.exponentialRampToValueAtTime(50, time + 0.02);
    
    oscillator.connect(gain);
    gain.connect(this.masterGain);
    
    gain.gain.setValueAtTime(0.6, time); // Softer kick
    gain.gain.exponentialRampToValueAtTime(0.01, time + 0.15);
    
    oscillator.start(time);
    oscillator.stop(time + 0.15);
  }

  private playSnare(time: number) {
    // Lighter, crisper snare
    const noise = this.audioContext.createBufferSource();
    const noiseBuffer = this.audioContext.createBuffer(1, 2048, this.audioContext.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    
    for (let i = 0; i < 2048; i++) {
      output[i] = Math.random() * 2 - 1;
    }
    
    noise.buffer = noiseBuffer;
    
    const gain = this.audioContext.createGain();
    const filter = this.audioContext.createBiquadFilter();
    
    filter.type = 'highpass';
    filter.frequency.value = 2000; // Lower frequency for softer sound
    
    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);
    
    gain.gain.setValueAtTime(0.25, time); // Much softer
    gain.gain.exponentialRampToValueAtTime(0.01, time + 0.08);
    
    noise.start(time);
    
    // Subtle tonal component
    const oscillator = this.createOscillator(250, 'sine');
    const oscGain = this.audioContext.createGain();
    
    oscillator.connect(oscGain);
    oscGain.connect(this.masterGain);
    
    oscGain.gain.setValueAtTime(0.15, time);
    oscGain.gain.exponentialRampToValueAtTime(0.01, time + 0.03);
    
    oscillator.start(time);
    oscillator.stop(time + 0.03);
  }

  private playHiHat(time: number, isOpen: boolean) {
    // Much softer hi-hat
    const noise = this.audioContext.createBufferSource();
    const noiseBuffer = this.audioContext.createBuffer(1, 1024, this.audioContext.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    
    for (let i = 0; i < 1024; i++) {
      output[i] = Math.random() * 2 - 1;
    }
    
    noise.buffer = noiseBuffer;
    
    const gain = this.audioContext.createGain();
    const filter = this.audioContext.createBiquadFilter();
    
    filter.type = 'highpass';
    filter.frequency.value = isOpen ? 4000 : 6000; // Lower frequencies
    
    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);
    
    gain.gain.setValueAtTime(isOpen ? 0.06 : 0.04, time); // Much quieter
    gain.gain.exponentialRampToValueAtTime(0.01, time + (isOpen ? 0.08 : 0.03));
    
    noise.start(time);
  }

  private scheduler() {
    const currentTime = this.audioContext.currentTime;
    
    while (this.nextNoteTime < currentTime + this.scheduleAheadTime) {
      this.playBass(this.nextNoteTime);
      this.playLead(this.nextNoteTime);
      this.playArpeggio(this.nextNoteTime);
      this.playDrums(this.nextNoteTime);
      
      // Move to next beat
      this.nextNoteTime += 60.0 / this.tempo / 4; // 16th notes
      this.currentBeat++;
    }
  }

  start() {
    if (this.isPlaying) return;
    
    this.isPlaying = true;
    this.currentBeat = 0;
    this.nextNoteTime = this.audioContext.currentTime;
    
    this.intervalId = window.setInterval(() => this.scheduler(), 25);
  }

  stop() {
    if (!this.isPlaying) return;
    
    this.isPlaying = false;
    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  setVolume(volume: number) {
    this.masterGain.gain.value = Math.max(0, Math.min(1, volume));
  }

  setTempo(bpm: number) {
    this.tempo = Math.max(60, Math.min(200, bpm));
  }
}

// Create singleton instance
export const retroMusic = new RetroMusicGenerator();