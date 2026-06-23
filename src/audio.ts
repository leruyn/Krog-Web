let audioCtx: AudioContext | null = null;

function initAudio() {
  if (typeof window === 'undefined') return;
  if (!audioCtx) {
    const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioCtxClass) {
      audioCtx = new AudioCtxClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
}

// Chơi tiếng mài than củi vẽ nguệch ngoạc
export function playScratchSound() {
  try {
    initAudio();
    if (!audioCtx) return;

    const ctx = audioCtx;
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    // White noise pattern or noisy sine
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(100 + Math.random() * 400, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(10 + Math.random() * 50, ctx.currentTime + 0.08);

    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(2000, ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.08);

    gainNode.gain.setValueAtTime(0.04, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);

    osc.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.08);
  } catch (e) {
    // Silent fail
  }
}

// Chơi tiếng gỗ/khắc tảng đá mộc mạc
export function playChiselSound() {
  try {
    initAudio();
    if (!audioCtx) return;

    const ctx = audioCtx;
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(600, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.12);

    gainNode.gain.setValueAtTime(0.12, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.12);
  } catch (e) {
    // Silent fail
  }
}

// Tiếng búa đập vỡ đá rầm rầm rầm
export function playSmashSound() {
  try {
    initAudio();
    if (!audioCtx) return;

    const ctx = audioCtx;
    const now = ctx.currentTime;

    // Bass thud
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(150, now);
    osc1.frequency.exponentialRampToValueAtTime(40, now + 0.25);
    gain1.gain.setValueAtTime(0.3, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start();
    osc1.stop(now + 0.25);

    // High crunch (metal/iron scraping stone)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    const filter = ctx.createBiquadFilter();
    osc2.type = 'sawtooth';
    osc2.frequency.setValueAtTime(1200, now);
    osc2.frequency.exponentialRampToValueAtTime(150, now + 0.15);
    
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(2500, now);
    
    gain2.gain.setValueAtTime(0.08, now);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
    osc2.connect(filter);
    filter.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start();
    osc2.stop(now + 0.15);
  } catch (e) {
    // Silent fail
  }
}

// Tiếng gỗ gõ (Bone click) nhẹ nhàng
export function playWoodClickSound() {
  try {
    initAudio();
    if (!audioCtx) return;

    const ctx = audioCtx;
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(350, ctx.currentTime + 0.05);

    gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.05);
  } catch (e) {
    // Silent fail
  }
}
