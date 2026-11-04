<script setup lang="ts">
import { ArrowDown, Sparkles } from "lucide-vue-next";
import { ref } from "vue";
import ParticleBackground from "./ParticleBackground.vue";
import PremiumNavbar from "./PremiumNavbar.vue";
import FloatingBabyPortraits from "./FloatingBabyPortraits.vue";
import HeroCakeScene from "./HeroCakeScene.vue";
import FloatingBalloons from "./FloatingBalloons.vue";
import AnimatedBirthdayName from "./AnimatedBirthdayName.vue";
import { useBirthdayAnimation } from "../composables/useBirthdayAnimation";
import { useBirthdayAudio } from "../composables/useBirthdayAudio";
import { useBirthdayStore } from "../stores/birthdayStore";

const emit = defineEmits<{ enter: [] }>();
const { enterCelebration } = useBirthdayAnimation();
const { toggleMusic } = useBirthdayAudio();
const birthday = useBirthdayStore();
const entering = ref(false);

async function enter() {
  if (entering.value) return;
  entering.value = true;
  if (!birthday.soundOn) void toggleMusic();
  await enterCelebration();
  emit("enter");
  window.setTimeout(() => {
    entering.value = false;
  }, 1200);
}
</script>

<template>
  <section id="home" class="hero" :class="{ 'hero-entered': birthday.entered }">
    <div class="hero-grain" />
    <ParticleBackground :count="16" />
    <FloatingBabyPortraits scene="hero" />
    <FloatingBalloons />
    <HeroCakeScene />
    <PremiumNavbar />
    <div class="hero-copy">
      <p
        class="eyebrow hero-eyebrow hero-reveal"
        style="--hero-reveal-delay: 250ms"
      >
        A DAY AS SPECIAL AS YOU
      </p>
      <h1 class="hero-reveal" style="--hero-reveal-delay: 450ms">
        <span class="hero-kicker">HAPPY 3RD BIRTHDAY</span>
        <AnimatedBirthdayName />
      </h1>
      <p class="hero-subtitle">Our Little Star, Our Biggest Happiness!</p>
      <div class="date-pill"><span /> 07 <b>•</b> NOVEMBER <b>•</b> 2026 <span /></div>
    </div>
    <button class="primary-button hero-enter-button" type="button" :disabled="entering" @click="enter">
      <Sparkles :size="16" />
      {{ entering ? "The Magic Is All Yours" : "Enter the Celebration" }}
    </button>
    <div class="hero-caption"><span>01</span><span class="caption-line" /> A LITTLE WORLD, MADE FOR YOU</div>
    <a class="scroll-cue" href="#games" aria-label="Scroll to the birthday games"><ArrowDown :size="16" /></a>
  </section>
</template>
