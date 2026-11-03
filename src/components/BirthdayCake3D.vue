<script setup lang="ts">
import { TresCanvas } from "@tresjs/core";
import { Heart, Sparkles } from "lucide-vue-next";
import { computed, onMounted, onUnmounted, ref } from "vue";
import gsap from "gsap";
import { useBirthdayAnimation } from "../composables/useBirthdayAnimation";
import { useBirthdayAudio } from "../composables/useBirthdayAudio";
import { useBirthdayStore } from "../stores/birthdayStore";
import FloatingBabyPortraits from "./FloatingBabyPortraits.vue";
import { ExtrudeGeometry, PerspectiveCamera, Shape } from "three";

const birthday = useBirthdayStore();
const { makeWish } = useBirthdayAnimation();
const { playChime } = useBirthdayAudio();
withDefaults(defineProps<{ gameMode?: "wish" | "candles" | "decorate" }>(), {
  gameMode: "wish",
});
const emit = defineEmits<{ complete: [] }>();
const rotation = ref(0);
const flameScale = ref(1);
const dragging = ref(false);
const wishing = ref(false);
const pointerX = ref(0);
const pinchDistance = ref<number>();
const cakeScale = ref(1);
const litCandles = ref<number[]>([]);
const cakeColor = ref("#d9a0ff");
const sprinklesEnabled = ref(true);
const flowersEnabled = ref(true);
const decorationComplete = ref(false);
const decorationColors = ["#d9a0ff", "#ff8fc8", "#80d9ff", "#ffd95e", "#b8ec9b"];
const sprinkleIndices = Array.from({ length: 32 }, (_, index) => index);
const pointers = new Map<number, { x: number; y: number }>();
const cakeRotation = computed(() => [0, rotation.value, 0] as [number, number, number]);
const cakeCamera = new PerspectiveCamera(42, 1, 0.1, 100);
cakeCamera.position.set(0, 1.35, 6.7);
const cakeStage = ref<HTMLElement>();
let cakeResizeObserver: ResizeObserver | undefined;
let rotationTween: gsap.core.Tween | undefined;
let flameTween: gsap.core.Tween | undefined;
let inertiaTween: gsap.core.Tween | undefined;
let dragVelocity = 0;
let lastMoveTime = 0;
const candlePositions = [-0.28, 0, 0.28];
const topperShape = new Shape();
topperShape.moveTo(-0.2, 0.4);
topperShape.bezierCurveTo(0.18, 0.52, 0.38, 0.3, 0.07, 0.03);
topperShape.bezierCurveTo(0.42, -0.19, 0.22, -0.5, -0.2, -0.38);
topperShape.lineTo(-0.2, -0.22);
topperShape.bezierCurveTo(0.02, -0.28, 0.18, -0.2, 0.12, -0.07);
topperShape.bezierCurveTo(0.08, 0.05, -0.04, 0.08, -0.19, 0.07);
topperShape.lineTo(-0.19, 0.23);
topperShape.bezierCurveTo(0.02, 0.2, 0.16, 0.24, 0.13, 0.34);
topperShape.bezierCurveTo(0.1, 0.44, -0.04, 0.44, -0.2, 0.34);
topperShape.closePath();
const topperGeometry = new ExtrudeGeometry(topperShape, {
  depth: 0.08,
  bevelEnabled: true,
  bevelSegments: 3,
  steps: 1,
  bevelSize: 0.025,
  bevelThickness: 0.025,
});
const petals = [0, 1, 2, 3, 4].map((index) => {
  const angle = (index / 5) * Math.PI * 2;
  return [Math.cos(angle) * 0.1, Math.sin(angle) * 0.1, 0] as [number, number, number];
});

onMounted(() => {
  if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    rotationTween = gsap.to(rotation, {
      value: Math.PI * 2,
      duration: 32,
      repeat: -1,
      ease: "none",
    });
    flameTween = gsap.to(flameScale, {
      value: 1.12,
      duration: 0.32,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });
  }
  if (!cakeStage.value) return;
  cakeResizeObserver = new ResizeObserver(([entry]) => {
    if (!entry) return;
    cakeCamera.aspect = entry.contentRect.width / entry.contentRect.height;
    cakeCamera.updateProjectionMatrix();
  });
  cakeResizeObserver.observe(cakeStage.value);
});

