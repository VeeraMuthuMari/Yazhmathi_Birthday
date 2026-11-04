<script setup lang="ts">
import { TresCanvas } from "@tresjs/core";
import { usePreferredReducedMotion } from "@vueuse/core";
import gsap from "gsap";
import { ExtrudeGeometry, PerspectiveCamera, Shape } from "three";
import { onMounted, onUnmounted, reactive } from "vue";

const reducedMotion = usePreferredReducedMotion();
const cakeMotion = reactive({ rotation: 0, lift: 0 });
const camera = new PerspectiveCamera(35, 1, 0.1, 100);
camera.position.set(0, 1.8, 7.8);
const numberThreeShape = new Shape();
numberThreeShape.moveTo(-0.2, 0.4);
numberThreeShape.bezierCurveTo(0.18, 0.52, 0.38, 0.3, 0.07, 0.03);
numberThreeShape.bezierCurveTo(0.42, -0.19, 0.22, -0.5, -0.2, -0.38);
numberThreeShape.lineTo(-0.2, -0.22);
numberThreeShape.bezierCurveTo(0.02, -0.28, 0.18, -0.2, 0.12, -0.07);
numberThreeShape.bezierCurveTo(0.08, 0.05, -0.04, 0.08, -0.19, 0.07);
numberThreeShape.lineTo(-0.19, 0.23);
numberThreeShape.bezierCurveTo(0.02, 0.2, 0.16, 0.24, 0.13, 0.34);
numberThreeShape.bezierCurveTo(0.1, 0.44, -0.04, 0.44, -0.2, 0.34);
numberThreeShape.closePath();
const numberThreeGeometry = new ExtrudeGeometry(numberThreeShape, {
  depth: 0.08,
  bevelEnabled: true,
  bevelSegments: 3,
  steps: 1,
  bevelSize: 0.025,
  bevelThickness: 0.025,
});
let cakeAnimation: gsap.core.Timeline | undefined;

onMounted(() => {
  if (reducedMotion.value === "reduce") return;
  cakeAnimation = gsap
    .timeline({ repeat: -1 })
    .to(cakeMotion, { rotation: Math.PI * 2, duration: 24, ease: "none" }, 0)
    .to(cakeMotion, { lift: 0.07, duration: 2, repeat: 5, yoyo: true, ease: "sine.inOut" }, 0);
});

onUnmounted(() => cakeAnimation?.kill());
</script>

