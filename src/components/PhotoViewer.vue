<script setup lang="ts">
import { onBeforeUnmount, watch } from "vue";
import { useEventListener } from "@vueuse/core";
import { ArrowLeft, ArrowRight, X } from "lucide-vue-next";
import { babyPhotos } from "../data/babyPhotos";
import { useBirthdayStore } from "../stores/birthdayStore";

const birthday = useBirthdayStore();
const birthdayPhotosCount = babyPhotos.length;
let previousOverflow = "";

watch(
  () => Boolean(birthday.activePhoto),
  (isOpen, wasOpen) => {
    if (isOpen && !wasOpen) {
      previousOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
    } else if (!isOpen && wasOpen) {
      document.body.style.overflow = previousOverflow;
    }
  },
);

function onKeydown(event: KeyboardEvent) {
  if (!birthday.activePhoto) return;
  if (event.key === "Escape") birthday.closePhoto();
  if (event.key === "ArrowLeft") birthday.stepPhoto(-1);
  if (event.key === "ArrowRight") birthday.stepPhoto(1);
}

useEventListener(window, "keydown", onKeydown);

onBeforeUnmount(() => {
  document.body.style.overflow = previousOverflow;
});
</script>

<template>
  <Teleport to="body">
    <Transition name="photo-viewer">
      <div
        v-if="birthday.activePhoto"
        class="photo-viewer-backdrop"
        role="dialog"
        aria-modal="true"
        :aria-label="`Photo ${birthday.activePhotoIndex + 1} of ${birthdayPhotosCount}`"
        @click.self="birthday.closePhoto"
      >
        <button
          class="photo-viewer-close"
          type="button"
          aria-label="Close photograph"
          @click="birthday.closePhoto"
        >
          <X :size="21" />
        </button>
        <button
          v-if="birthdayPhotosCount > 1"
          class="photo-viewer-nav photo-viewer-prev"
          type="button"
          aria-label="Previous photograph"
          @click="birthday.stepPhoto(-1)"
        >
          <ArrowLeft :size="22" />
        </button>
        <figure class="photo-viewer-display">
          <img
            :src="birthday.activePhoto.src"
            :alt="birthday.activePhoto.alt"
            decoding="async"
            fetchpriority="high"
          />
          <figcaption>
            <div class="photo-viewer-credit">
              <span>{{
                birthday.activePhoto.isDummy ? "LICENSED SAMPLE · NOT VEERA" : "VEERA YAZHMATHI"
              }}</span>
              <a
                v-if="birthday.activePhoto.credit"
                :href="birthday.activePhoto.credit.sourceUrl"
                target="_blank"
                rel="noopener noreferrer"
              >
                {{ birthday.activePhoto.credit.creator }} · {{ birthday.activePhoto.credit.license }}
              </a>
            </div>
            <span>{{ String(birthday.activePhotoIndex + 1).padStart(2, "0") }}</span>
          </figcaption>
        </figure>
        <button
          v-if="birthdayPhotosCount > 1"
          class="photo-viewer-nav photo-viewer-next"
          type="button"
          aria-label="Next photograph"
          @click="birthday.stepPhoto(1)"
        >
          <ArrowRight :size="22" />
        </button>
      </div>
    </Transition>
  </Teleport>
</template>
