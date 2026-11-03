<script setup lang="ts">
import { babyPhotoCollections } from "../data/babyPhotos";
import { useBirthdayStore } from "../stores/birthdayStore";
import { usePreferredReducedMotion } from "@vueuse/core";

type PhotoScene = keyof typeof babyPhotoCollections;

const props = defineProps<{ scene: PhotoScene }>();
const birthday = useBirthdayStore();
const reducedMotion = usePreferredReducedMotion();
const photos = babyPhotoCollections[props.scene];

function movePortraits(event: PointerEvent) {
  if (event.pointerType !== "mouse" || reducedMotion.value === "reduce") return;
  const world = event.currentTarget;
  if (!(world instanceof HTMLElement)) return;
  const bounds = world.getBoundingClientRect();
  const x = (event.clientX - bounds.left) / bounds.width - 0.5;
  const y = (event.clientY - bounds.top) / bounds.height - 0.5;

  world.querySelectorAll<HTMLElement>(".floating-portrait").forEach((portrait, index) => {
    const depth = index + 1;
    portrait.style.setProperty("--parallax-x", `${x * depth * -18}px`);
    portrait.style.setProperty("--parallax-y", `${y * depth * -13}px`);
  });
}

function resetPortraits(event: PointerEvent) {
  const world = event.currentTarget;
  if (!(world instanceof HTMLElement)) return;
  world.querySelectorAll<HTMLElement>(".floating-portrait").forEach((portrait) => {
    portrait.style.setProperty("--parallax-x", "0px");
    portrait.style.setProperty("--parallax-y", "0px");
  });
}
</script>

<template>
  <div
    class="floating-portrait-world"
    :class="[
      `portrait-world-${scene}`,
      { 'portrait-world-revealed': scene === 'gift' && birthday.giftOpen },
    ]"
    aria-label="Floating baby photographs"
    @pointermove="movePortraits"
    @pointerleave="resetPortraits"
  >
    <button
      v-for="(photo, index) in photos"
      :key="`${scene}-${photo.id}`"
      class="floating-portrait"
      :class="`floating-portrait-${index + 1}`"
      type="button"
      :aria-label="`Open ${photo.alt}`"
      @click="birthday.openPhoto(photo.id)"
    >
      <img
        :src="photo.src"
        :alt="photo.alt"
        :loading="scene === 'hero' ? 'eager' : 'lazy'"
        :fetchpriority="scene === 'hero' && index === 0 ? 'high' : 'auto'"
        decoding="async"
      />
      <span class="portrait-photo-note">{{
        photo.isDummy ? "SAMPLE PHOTO" : "VEERA YAZHMATHI"
      }}</span>
    </button>
  </div>
</template>
