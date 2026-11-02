import { useBirthdayStore } from "../stores/birthdayStore";

let sharedAudioContext: AudioContext | null = null;
let sharedMusicNodes: OscillatorNode[] = [];

export function useBirthdayAudio() {
  const birthday = useBirthdayStore();

  function getContext() {
    const AudioContextConstructor = window.AudioContext;
    if (!AudioContextConstructor) return null;
    sharedAudioContext ??= new AudioContextConstructor();
    return sharedAudioContext;
  }

  async function toggleMusic() {
    const context = getContext();
    if (!context) return;
    if (birthday.soundOn) {
      sharedMusicNodes.forEach((node) => node.stop());
      sharedMusicNodes = [];
      await context.suspend();
      birthday.setSoundOn(false);
      return;
    }

    await context.resume();
    [261.63, 329.63, 392].forEach((frequency, index) => {
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.type = "sine";
      oscillator.frequency.value = frequency;
      gain.gain.value = index === 0 ? 0.012 : 0.006;
      oscillator.connect(gain);
      gain.connect(context.destination);
      oscillator.start();
      sharedMusicNodes.push(oscillator);
    });
    birthday.setSoundOn(true);
  }

  async function playChime() {
    const context = getContext();
    if (!context) return;
    await context.resume();
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(659.25, context.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(987.77, context.currentTime + 0.16);
    gain.gain.setValueAtTime(0.0001, context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.08, context.currentTime + 0.025);
    gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.6);
    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start();
    oscillator.stop(context.currentTime + 0.62);
  }

  return { toggleMusic, playChime };
}
