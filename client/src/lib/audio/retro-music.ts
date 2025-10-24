// 80s Retro Music Generator using Web Audio API
export class RetroMusicGenerator {
  private audioContext: AudioContext;
  private masterGain: GainNode;
  private isPlaying: boolean = false;
  private tempo: number = 128; // BPM
  private nextNoteTime: number = 0;
  private currentBeat: number = 0;
  private scheduleAheadTime: number = 0.1;
  private intervalId: number | null = null;

  // Synth patterns for that classic 80s sound
  private bassPattern = [
    { note: 65.41, duration: 0.25 }, // C2
    { note: 65.41, duration: 0.25 },
    { note: 82.41, duration: 0.25 }, // E2
    { note: 65.41, duration: 0.25 },
    { note: 87.31, duration: 0.25 }, // F2
    { note: 87.31, duration: 0.25 },
    { note: 65.41, duration: 0.25 },
    { note: 82.41, duration: 0.25 },
  ];

  private leadMelody = [
    { note: 523.25, duration: 0.5 }, // C5
    { note: 0, duration: 0.25 }, // rest
    { note: 523.25, duration: 0.125 },
    { note: 587.33, duration: 0.125 }, // D5
    { note: 659.25, duration: 0.5 }, // E5
    { note: 523.25, duration: 0.25 },
    { note: 440.00, duration: 0.25 }, // A4
    { note: 493.88, duration: 0.5 }, // B4
    { note: 523.25, duration: 0.5 }, // C5
  ];

  private arpPattern = [
    { note: 261.63, duration: 0.0625 }, // C4
    { note: 329.63, duration: 0.0625 }, // E4
    { note: 392.00, duration: 0.0625 }, // G4
    { note: 523.25, duration: 0.0625 }, // C5
  ];

  constructor() {
    this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    this.masterGain = this.audioContext.createGain();
    this.masterGain.gain.value = 0.4;
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
    const noteIndex = this.currentBeat % this.bassPattern.length;
    const note = this.bassPattern[noteIndex];
    
    if (note.note === 0) return; // Rest

    // Classic 80s bass sound - sawtooth with filter
    const oscillator = this.createOscillator(note.note, 'sawtooth');
    const gain = this.audioContext.createGain();
    const filter = this.audioContext.createBiquadFilter();
    
    filter.type = 'lowpass';
    filter.frequency.value = 800;
    filter.Q.value = 5;
    
    // Add filter envelope for that classic synth bass sweep
    filter.frequency.setValueAtTime(100, time);
    filter.frequency.exponentialRampToValueAtTime(800, time + 0.01);
    filter.frequency.exponentialRampToValueAtTime(200, time + note.duration);
    
    oscillator.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);
    
    gain.gain.value = 0.6;
    this.createEnvelope(gain.gain, 0.01, 0.05, 0.4, 0.1, time, note.duration);
    
