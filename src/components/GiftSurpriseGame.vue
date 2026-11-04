<script setup lang="ts">
import { ref } from "vue";
import confetti from "canvas-confetti";
import { RotateCcw, Sparkles } from "lucide-vue-next";
import { useBirthdayAudio } from "../composables/useBirthdayAudio";
import { heroBabyPhoto } from "../data/babyPhotos";

const emit = defineEmits<{ complete: [] }>();
const { playSoundEffect } = useBirthdayAudio();
const opened = ref(false);

function openGift() {
  if (opened.value) return;
  opened.value = true;
  void playSoundEffect("gift");
  confetti({
    particleCount: 150,
    spread: 110,
    startVelocity: 32,
    origin: { y: 0.62 },
    colors: ["#ffd95e", "#ff76ba", "#80d9ff", "#b99aff", "#fffdf8"],
    disableForReducedMotion: true,
  });
  emit("complete");
}
</script>

<template>
  <section class="mini-game gift-game" aria-labelledby="gift-game-title">
    <header class="mini-game-heading">
      <p class="game-kicker">GAME 5 · A SURPRISE FOR YOU</p>
      <h2 id="gift-game-title">A little magic is waiting!</h2>
      <p>Touch the gift to open your surprise!</p>
    </header>
    <button
      class="play-gift-box"
      :class="{ 'gift-game-open': opened }"
      type="button"
      :aria-expanded="opened"
      :aria-label="opened ? 'Your birthday surprise is open' : 'Touch the gift to open your surprise'"
      @click="openGift"
    >
      <span class="play-gift-glow" />
      <span class="play-gift-lid"><span class="play-gift-bow" /></span>
      <span class="play-gift-body"><span class="play-gift-ribbon" /></span>
      <span class="gift-game-spark gift-game-spark-one">✦</span>
      <span class="gift-game-spark gift-game-spark-two">✧</span>
      <span v-if="opened" class="gift-game-balloons" aria-hidden="true">🎈 🎈 🎈</span>
      <span v-if="opened" class="gift-game-stars" aria-hidden="true">✨ 🦋 ⭐ 🦋 ✨</span>
    </button>
    <div v-if="opened" class="gift-surprise-message" role="status">
      <img v-if="heroBabyPhoto" :src="heroBabyPhoto.src" alt="Sample birthday portrait" />
      <Sparkles :size="22" />
      <b>YOU ARE OUR LITTLE PRINCESS!</b>
    </div>
    <button v-if="opened" class="game-replay-button" type="button" @click="opened = false">
      <RotateCcw :size="19" /> Close surprise
    </button>
  </section>
</template>