onUnmounted(() => {
  cakeResizeObserver?.disconnect();
  rotationTween?.kill();
  flameTween?.kill();
  inertiaTween?.kill();
  topperGeometry.dispose();
});

function onPointerDown(event: PointerEvent) {
  (event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
  pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
  if (pointers.size > 1) {
    const points = [...pointers.values()];
    pinchDistance.value = Math.hypot(points[0]!.x - points[1]!.x, points[0]!.y - points[1]!.y);
    return;
  }
  rotationTween?.pause();
  dragging.value = true;
  pointerX.value = event.clientX;
  dragVelocity = 0;
  lastMoveTime = event.timeStamp;
}

function onPointerMove(event: PointerEvent) {
  if (!pointers.has(event.pointerId)) return;
  pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
  if (pointers.size > 1) {
    const points = [...pointers.values()];
    const distance = Math.hypot(points[0]!.x - points[1]!.x, points[0]!.y - points[1]!.y);
    if (pinchDistance.value !== undefined) {
      cakeScale.value = Math.max(0.82, Math.min(1.22, cakeScale.value + (distance - pinchDistance.value) * 0.003));
    }
    pinchDistance.value = distance;
    return;
  }
  if (!dragging.value) return;
  const delta = event.clientX - pointerX.value;
  rotation.value += delta * 0.008;
  const elapsed = Math.max(1, event.timeStamp - lastMoveTime);
  dragVelocity = delta / elapsed;
  lastMoveTime = event.timeStamp;
  pointerX.value = event.clientX;
}

function stopDragging(event: PointerEvent) {
  pointers.delete(event.pointerId);
  pinchDistance.value = undefined;
  if (pointers.size === 1) {
    const remaining = [...pointers.values()][0]!;
    dragging.value = true;
    pointerX.value = remaining.x;
    lastMoveTime = event.timeStamp;
    return;
  }
  dragging.value = false;
  if (pointers.size === 0 && !birthday.wished && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    inertiaTween?.kill();
    inertiaTween = gsap.to(rotation, {
      value: rotation.value + dragVelocity * 1.8,
      duration: 0.42,
      ease: "power2.out",
      onComplete: () => rotationTween?.resume(),
    });
  }
}

function wish() {
  if (birthday.wished || wishing.value) return;
  wishing.value = true;
  flameTween?.kill();
  gsap.to(flameScale, {
    value: 0,
    duration: 0.65,
    ease: "power2.out",
    onComplete: () => {
      makeWish();
      void playChime();
      wishing.value = false;
      emit("complete");
    },
  });
}

function lightCandle(index: number) {
  if (litCandles.value.includes(index)) return;
  litCandles.value.push(index);
  void playChime();
  if (litCandles.value.length === candlePositions.length) {
    makeWish();
    emit("complete");
  }
}

function replayCandles() {
  litCandles.value = [];
  birthday.wished = false;
}

function finishDecoration() {
  if (decorationComplete.value) return;
  decorationComplete.value = true;
  emit("complete");
}

function chooseCakeColor(color: string) {
  cakeColor.value = color;
  finishDecoration();
}

function toggleSprinkles() {
  sprinklesEnabled.value = !sprinklesEnabled.value;
  finishDecoration();
}

function toggleFlowers() {
  flowersEnabled.value = !flowersEnabled.value;
  finishDecoration();
}

function replayDecoration() {
  cakeColor.value = decorationColors[0]!;
  sprinklesEnabled.value = true;
  flowersEnabled.value = true;
  decorationComplete.value = false;
}
</script>

<template>
  <section class="cake-section">
    <FloatingBabyPortraits scene="cake" />
    <div
      v-motion
      class="cake-copy"
      :initial="{ opacity: 0, x: -24 }"
      :visible-once="{ opacity: 1, x: 0, transition: { duration: 750 } }"
    >
      <p class="eyebrow">
        {{ gameMode === "candles" ? "GAME 2 · A LITTLE LIGHT" : gameMode === "decorate" ? "GAME 4 · YOUR CAKE, YOUR WAY" : "A WISH, JUST FOR YOU" }}
      </p>
      <h2 v-if="gameMode === 'candles'">Light the candles,<br /><i>little star!</i></h2>
      <h2 v-else-if="gameMode === 'decorate'">Decorate your<br /><i>dream cake!</i></h2>
      <h2 v-else>Make a wish,<br /><i>little star.</i></h2>
      <p class="section-intro">
        <template v-if="gameMode === 'candles'">Touch each candle to light it up. When all three glow, make a wish!</template>
        <template v-else-if="gameMode === 'decorate'">Drag to spin, pinch to zoom, then choose a colour and add sprinkles!</template>
        <template v-else>A little sweetness, a little sparkle, and all the love in the world. Take a moment, close your eyes, and make your very special wish.</template>
      </p>
      <button v-if="gameMode === 'wish'" class="outline-button" type="button" @click="wish">
        <Sparkles :size="16" />
        {{ birthday.wished ? "Your wish is on its way" : wishing ? "Make a wish…" : "Make a Wish ✨" }}
      </button>
      <div v-if="gameMode === 'candles'" class="candle-game-controls">
        <span class="game-control-label">TOUCH THE CANDLES TO LIGHT THEM!</span>
        <div class="candle-touch-buttons">
          <button
            v-for="(position, index) in candlePositions"
            :key="position"
            class="candle-touch-target"
            type="button"
            :disabled="litCandles.includes(index)"
            :aria-label="`Light candle ${index + 1}`"
            :aria-pressed="litCandles.includes(index)"
            @click="lightCandle(index)"
          >{{ litCandles.includes(index) ? "🔥" : "🕯️" }}</button>
        </div>
        <p class="candle-progress" aria-live="polite">{{ litCandles.length }} of 3 candles are glowing</p>
        <p v-if="litCandles.length === 3" class="micro-note wish-message">MAKE A WISH, VEERA! ✨</p>
        <button v-if="litCandles.length === 3" class="game-toggle-button" type="button" @click="replayCandles">Play again ↻</button>
      </div>
      <div v-if="gameMode === 'decorate'" class="cake-decoration-controls">
        <span class="game-control-label">PICK A CAKE COLOUR</span>
        <div class="cake-color-options">
          <button
            v-for="color in decorationColors"
            :key="color"
            class="cake-color-choice"
            :class="{ 'is-selected': cakeColor === color }"
            :style="{ '--choice-color': color }"
            type="button"
            :aria-label="`Choose cake colour ${color}`"
            :aria-pressed="cakeColor === color"
            @click="chooseCakeColor(color)"
          />
        </div>
        <button class="game-toggle-button" type="button" :aria-pressed="sprinklesEnabled" @click="toggleSprinkles">
          {{ sprinklesEnabled ? "✨ Sprinkles on" : "✨ Add sprinkles" }}
        </button>
        <button class="game-toggle-button" type="button" :aria-pressed="flowersEnabled" @click="toggleFlowers">
          {{ flowersEnabled ? "🌸 Flowers on" : "🌸 Add flowers" }}
        </button>
        <span v-if="decorationComplete" class="decoration-done" role="status">Your cake is ready! 🎂</span>
        <button v-if="decorationComplete" class="game-toggle-button" type="button" @click="replayDecoration">Start a new cake ↻</button>
      </div>
      <p v-if="birthday.wished && gameMode === 'wish'" class="micro-note wish-message">
        Happy 3rd birthday, Veera Yazhmathi. May every wish find its way to you.
      </p>
      <p v-else-if="gameMode === 'wish'" class="micro-note">Go on — the candles are waiting just for you.</p>
    </div>
    <div
      ref="cakeStage"
      class="cake-stage"
      :class="{ 'cake-wished': birthday.wished, 'is-dragging': dragging }"
      :style="{ '--game-cake-scale': cakeScale }"
      :data-cake-scale="cakeScale"
      :data-cake-rotation="rotation"
      aria-label="Interactive three-tier birthday cake. Drag to turn it."
      @pointerdown="onPointerDown"
      @pointermove="onPointerMove"
      @pointerup="stopDragging"
      @pointercancel="stopDragging"
    >
      <div class="cake-halo" />
      <TresCanvas class="cake-three" :alpha="true" :camera="cakeCamera" :dpr="[1, 1.35]" shadows>
        <TresAmbientLight :intensity="1.3" />
        <TresDirectionalLight :position="[4, 6, 4]" :intensity="2.1" cast-shadow />
        <TresPointLight :position="[-3, 2, 2]" :intensity="11" color="#c9b8e8" />
        <TresPointLight :position="[3, 3, -3]" :intensity="14" color="#d6b875" />
        <TresGroup :rotation="cakeRotation" :position="[0, -0.72, 0]" :scale="cakeScale">
          <TresGroup
            v-for="tier in [
              { y: 0.2, height: 0.64, radius: 1.18, color: '#d9a0ff' },
              { y: 0.85, height: 0.58, radius: 0.88, color: '#fff9ef' },
              { y: 1.4, height: 0.5, radius: 0.58, color: '#f4c9d5' },
            ]"
            :key="tier.y"
            :position="[0, tier.y, 0]"
          >
            <TresMesh cast-shadow receive-shadow>
              <TresCylinderGeometry :args="[tier.radius, tier.radius, tier.height, 48]" />
              <TresMeshStandardMaterial :color="gameMode === 'decorate' && tier.y === 0.2 ? cakeColor : tier.color" :roughness="0.3" />
            </TresMesh>
            <TresMesh :position="[0, tier.height / 2 + 0.01, 0]">
              <TresCylinderGeometry
                :args="[tier.radius + 0.025, tier.radius + 0.025, 0.06, 48]"
              />
              <TresMeshStandardMaterial color="#f8e2d6" :roughness="0.25" />
            </TresMesh>
            <TresMesh
              :position="[0, -tier.height / 2 + 0.06, 0]"
              :rotation="[Math.PI / 2, 0, 0]"
            >
              <TresTorusGeometry :args="[tier.radius + 0.015, 0.035, 8, 48]" />
              <TresMeshStandardMaterial color="#d6b875" :metalness="0.55" :roughness="0.28" />
            </TresMesh>
          </TresGroup>
          <TresGroup v-for="(x, index) in candlePositions" :key="x" :position="[x, 1.96, 0]">
            <TresMesh>
              <TresCylinderGeometry :args="[0.035, 0.035, 0.34, 12]" />
              <TresMeshStandardMaterial color="#fff4dd" />
            </TresMesh>
            <TresMesh
              v-if="gameMode !== 'candles' ? !birthday.wished : litCandles.includes(index)"
              :position="[0, 0.25, 0]"
              :scale="[flameScale, flameScale * 1.2, flameScale]"
            >
              <TresSphereGeometry :args="[0.055, 12, 12]" />
              <TresMeshBasicMaterial color="#ffe08a" />
            </TresMesh>
          </TresGroup>
          <TresGroup
            v-for="flower in flowersEnabled ? [
              { x: -0.78, y: 0.15, z: 0.75 },
              { x: 0.62, y: 0.17, z: 0.82 },
              { x: 0.58, y: 1.05, z: 0.45 },
            ] : []"
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
          <TresMesh
            v-for="index in gameMode === 'decorate' && sprinklesEnabled ? sprinkleIndices : []"
            :key="`sprinkle-${index}`"
            :position="[
              Math.sin(index * 2.4) * 0.82,
              0.2 + ((index % 7) / 7) * 0.5,
              0.76 + Math.cos(index * 1.7) * 0.12,
            ]"
            :rotation="[0, 0, index % 2 ? 0.7 : -0.7]"
          >
            <TresSphereGeometry :args="[0.035, 8, 8]" />
            <TresMeshBasicMaterial :color="decorationColors[index % decorationColors.length]" />
          </TresMesh>
          <TresMesh :position="[0, 2.35, 0]">
            <TresCylinderGeometry :args="[0.018, 0.018, 0.42, 8]" />
            <TresMeshStandardMaterial color="#d8b36c" :metalness="0.5" />
          </TresMesh>
          <TresMesh :position="[0, 2.57, 0]">
            <TresSphereGeometry :args="[0.16, 24, 24]" />
            <TresMeshStandardMaterial color="#ffe3a2" emissive="#d89f3c" :emissive-intensity="0.8" />
          </TresMesh>
          <TresMesh :geometry="topperGeometry" :position="[0, 2.37, 0.2]">
            <TresMeshStandardMaterial color="#f4d27a" :metalness="0.82" :roughness="0.17" />
          </TresMesh>
        </TresGroup>
      </TresCanvas>
      <span class="cake-topper-text" aria-label="Cake topper: Veera">Veera</span>
      <div class="cake-stage-label"><span>MADE WITH LOVE</span><Heart :size="12" fill="currentColor" /></div>
      <div v-if="birthday.wished" class="wish-sparkle-overlay" aria-hidden="true">✦ ✧ ✦</div>
    </div>
  </section>
</template>
