<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";
import { Camera } from "lucide-vue-next";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePreferredReducedMotion } from "@vueuse/core";
import { babyPhotos } from "../data/babyPhotos";
import { useBirthdayStore } from "../stores/birthdayStore";

const birthday = useBirthdayStore();
const memoryPhotos = babyPhotos;
const memoryScene = ref<HTMLElement | null>(null);
const prefersReducedMotion = usePreferredReducedMotion();
let revealTween: gsap.core.Tween | undefined;

gsap.registerPlugin(ScrollTrigger);

onMounted(() => {
  const images = memoryScene.value?.querySelectorAll(".memory-photo");
  if (!images?.length || prefersReducedMotion.value === "reduce") return;

  revealTween = gsap.fromTo(
    images,
    { autoAlpha: 0, y: 30, scale: 0.97 },
    {
      autoAlpha: 1,
      y: 0,
      scale: 1,
      duration: 0.9,
      stagger: 0.12,
      ease: "power2.out",
      scrollTrigger: { trigger: memoryScene.value, start: "top 80%", once: true },
    },
  );
});

onBeforeUnmount(() => {
  revealTween?.scrollTrigger?.kill();
  revealTween?.kill();
});
</script>

<template>
  <section id="gallery" class="gallery-section">
    <div class="gallery-heading">
      <p class="eyebrow">THE LITTLE THINGS WE TREASURE</p>
      <h2>Her world, in a thousand<br /><i>beautiful little moments.</i></h2>
      <p class="section-intro">
        A few little windows into the love, laughter, and wonder that make each day feel like magic.
      </p>
      <p v-if="memoryPhotos.some((photo) => photo.isDummy)" class="sample-photo-notice">
        Licensed illustrative photographs for design preview — not photographs of Veera.
      </p>
    </div>
    <div v-if="memoryPhotos.length" ref="memoryScene" class="memory-panorama">
      <button
        v-for="(photo, index) in memoryPhotos"
        :key="photo.id"
        class="memory-photo"
        type="button"
        :class="`memory-photo-${index + 1}`"
        :aria-label="`Open ${photo.alt}`"
        @click="birthday.openPhoto(photo.id)"
      >
        <img :src="photo.src" :alt="photo.alt" loading="lazy" decoding="async" />
        <span class="memory-photo-caption" aria-hidden="true">{{ String(index + 1).padStart(2, "0") }}</span>
      </button>
    </div>
    <div v-else class="memory-empty">
      <Camera :size="20" />
      <span>Add up to ten family photographs to <code>src/assets/images/baby/dummy/</code>.</span>
    </div>
  </section>
</template>
