/**
 * Web Audio API synthesizer for Tarot interactive soundscapes.
 * Generates mystical, subtle, non-repetitive audio purely via Web Audio synthesis
 * without relying on external MP3 assets.
 */

class TarotAudioController {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;

  constructor() {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('kaalika_tarot_muted');
      this.isMuted = saved === 'true';
    }
  }

  private initContext() {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (typeof window !== 'undefined') {
      localStorage.setItem('kaalika_tarot_muted', String(muted));
    }
  }

  public toggleMute(): boolean {
    this.setMuted(!this.isMuted);
    return this.isMuted;
  }

  /**
   * Shuffle sound: Rapid series of gentle papery ticks & flutter bandpass pulses.
   */
  public playShuffle() {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const duration = 2.4;
    const count = 38;

    for (let i = 0; i < count; i++) {
      const timeOffset = (i / count) * duration + (Math.random() - 0.5) * 0.04;
      const t = now + Math.max(0, timeOffset);

      // Noise burst for card slide
      const bufferSize = ctx.sampleRate * 0.035;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let j = 0; j < bufferSize; j++) {
        data[j] = (Math.random() * 2 - 1) * Math.exp(-j / (bufferSize * 0.35));
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1400 + Math.random() * 800, t);
      filter.Q.setValueAtTime(3.5, t);

      const gain = ctx.createGain();
      const peakVol = 0.045 + Math.random() * 0.035;
      gain.gain.setValueAtTime(0.001, t);
      gain.gain.exponentialRampToValueAtTime(peakVol, t + 0.005);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.035);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      noise.start(t);
      noise.stop(t + 0.04);
    }
  }

  /**
   * Cut sound: Two crisp, distinct sliding deck sweeps followed by a gentle pack snap.
   */
  public playCut() {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    // Slide 1
    this.playPaperSlide(ctx, now, 0.16, 1200);
    // Slide 2 (cross over)
    this.playPaperSlide(ctx, now + 0.28, 0.18, 1600);
    // Recombine tap
    this.playCardTap(ctx, now + 0.52, 220);
  }

  /**
   * Card Select / Hover: Subtle crystalline harmonic chime.
   */
  public playSelect() {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, now); // A5
    osc.frequency.exponentialRampToValueAtTime(1174.66, now + 0.14); // D6

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.04, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.22);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.25);
  }

  /**
   * Card Flip sound: Smooth aerodynamic whoosh as card rotates in 3D.
   */
  public playFlip() {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    this.playPaperSlide(ctx, now, 0.28, 950);
  }

  /**
   * Card Reveal sound: Rich celestial gong / resonant singing chord (Solfeggio frequencies).
   */
  public playReveal() {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const freqs = [528, 792, 1056]; // Harmonics of 528 Hz (Sacred Transformation)

    freqs.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = idx === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, now);

      const amp = 0.045 / (idx + 1);
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(amp, now + 0.06);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2 + idx * 0.3);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 1.6);
    });

    // Subtle golden sparkle transient
    this.playSparkle(ctx, now + 0.08);
  }

  private playPaperSlide(ctx: AudioContext, time: number, duration: number, freq: number) {
    const bufferSize = ctx.sampleRate * duration;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.sin((i / bufferSize) * Math.PI);
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(freq, time);
    filter.Q.setValueAtTime(2.8, time);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.001, time);
    gain.gain.linearRampToValueAtTime(0.05, time + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.001, time + duration);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    noise.start(time);
    noise.stop(time + duration);
  }

  private playCardTap(ctx: AudioContext, time: number, freq: number) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, time);
    osc.frequency.exponentialRampToValueAtTime(70, time + 0.08);

    gain.gain.setValueAtTime(0.07, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.08);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(time);
    osc.stop(time + 0.09);
  }

  private playSparkle(ctx: AudioContext, time: number) {
    for (let k = 0; k < 4; k++) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const t = time + k * 0.04;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(2200 + k * 440, t);

      gain.gain.setValueAtTime(0.015, t);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.12);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(t);
      osc.stop(t + 0.13);
    }
  }
}

export const tarotAudio = new TarotAudioController();