<template>
  <div class="hero-cake-scene" aria-label="Three-dimensional royal birthday cake">
    <TresCanvas class="hero-cake-canvas" :alpha="true" :camera="camera" :dpr="[1, 1.35]" shadows>
      <TresAmbientLight :intensity="1.8" />
      <TresDirectionalLight :position="[4, 7, 5]" :intensity="3.2" cast-shadow />
      <TresPointLight :position="[-3, 3, 2]" :intensity="18" color="#b99aff" />
      <TresPointLight :position="[3, 4, -2]" :intensity="22" color="#f4d27a" />
      <TresGroup
        :rotation="[0, cakeMotion.rotation, 0]"
        :position="[0, -0.8 + cakeMotion.lift, 0]"
        :scale="1.02"
      >
        <TresGroup
          v-for="tier in [
            { y: 0.25, height: 0.72, radius: 1.45, color: '#fffdf8' },
            { y: 1.03, height: 0.63, radius: 1.08, color: '#d9a0ff' },
            { y: 1.73, height: 0.58, radius: 0.72, color: '#f4c9d5' },
          ]"
          :key="tier.y"
          :position="[0, tier.y, 0]"
        >
          <TresMesh cast-shadow receive-shadow>
            <TresCylinderGeometry :args="[tier.radius, tier.radius * 1.035, tier.height, 64, 1]" />
            <TresMeshPhysicalMaterial
              :color="tier.color"
              :roughness="0.28"
              :metalness="0.035"
              :clearcoat="0.42"
              :clearcoat-roughness="0.2"
            />
          </TresMesh>
          <TresMesh :position="[0, tier.height / 2 - 0.05, 0]" :rotation="[Math.PI / 2, 0, 0]">
            <TresTorusGeometry :args="[tier.radius * 0.98, 0.08, 12, 64]" />
            <TresMeshStandardMaterial :color="tier.color" :roughness="0.22" />
          </TresMesh>
          <TresMesh :position="[0, -tier.height / 2 + 0.07, 0]" :rotation="[Math.PI / 2, 0, 0]">
            <TresTorusGeometry :args="[tier.radius * 1.015, 0.035, 10, 64]" />
            <TresMeshStandardMaterial color="#f4d27a" :metalness="0.78" :roughness="0.2" />
          </TresMesh>
          <TresMesh :position="[0, -tier.height / 2 + 0.14, 0]" :rotation="[Math.PI / 2, 0, 0]">
            <TresTorusGeometry :args="[tier.radius * 1.018, 0.018, 8, 64]" />
            <TresMeshStandardMaterial color="#fff0bd" :metalness="0.65" :roughness="0.22" />
          </TresMesh>
        </TresGroup>

        <TresGroup
          v-for="tier in [
            { y: 0.25, radius: 1.45, count: 16 },
            { y: 1.03, radius: 1.08, count: 13 },
            { y: 1.73, radius: 0.72, count: 10 },
          ]"
          :key="`pearls-${tier.y}`"
        >
          <TresMesh
            v-for="index in tier.count"
            :key="`${tier.y}-${index}`"
            :position="[
              Math.cos((index / tier.count) * Math.PI * 2) * tier.radius,
              tier.y - 0.08,
              Math.sin((index / tier.count) * Math.PI * 2) * tier.radius,
            ]"
          >
            <TresSphereGeometry :args="[0.042, 12, 12]" />
            <TresMeshPhysicalMaterial color="#fff2d5" :metalness="0.48" :roughness="0.18" />
          </TresMesh>
        </TresGroup>

        <TresGroup
          v-for="flower in [
            { x: -0.82, y: 0.42, z: 0.97 },
            { x: 0.67, y: 0.38, z: 1.08 },
            { x: -0.5, y: 1.23, z: 0.78 },
            { x: 0.47, y: 1.25, z: 0.82 },
            { x: 0, y: 1.99, z: 0.65 },
          ]"
          :key="`${flower.x}-${flower.y}`"
          :position="[flower.x, flower.y, flower.z]"
        >
          <TresMesh
            v-for="petal in 5"
            :key="petal"
            :position="[
              Math.cos(((petal - 1) / 5) * Math.PI * 2) * 0.1,
              Math.sin(((petal - 1) / 5) * Math.PI * 2) * 0.1,
              0,
            ]"
          >
            <TresSphereGeometry :args="[0.115, 14, 14]" />
            <TresMeshStandardMaterial :color="petal % 2 ? '#fff1f5' : '#f7d8e6'" :roughness="0.3" />
          </TresMesh>
          <TresMesh>
            <TresSphereGeometry :args="[0.06, 14, 14]" />
            <TresMeshStandardMaterial color="#f4d27a" :metalness="0.58" :roughness="0.2" />
          </TresMesh>
        </TresGroup>

        <TresGroup v-for="x in [-0.32, 0, 0.32]" :key="`candle-${x}`" :position="[x, 2.18, 0]">
          <TresMesh>
            <TresCylinderGeometry :args="[0.045, 0.055, 0.46, 16]" />
            <TresMeshPhysicalMaterial color="#fffdf8" :roughness="0.18" :clearcoat="0.8" />
          </TresMesh>
          <TresMesh :position="[0, 0.29, 0]">
            <TresSphereGeometry :args="[0.075, 16, 16]" />
            <TresMeshBasicMaterial color="#ffe7a0" />
          </TresMesh>
          <TresPointLight :position="[0, 0.38, 0.08]" :intensity="1.4" color="#ffc75f" :distance="1.8" />
        </TresGroup>
        <TresMesh :geometry="numberThreeGeometry" :position="[0, 2.46, 0.12]">
          <TresMeshStandardMaterial color="#f4d27a" :metalness="0.8" :roughness="0.17" />
        </TresMesh>
      </TresGroup>
    </TresCanvas>
    <span class="hero-cake-name">VEERA</span>
    <span class="hero-cake-caption">A LITTLE CAKE, MADE WITH LOVE</span>
  </div>
</template>
