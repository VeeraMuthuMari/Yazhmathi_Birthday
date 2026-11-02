<script setup lang="ts">
import { TresCanvas } from "@tresjs/core";
import { Heart, Sparkles } from "lucide-vue-next";
import { computed, onMounted, onUnmounted, ref } from "vue";
import { PerspectiveCamera } from "three";
import { useBirthdayAnimation } from "../composables/useBirthdayAnimation";
import { useBirthdayAudio } from "../composables/useBirthdayAudio";
import { useBirthdayStore } from "../stores/birthdayStore";

const birthday = useBirthdayStore();
const { makeWish } = useBirthdayAnimation();
const { playChime } = useBirthdayAudio();
const rotation = ref(0);
const dragging = ref(false);
const pointerX = ref(0);
const cakeRotation = computed(() => [0, rotation.value, 0] as [number, number, number]);
const cakeCamera = new PerspectiveCamera(38, 1, 0.1, 100);
cakeCamera.position.set(0, 1.9, 5.4);
const cakeStage = ref<HTMLElement>();
let cakeResizeObserver: ResizeObserver | undefined;
const candlePositions = computed(() => (birthday.wished ? [] : [-0.28, 0, 0.28]));
const petals = [0, 1, 2, 3, 4].map((index) => {
  const angle = (index / 5) * Math.PI * 2;
  return [Math.cos(angle) * 0.1, Math.sin(angle) * 0.1, 0] as [number, number, number];
});

onMounted(() => {
  if (!cakeStage.value) return;
  cakeResizeObserver = new ResizeObserver(([entry]) => {
    if (!entry) return;
    cakeCamera.aspect = entry.contentRect.width / entry.contentRect.height;
    cakeCamera.updateProjectionMatrix();
  });
  cakeResizeObserver.observe(cakeStage.value);
});

onUnmounted(() => cakeResizeObserver?.disconnect());