    oscillator.start(time);
    oscillator.stop(time + note.duration);
  }

  private playLead(time: number) {
    const noteIndex = Math.floor(this.currentBeat / 2) % this.leadMelody.length;
    const note = this.leadMelody[noteIndex];
    
    if (note.note === 0) return; // Rest
    if (this.currentBeat % 2 !== 0) return; // Play every other beat

    // 80s lead synth - square wave with vibrato
    const oscillator = this.createOscillator(note.note, 'square');
    const gain = this.audioContext.createGain();
    const vibrato = this.audioContext.createOscillator();
    const vibratoGain = this.audioContext.createGain();
    
    // Add vibrato for that classic 80s lead sound
    vibrato.frequency.value = 5;
    vibratoGain.gain.value = 3;
    vibrato.connect(vibratoGain);
    vibratoGain.connect(oscillator.frequency);
    
    oscillator.connect(gain);
    gain.connect(this.masterGain);
    
    gain.gain.value = 0.3;
    this.createEnvelope(gain.gain, 0.02, 0.1, 0.5, 0.2, time, note.duration);
    
    oscillator.start(time);
    vibrato.start(time);
    oscillator.stop(time + note.duration);
    vibrato.stop(time + note.duration);
  }

  private playArpeggio(time: number) {
    const noteIndex = this.currentBeat % this.arpPattern.length;
    const note = this.arpPattern[noteIndex];
    
    // Fast arpeggios - classic 80s sound
    const oscillator = this.createOscillator(note.note * 2, 'triangle');
    const gain = this.audioContext.createGain();
    const delay = this.audioContext.createDelay();
    const feedback = this.audioContext.createGain();
    
    // Add delay for spacey 80s effect
    delay.delayTime.value = 0.15;
    feedback.gain.value = 0.3;
    
    oscillator.connect(gain);
    gain.connect(delay);
    delay.connect(feedback);
    feedback.connect(delay);
    delay.connect(this.masterGain);
    gain.connect(this.masterGain);
    
    gain.gain.value = 0.15;
    this.createEnvelope(gain.gain, 0.001, 0.01, 0.1, 0.05, time, note.duration);
    
    oscillator.start(time);
    oscillator.stop(time + note.duration);
  }

  private playDrums(time: number) {
    const beat = this.currentBeat % 8;
    
    // Kick drum on 1 and 5
    if (beat === 0 || beat === 4) {
      this.playKick(time);
    }
    
    // Snare on 2 and 6
    if (beat === 2 || beat === 6) {
      this.playSnare(time);
    }
    
    // Hi-hat on every beat
    this.playHiHat(time, beat % 2 === 0);
  }

  private playKick(time: number) {
    // Synthesized kick drum
    const oscillator = this.createOscillator(60, 'sine');
    const gain = this.audioContext.createGain();
    
    oscillator.frequency.setValueAtTime(150, time);
    oscillator.frequency.exponentialRampToValueAtTime(60, time + 0.01);
    
    oscillator.connect(gain);
    gain.connect(this.masterGain);
    
    gain.gain.setValueAtTime(1, time);
    gain.gain.exponentialRampToValueAtTime(0.01, time + 0.2);
    
    oscillator.start(time);
    oscillator.stop(time + 0.2);
  }

  private playSnare(time: number) {
    // Synthesized snare with noise
    const noise = this.audioContext.createBufferSource();
    const noiseBuffer = this.audioContext.createBuffer(1, 4096, this.audioContext.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    
    for (let i = 0; i < 4096; i++) {
      output[i] = Math.random() * 2 - 1;
    }
    
    noise.buffer = noiseBuffer;
    
    const gain = this.audioContext.createGain();
    const filter = this.audioContext.createBiquadFilter();
    
    filter.type = 'highpass';
    filter.frequency.value = 3000;
    
    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);
    
    gain.gain.setValueAtTime(0.5, time);
    gain.gain.exponentialRampToValueAtTime(0.01, time + 0.1);
    
    noise.start(time);
    
    // Add tonal component
    const oscillator = this.createOscillator(200, 'triangle');
    const oscGain = this.audioContext.createGain();
    
    oscillator.connect(oscGain);
    oscGain.connect(this.masterGain);
    
    oscGain.gain.setValueAtTime(0.3, time);
    oscGain.gain.exponentialRampToValueAtTime(0.01, time + 0.05);
    
    oscillator.start(time);
    oscillator.stop(time + 0.05);
  }

  private playHiHat(time: number, isOpen: boolean) {
    // Synthesized hi-hat
    const noise = this.audioContext.createBufferSource();
    const noiseBuffer = this.audioContext.createBuffer(1, 4096, this.audioContext.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    
    for (let i = 0; i < 4096; i++) {
      output[i] = Math.random() * 2 - 1;
    }
    
    noise.buffer = noiseBuffer;
    
    const gain = this.audioContext.createGain();
    const filter = this.audioContext.createBiquadFilter();
    
    filter.type = 'highpass';
    filter.frequency.value = isOpen ? 5000 : 8000;
    
    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);
    
    gain.gain.setValueAtTime(isOpen ? 0.15 : 0.1, time);
    gain.gain.exponentialRampToValueAtTime(0.01, time + (isOpen ? 0.1 : 0.05));
    
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