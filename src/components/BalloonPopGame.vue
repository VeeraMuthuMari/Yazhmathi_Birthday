<script setup lang="ts">
import { ref } from "vue";
import confetti from "canvas-confetti";
import { RotateCcw } from "lucide-vue-next";
import { useBirthdayAudio } from "../composables/useBirthdayAudio";

const emit = defineEmits<{ complete: [] }>();
const { playSoundEffect } = useBirthdayAudio();
const balloons = [
  { left: 9, top: 28, hue: 330, delay: 0 },
  { left: 28, top: 62, hue: 48, delay: 1.2 },
  { left: 47, top: 22, hue: 195, delay: 0.4 },
  { left: 68, top: 56, hue: 270, delay: 1.8 },
  { left: 86, top: 30, hue: 125, delay: 0.8 },
  { left: 19, top: 76, hue: 15, delay: 2.2 },
  { left: 57, top: 78, hue: 210, delay: 1.5 },
  { left: 79, top: 78, hue: 44, delay: 0.2 },
];
const popped = ref<number[]>([]);
const bursts = ref<number[]>([]);
const score = ref(0);
const complete = ref(false);

function popBalloon(index: number) {
  if (complete.value || popped.value.includes(index)) return;
  popped.value.push(index);
  bursts.value.push(index);
  window.setTimeout(() => {
    bursts.value = bursts.value.filter((burst) => burst !== index);
  }, 650);
  score.value += 1;
  void playSoundEffect("pop");
  confetti({
    particleCount: 34,
    spread: 78,
    startVelocity: 25,
    origin: { x: balloons[index]!.left / 100, y: balloons[index]!.top / 100 },
    colors: ["#ffd95e", "#ff76ba", "#80d9ff", "#b99aff", "#fffdf8"],
    disableForReducedMotion: true,
  });
  if (score.value === 5) {
    complete.value = true;
    confetti({ particleCount: 130, spread: 100, origin: { y: 0.55 }, disableForReducedMotion: true });
    emit("complete");
  }
}

function replay() {
  popped.value = [];
  bursts.value = [];
  score.value = 0;
  complete.value = false;
}
</script>

<template>
  <section class="mini-game balloon-game" aria-labelledby="balloon-game-title">
    <header class="mini-game-heading">
      <p class="game-kicker">GAME 1 · READY, SET, POP!</p>
      <h2 id="balloon-game-title">Pop the balloons!</h2>
      <p>Touch five balloons and watch the colours go pop!</p>
    </header>
    <div class="game-score" aria-live="polite">🎈 Balloons popped: <b>{{ score }}</b> / 5</div>
    <div class="balloon-playfield">
      <button
        v-for="(balloon, index) in balloons"
        :key="index"
        class="game-balloon"
        :class="{ 'balloon-popped': popped.includes(index) }"
        :style="{ left: `${balloon.left}%`, top: `${balloon.top}%`, '--balloon-hue': balloon.hue, '--float-delay': `${balloon.delay}s` }"
        type="button"
        :disabled="complete || popped.includes(index)"
        :aria-label="`Pop balloon ${index + 1}`"
        @click="popBalloon(index)"
      >
        <span class="game-balloon-shine" />
      </button>
      <span
        v-for="index in bursts"
        :key="`burst-${index}`"
        class="balloon-star-burst"
        :style="{ left: `${balloons[index]!.left}%`, top: `${balloons[index]!.top}%` }"
        aria-hidden="true"
      >✦ ✧ ✦</span>
      <div v-if="complete" class="game-win-message" role="status">
        <span aria-hidden="true">🌈</span>
        <b>YAY! YOU DID IT!</b>
        <span aria-hidden="true">⭐</span>
      </div>
    </div>
    <button class="game-replay-button" type="button" @click="replay">
      <RotateCcw :size="19" /> Play again
    </button>
  </section>
</template>