function onPointerDown(event: PointerEvent) {
  dragging.value = true;
  pointerX.value = event.clientX;
  (event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
}

function onPointerMove(event: PointerEvent) {
  if (!dragging.value) return;
  const delta = event.clientX - pointerX.value;
  rotation.value += delta * 0.008;
  pointerX.value = event.clientX;
}

function stopDragging() {
  dragging.value = false;
}

function wish() {
  if (birthday.wished) return;
  makeWish();
  void playChime();
}
</script>

<template>
  <section id="cake" class="cake-section">
    <div
      v-motion
      class="cake-copy"
      :initial="{ opacity: 0, x: -24 }"
      :visible-once="{ opacity: 1, x: 0, transition: { duration: 750 } }"
    >
      <p class="eyebrow">A WISH, JUST FOR YOU</p>
      <h2>Make a wish,<br /><i>little star.</i></h2>
      <p class="section-intro">
        A little sweetness, a little sparkle, and all the love in the world. Take a moment, close your eyes,
        and make your very special wish.
      </p>
      <button class="outline-button" type="button" @click="wish">
        <Sparkles :size="16" /> {{ birthday.wished ? "Your wish is on its way" : "Make a Wish" }}
      </button>
      <p class="micro-note">Go on — the candles are waiting just for you.</p>
    </div>
    <div
      ref="cakeStage"
      class="cake-stage"
      :class="{ 'cake-wished': birthday.wished, 'is-dragging': dragging }"
      aria-label="Interactive three-tier birthday cake. Drag to turn it."
      @pointerdown="onPointerDown"
      @pointermove="onPointerMove"
      @pointerup="stopDragging"
      @pointercancel="stopDragging"
    >
      <div class="cake-halo" />
      <TresCanvas class="cake-three" clear-color="#1e152b" :camera="cakeCamera" :dpr="[1, 1.5]" shadows>
        <TresAmbientLight :intensity="1.3" />
        <TresDirectionalLight :position="[4, 6, 4]" :intensity="2.1" cast-shadow />
        <TresPointLight :position="[-3, 2, 2]" :intensity="13" color="#d98bb5" />
        <TresPointLight :position="[3, 3, -3]" :intensity="16" color="#f7cf8e" />
        <TresGroup :rotation="cakeRotation" :position="[0, -0.55, 0]">
          <TresGroup
            v-for="tier in [
              { y: 0.2, height: 0.64, radius: 1.18, color: '#f2aec1' },
              { y: 0.85, height: 0.58, radius: 0.88, color: '#fff2ed' },
              { y: 1.4, height: 0.5, radius: 0.58, color: '#f2aec1' },
            ]"
            :key="tier.y"
            :position="[0, tier.y, 0]"
          >
            <TresMesh cast-shadow receive-shadow>
              <TresCylinderGeometry :args="[tier.radius, tier.radius, tier.height, 48]" />
              <TresMeshStandardMaterial :color="tier.color" :roughness="0.3" />
            </TresMesh>
            <TresMesh :position="[0, tier.height / 2 + 0.01, 0]">
              <TresCylinderGeometry :args="[tier.radius + 0.025, tier.radius + 0.025, 0.06, 48]" />
              <TresMeshStandardMaterial color="#f8e2d6" :roughness="0.25" />
            </TresMesh>
            <TresMesh :position="[0, -tier.height / 2 + 0.06, 0]">
              <TresTorusGeometry :args="[tier.radius + 0.015, 0.035, 8, 48]" />
              <TresMeshStandardMaterial color="#d9b36f" :metalness="0.55" :roughness="0.28" />
            </TresMesh>
          </TresGroup>
          <TresGroup v-for="x in candlePositions" :key="x" :position="[x, 1.96, 0]">
            <TresMesh>
              <TresCylinderGeometry :args="[0.035, 0.035, 0.34, 12]" />
              <TresMeshStandardMaterial color="#fff4dd" />
            </TresMesh>
            <TresMesh class="candle-flame" :position="[0, 0.25, 0]">
              <TresSphereGeometry :args="[0.055, 12, 12]" />
              <TresMeshBasicMaterial color="#ffe08a" />
            </TresMesh>
          </TresGroup>
          <TresGroup
            v-for="flower in [
              { x: -0.78, y: 0.15, z: 0.75 },
              { x: 0.62, y: 0.17, z: 0.82 },
              { x: 0.58, y: 1.05, z: 0.45 },
            ]"
            :key="`${flower.x}-${flower.y}`"
            :position="[flower.x, flower.y, flower.z]"
          >
            <TresMesh v-for="(petal, index) in petals" :key="index" :position="petal">
              <TresSphereGeometry :args="[0.075, 12, 12]" />
              <TresMeshStandardMaterial color="#fff0e8" :roughness="0.32" />
            </TresMesh>
            <TresMesh>
              <TresSphereGeometry :args="[0.04, 12, 12]" />
              <TresMeshStandardMaterial color="#e2bb79" :metalness="0.35" />
            </TresMesh>
          </TresGroup>
          <TresMesh :position="[0, 2.35, 0]">
            <TresCylinderGeometry :args="[0.018, 0.018, 0.42, 8]" />
            <TresMeshStandardMaterial color="#d8b36c" :metalness="0.5" />
          </TresMesh>
          <TresMesh :position="[0, 2.57, 0]">
            <TresSphereGeometry :args="[0.16, 24, 24]" />
            <TresMeshStandardMaterial color="#ffe3a2" emissive="#d89f3c" :emissive-intensity="0.8" />
          </TresMesh>
        </TresGroup>
      </TresCanvas>
      <span class="cake-topper-text" aria-label="Cake topper: Veera">Veera</span>
      <div class="cake-stage-label"><span>MADE WITH LOVE</span><Heart :size="12" fill="currentColor" /></div>
      <div v-if="birthday.wished" class="wish-sparkle-overlay" aria-hidden="true">✦ ✧ ✦</div>
    </div>
  </section>
</template>
