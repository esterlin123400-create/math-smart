const PREFS_STORAGE_KEY = 'math_smart_prefs_v1';

let sharedAudioCtx = null;

const getAudioContext = () => {
  if (typeof window === 'undefined') return null;
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtx) return null;
  if (!sharedAudioCtx) {
    sharedAudioCtx = new AudioCtx();
  }
  if (sharedAudioCtx.state === 'suspended') {
    sharedAudioCtx.resume().catch(() => {});
  }
  return sharedAudioCtx;
};

export const isSoundEnabled = () => {
  try {
    if (typeof window === 'undefined') return true;
    const saved = window.localStorage.getItem(PREFS_STORAGE_KEY);
    if (!saved) return true;
    const parsed = JSON.parse(saved);
    return parsed?.soundEnabled !== false;
  } catch {
    return true;
  }
};

const playTone = (frequency, duration = 0.14, type = 'sine', startTimeOffset = 0, volume = 0.08) => {
  if (!isSoundEnabled()) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime + startTimeOffset;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(frequency, now);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.exponentialRampToValueAtTime(volume, now + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + duration + 0.02);
  } catch {
    // Ignore audio context restriction errors
  }
};

export const playSuccessChime = () => {
  playTone(523.25, 0.12, 'triangle', 0, 0.09);     // C5
  playTone(659.25, 0.12, 'triangle', 0.09, 0.09);  // E5
  playTone(783.99, 0.22, 'triangle', 0.18, 0.1);   // G5
};

export const playErrorTone = () => {
  playTone(260, 0.16, 'sawtooth', 0, 0.05);
  playTone(196, 0.22, 'sawtooth', 0.13, 0.05);
};

export const playLevelUpFanfare = () => {
  playTone(523.25, 0.11, 'triangle', 0, 0.09);
  playTone(659.25, 0.11, 'triangle', 0.09, 0.09);
  playTone(783.99, 0.12, 'triangle', 0.18, 0.09);
  playTone(1046.5, 0.3, 'triangle', 0.28, 0.11);
};

