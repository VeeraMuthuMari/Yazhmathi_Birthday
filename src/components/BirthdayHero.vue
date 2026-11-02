<script setup lang="ts">
import { ArrowDown, Sparkles } from "lucide-vue-next";
import { defineAsyncComponent, onMounted, onUnmounted, ref } from "vue";
import ParticleBackground from "./ParticleBackground.vue";
import PremiumNavbar from "./PremiumNavbar.vue";
import FloatingBalloons from "./FloatingBalloons.vue";
import { useBirthdayAnimation } from "../composables/useBirthdayAnimation";
import { useBirthdayAudio } from "../composables/useBirthdayAudio";
import { useBirthdayStore } from "../stores/birthdayStore";

const emit = defineEmits<{ enter: [] }>();
const { enterCelebration } = useBirthdayAnimation();
const { toggleMusic } = useBirthdayAudio();
const birthday = useBirthdayStore();
const entering = ref(false);
const sceneReady = ref(false);
const heroScene = defineAsyncComponent(() => import("./BirthdayHeroScene.vue"));
let sceneTimer: number | undefined;

onMounted(() => {
  sceneTimer = window.setTimeout(() => {
    sceneReady.value = true;
  }, 250);
});

onUnmounted(() => {
  if (sceneTimer !== undefined) window.clearTimeout(sceneTimer);
});

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
  <section id="home" class="hero">
    <div class="hero-grain" />
    <div class="hero-orbit orbit-one" />
    <div class="hero-orbit orbit-two" />
    <component :is="heroScene" v-if="sceneReady" class="hero-three" />
    <FloatingBalloons />
    <ParticleBackground :count="28" />
    <PremiumNavbar />
    <div class="hero-copy">
      <p
        v-motion
        class="eyebrow hero-eyebrow"
        :initial="{ opacity: 0, y: 16 }"
        :enter="{ opacity: 1, y: 0, transition: { delay: 250, duration: 700 } }"
      >
        A DAY AS SPECIAL AS YOU
      </p>
      <h1
        v-motion
        :initial="{ opacity: 0, y: 24 }"
        :enter="{ opacity: 1, y: 0, transition: { delay: 450, duration: 900 } }"
      >
        <span class="hero-kicker">HAPPY BIRTHDAY</span>
        <span class="hero-name">Veera <i>Yazhmathi</i></span>
      </h1>
      <p class="hero-subtitle">Three Years of Magic, Love &amp; Happiness!</p>
      <div class="date-pill"><span /> 11 <b>•</b> 11 <b>•</b> 2026 <span /></div>
      <button class="primary-button" type="button" :disabled="entering" @click="enter">
        <Sparkles :size="16" />
        {{ entering ? "The Magic Is All Yours" : "Enter the Magical Celebration" }}
      </button>
    </div>
    <div class="hero-caption"><span>01</span><span class="caption-line" /> A LITTLE WORLD, MADE FOR YOU</div>
    <a class="scroll-cue" href="#countdown" aria-label="Scroll to countdown"><ArrowDown :size="16" /></a>
  </section>
</template>
