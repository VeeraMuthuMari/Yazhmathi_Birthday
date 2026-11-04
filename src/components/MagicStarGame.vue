<script setup lang="ts">
import { ref } from "vue";
import confetti from "canvas-confetti";
import { RotateCcw } from "lucide-vue-next";
import { useBirthdayAudio } from "../composables/useBirthdayAudio";

const emit = defineEmits<{ complete: [] }>();
const { playSoundEffect } = useBirthdayAudio();
const stars = [
  { left: 12, top: 24, delay: 0 },
  { left: 32, top: 62, delay: 0.6 },
  { left: 51, top: 20, delay: 1.1 },
  { left: 72, top: 56, delay: 0.3 },
  { left: 88, top: 27, delay: 1.4 },
  { left: 20, top: 80, delay: 1.8 },
  { left: 61, top: 78, delay: 0.9 },
];
const collected = ref<number[]>([]);
const complete = ref(false);

function collect(index: number) {
  if (complete.value || collected.value.includes(index)) return;
  collected.value.push(index);
  void playSoundEffect("star");
  confetti({
    particleCount: 22,
    spread: 54,
    startVelocity: 18,
    origin: { x: stars[index]!.left / 100, y: stars[index]!.top / 100 },
    colors: ["#ffd95e", "#fff4b8", "#b99aff", "#80d9ff"],
    shapes: ["star", "circle"],
    disableForReducedMotion: true,
  });
  if (collected.value.length === 5) {
    complete.value = true;
    confetti({ particleCount: 140, spread: 100, origin: { y: 0.5 }, disableForReducedMotion: true });
    emit("complete");
  }
}

function replay() {
  collected.value = [];
  complete.value = false;
}
</script>

<template>
  <section class="mini-game star-game" aria-labelledby="star-game-title">
    <header class="mini-game-heading">
      <p class="game-kicker">GAME 3 · SPARKLE HUNT</p>
      <h2 id="star-game-title">Collect the magic stars!</h2>
      <p>Touch five twinkly stars to fill your sky with magic.</p>
    </header>
    <div class="game-score" aria-live="polite">⭐ Magic stars: <b>{{ Math.min(collected.length, 5) }}</b> / 5</div>
    <div class="star-playfield">
      <button
        v-for="(star, index) in stars"
        :key="index"
        class="collectible-star"
        :class="{ 'star-collected': collected.includes(index) }"
        :style="{ left: `${star.left}%`, top: `${star.top}%`, '--float-delay': `${star.delay}s` }"
        type="button"
        :disabled="complete || collected.includes(index)"
        :aria-label="`Collect magic star ${index + 1}`"
        @click="collect(index)"
      >★</button>
      <div v-if="complete" class="game-win-message" role="status">
        <span aria-hidden="true">✨</span>
        <b>YOU ARE A SUPERSTAR!</b>
        <span aria-hidden="true">✨</span>
      </div>
    </div>
    <button class="game-replay-button" type="button" @click="replay">
      <RotateCcw :size="19" /> Play again
    </button>
  </section>
</template>
