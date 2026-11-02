<script setup lang="ts">
import { Sparkles } from "lucide-vue-next";
import FloatingBalloons from "./FloatingBalloons.vue";
import ParticleBackground from "./ParticleBackground.vue";
import { useBirthdayAnimation } from "../composables/useBirthdayAnimation";
import { useBirthdayAudio } from "../composables/useBirthdayAudio";

const { celebrate } = useBirthdayAnimation();
const { playChime } = useBirthdayAudio();
const fireworks = [0, 1, 2, 3];
const stars = Array.from({ length: 14 }, (_, index) => ({
  id: index,
  left: (index * 43 + 4) % 96,
  top: (index * 29 + 7) % 80,
}));

function celebrateWithSound() {
  celebrate();
  void playChime();
}
</script>

<template>
  <section id="celebration" class="celebration-section">
    <div v-for="firework in fireworks" :key="firework" class="firework" :class="`firework-${firework + 1}`">
      <span v-for="spark in 8" :key="spark" />
    </div>
    <div class="celebration-stars" aria-hidden="true">
      <span
        v-for="star in stars"
        :key="star.id"
        :style="{ '--left': `${star.left}%`, '--top': `${star.top}%` }"
        >✦</span
      >
    </div>
    <ParticleBackground :count="20" variant="celebration" />
    <p
      v-motion
      class="eyebrow"
      :initial="{ opacity: 0, y: 12 }"
      :visible-once="{ opacity: 1, y: 0, transition: { duration: 700 } }"
    >
      TODAY, THE WHOLE SKY CELEBRATES YOU
    </p>
    <h2 class="celebration-title">SHINE BRIGHT,<br /><i>VEERA YAZHMATHI!</i></h2>
    <p class="celebration-subtitle">May Your Little World Always Be Full of Magic!</p>
    <button class="celebrate-button" type="button" @click="celebrateWithSound">
      <Sparkles :size="16" /> Let&apos;s Celebrate
    </button>
    <div class="celebration-orb orb-left" />
    <div class="celebration-orb orb-right" />
    <FloatingBalloons />
    <div class="balloon-row" aria-hidden="true">
      <span>♡</span><span>✦</span><span>♡</span><span>✧</span><span>♡</span>
    </div>
  </section>
</template>
