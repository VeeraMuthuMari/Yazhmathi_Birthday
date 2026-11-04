<script setup lang="ts">
import { defineAsyncComponent, onMounted } from "vue";
import confetti from "canvas-confetti";
import { useBirthdayAudio } from "../composables/useBirthdayAudio";
import AnimatedBirthdayName from "./AnimatedBirthdayName.vue";

const BirthdayCake3D = defineAsyncComponent(() => import("./BirthdayCake3D.vue"));
const { playSoundEffect } = useBirthdayAudio();
const emit = defineEmits<{ replay: [] }>();

onMounted(() => {
  confetti({
    particleCount: 220,
    spread: 150,
    startVelocity: 42,
    origin: { y: 0.6 },
    colors: ["#ffd95e", "#ff76ba", "#80d9ff", "#b99aff", "#fffdf8"],
    disableForReducedMotion: true,
  });
  void playSoundEffect("sparkle");
});
</script>

<template>
  <section class="birthday-game-celebration" aria-labelledby="final-birthday-title">
    <span class="celebration-orbit celebration-orbit-one" aria-hidden="true">✦ ✨ ✦</span>
    <span class="celebration-orbit celebration-orbit-two" aria-hidden="true">⭐ ✧ ⭐</span>
    <p class="game-kicker">YOU DID IT, LITTLE STAR!</p>
    <h2 id="final-birthday-title">HAPPY 3RD BIRTHDAY!</h2>
    <AnimatedBirthdayName />
    <p class="celebration-tagline">OUR LITTLE STAR, OUR BIGGEST HAPPINESS!</p>
    <BirthdayCake3D game-mode="wish" />
    <p class="celebration-date">07 NOVEMBER 2026</p>
    <button class="game-replay-button celebration-replay" type="button" @click="emit('replay')">
      Play the games again ✨
    </button>
  </section>
</template>
