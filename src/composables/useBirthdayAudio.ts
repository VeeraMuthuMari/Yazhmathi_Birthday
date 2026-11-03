import { useBirthdayStore } from "../stores/birthdayStore";

const melody = [
  67, null, 67, null, 69, null, 67, null, 72, null, 71, null, null, null, null, null,
  67, null, 67, null, 69, null, 67, null, 74, null, 72, null, null, null, null, null,
  67, null, 67, null, 79, null, 76, null, 72, null, 71, null, 69, null, null, null,
  77, null, 77, null, 76, null, 72, null, 74, null, 72, null, null, null, null, null,
];
const chords = [
  [48, 55, 60, 64],
  [45, 52, 57, 60],
  [41, 48, 53, 57],
  [43, 50, 55, 59],
];
const stepDuration = (60 / 78) * 0.5;

let sharedAudioContext: AudioContext | null = null;
let musicOutput: GainNode | null = null;
let musicTimer: number | undefined;
let musicStep = 0;
const activeMusicNodes = new Set<OscillatorNode>();

function getContext() {
  const AudioContextConstructor = window.AudioContext;
  if (!AudioContextConstructor) return null;
  sharedAudioContext ??= new AudioContextConstructor();
  return sharedAudioContext;
}

function getMusicOutput(context: AudioContext) {
  if (!musicOutput) {
    musicOutput = context.createGain();
    musicOutput.gain.value = 0.72;
    musicOutput.connect(context.destination);
  }
  return musicOutput;
}

function midiFrequency(note: number) {
  return 440 * 2 ** ((note - 69) / 12);
}

function playTone(
  context: AudioContext,
  note: number,
  duration: number,
  volume: number,
  waveform: OscillatorType,
  output: AudioNode,
) {
  const start = context.currentTime + 0.025;
  const oscillator = context.createOscillator();
  const envelope = context.createGain();
  oscillator.type = waveform;
  oscillator.frequency.value = midiFrequency(note);
  envelope.gain.setValueAtTime(0.0001, start);
  envelope.gain.exponentialRampToValueAtTime(volume, start + 0.04);
  envelope.gain.exponentialRampToValueAtTime(0.0001, start + duration);
  oscillator.connect(envelope);
  envelope.connect(output);
  oscillator.onended = () => activeMusicNodes.delete(oscillator);
  oscillator.start(start);
  oscillator.stop(start + duration + 0.05);
  activeMusicNodes.add(oscillator);
}

function playSongStep(context: AudioContext) {
  const step = musicStep % melody.length;
  const chordIndex = Math.floor(step / 16) % chords.length;
  const output = getMusicOutput(context);

  if (step % 16 === 0) {
    chords[chordIndex]?.forEach((note) => playTone(context, note, 5.7, 0.005, "sine", output));
  }

  const note = melody[step];
  if (note !== null && note !== undefined) {
    playTone(context, note, 0.48, 0.034, "sine", output);
    playTone(context, note + 12, 0.34, 0.006, "triangle", output);
  }

  musicStep += 1;
}

export function useBirthdayAudio() {
  const birthday = useBirthdayStore();

  async function playSoundEffect(effect: "pop" | "star" | "candle" | "gift" | "sparkle") {
    const context = getContext();
    if (!context) return;
    await context.resume();

    const notes: Record<typeof effect, [number, number, OscillatorType]> = {
      pop: [880, 440, "sine"],
      star: [1318.5, 1760, "sine"],
      candle: [659.25, 987.77, "triangle"],
      gift: [523.25, 1046.5, "sine"],
      sparkle: [987.77, 1318.5, "sine"],
    };
    const [startFrequency, endFrequency, waveform] = notes[effect];
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    const start = context.currentTime;
    oscillator.type = waveform;
    oscillator.frequency.setValueAtTime(startFrequency, start);
    oscillator.frequency.exponentialRampToValueAtTime(endFrequency, start + 0.12);
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(0.07, start + 0.018);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.28);
    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start(start);
    oscillator.stop(start + 0.3);
  }

  async function toggleMusic() {
    const context = getContext();
    if (!context) return;

    if (birthday.soundOn) {
      window.clearInterval(musicTimer);
      musicTimer = undefined;
      activeMusicNodes.forEach((node) => node.stop());
      activeMusicNodes.clear();
      await context.suspend();
      birthday.setSoundOn(false);
      return;
    }

    await context.resume();
    musicStep = 0;
    playSongStep(context);
    musicTimer = window.setInterval(() => playSongStep(context), stepDuration * 1000);
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

  return { toggleMusic, playChime, playSoundEffect };
}
