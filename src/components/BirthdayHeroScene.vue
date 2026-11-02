<script setup lang="ts">
import { TresCanvas } from "@tresjs/core";
import { onMounted, onUnmounted } from "vue";
import { PerspectiveCamera } from "three";

const camera = new PerspectiveCamera(36, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(0, 1.4, 8.5);

function resizeCamera() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
}

onMounted(() => window.addEventListener("resize", resizeCamera));
onUnmounted(() => window.removeEventListener("resize", resizeCamera));
</script>

<template>
  <TresCanvas class="hero-three" clear-color="#21162f" :camera="camera" :dpr="[1, 1.5]" shadows>
    <TresAmbientLight :intensity="1.1" />
    <TresDirectionalLight :position="[4, 6, 4]" :intensity="2.2" cast-shadow />
    <TresPointLight :position="[-3, 2, 2]" :intensity="14" color="#d98bb5" />
    <TresPointLight :position="[3, 3, -3]" :intensity="18" color="#f7cf8e" />
    <TresGroup :position="[0, -0.5, -1.5]">
      <TresMesh :position="[0, 0.1, 0]" cast-shadow>
        <TresBoxGeometry :args="[2.8, 1.8, 1.35]" />
        <TresMeshStandardMaterial color="#f4dce4" :roughness="0.45" />
      </TresMesh>
      <TresMesh :position="[0, 1.1, 0]" cast-shadow>
        <TresConeGeometry :args="[1.45, 1.45, 4]" />
        <TresMeshStandardMaterial color="#8c5c94" :roughness="0.4" />
      </TresMesh>
      <TresGroup v-for="x in [-1.42, 1.42]" :key="x" :position="[x, 0.72, 0]">
        <TresMesh cast-shadow>
          <TresCylinderGeometry :args="[0.38, 0.45, 2.45, 12]" />
          <TresMeshStandardMaterial color="#f8e9e9" :roughness="0.42" />
        </TresMesh>
        <TresMesh :position="[0, 1.47, 0]" cast-shadow>
          <TresConeGeometry :args="[0.57, 1.05, 12]" />
          <TresMeshStandardMaterial color="#d5a96b" :metalness="0.28" :roughness="0.4" />
        </TresMesh>
        <TresMesh :position="[0, 2.07, 0]">
          <TresSphereGeometry :args="[0.11, 12, 12]" />
          <TresMeshStandardMaterial color="#ffe7a4" emissive="#ffc85c" :emissive-intensity="2" />
        </TresMesh>
      </TresGroup>
      <TresMesh :position="[0, -0.1, 0.72]">
        <TresPlaneGeometry :args="[0.52, 1.1]" />
        <TresMeshStandardMaterial color="#78516c" />
      </TresMesh>
      <TresMesh :position="[-0.8, 0.35, 0.69]">
        <TresPlaneGeometry :args="[0.22, 0.38]" />
        <TresMeshStandardMaterial color="#d495a8" emissive="#c37491" :emissive-intensity="0.25" />
      </TresMesh>
      <TresMesh :position="[0.8, 0.35, 0.69]">
        <TresPlaneGeometry :args="[0.22, 0.38]" />
        <TresMeshStandardMaterial color="#d495a8" emissive="#c37491" :emissive-intensity="0.25" />
      </TresMesh>
    </TresGroup>
    <TresGroup :position="[0, -0.9, 0.5]" :scale="0.76">
      <TresMesh :position="[0, 0.2, 0]" cast-shadow>
        <TresCylinderGeometry :args="[1.18, 1.18, 0.64, 48]" />
        <TresMeshStandardMaterial color="#f2aec1" :roughness="0.3" />
      </TresMesh>
      <TresMesh :position="[0, 0.85, 0]" cast-shadow>
        <TresCylinderGeometry :args="[0.88, 0.88, 0.58, 48]" />
        <TresMeshStandardMaterial color="#fff2ed" :roughness="0.3" />
      </TresMesh>
      <TresMesh :position="[0, 1.4, 0]" cast-shadow>
        <TresCylinderGeometry :args="[0.58, 0.58, 0.5, 48]" />
        <TresMeshStandardMaterial color="#f2aec1" :roughness="0.3" />
      </TresMesh>
      <TresMesh :position="[0, 0.54, 0]">
        <TresTorusGeometry :args="[1.2, 0.035, 8, 48]" />
        <TresMeshStandardMaterial color="#d9b36f" :metalness="0.55" :roughness="0.28" />
      </TresMesh>
      <TresMesh :position="[0, 1.15, 0]">
        <TresTorusGeometry :args="[0.9, 0.03, 8, 48]" />
        <TresMeshStandardMaterial color="#d9b36f" :metalness="0.55" :roughness="0.28" />
      </TresMesh>
      <TresMesh :position="[0, 1.68, 0]">
        <TresTorusGeometry :args="[0.6, 0.026, 8, 48]" />
        <TresMeshStandardMaterial color="#d9b36f" :metalness="0.55" :roughness="0.28" />
      </TresMesh>
      <TresGroup v-for="x in [-0.28, 0, 0.28]" :key="x" :position="[x, 1.94, 0]">
        <TresMesh>
          <TresCylinderGeometry :args="[0.035, 0.035, 0.34, 12]" />
          <TresMeshStandardMaterial color="#fff4dd" />
        </TresMesh>
        <TresMesh>
          <TresSphereGeometry :args="[0.055, 12, 12]" />
          <TresMeshBasicMaterial color="#ffe08a" />
        </TresMesh>
      </TresGroup>
    </TresGroup>
    <TresGroup
      v-for="(balloon, index) in [
        { x: -3.4, y: 1.4, color: '#e5b977' },
        { x: 3.2, y: 0.9, color: '#d997aa' },
        { x: 2.5, y: 2.4, color: '#f2d9e3' },
      ]"
      :key="index"
      :position="[balloon.x, balloon.y, -0.2]"
    >
      <TresMesh>
        <TresSphereGeometry :args="[0.34, 28, 28]" />
        <TresMeshPhysicalMaterial
          :color="balloon.color"
          :metalness="0.42"
          :roughness="0.2"
          :clearcoat="0.8"
        />
      </TresMesh>
      <TresMesh :position="[0, -0.66, 0]">
        <TresCylinderGeometry :args="[0.006, 0.006, 0.72, 6]" />
        <TresMeshBasicMaterial color="#d9b875" :transparent="true" :opacity="0.7" />
      </TresMesh>
    </TresGroup>
  </TresCanvas>
</template>
