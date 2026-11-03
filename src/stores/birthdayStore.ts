import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { babyPhotos } from "../data/babyPhotos";

export const useBirthdayStore = defineStore("birthday", () => {
  const entered = ref(false);
  const wished = ref(false);
  const giftOpen = ref(false);
  const soundOn = ref(false);
  const selectedPhotoId = ref<string | null>(null);
  const activePhotoIndex = computed(() =>
    babyPhotos.findIndex((photo) => photo.id === selectedPhotoId.value),
  );
  const activePhoto = computed(() => babyPhotos[activePhotoIndex.value] ?? null);

  function enter() {
    entered.value = true;
  }

  function makeWish() {
    wished.value = true;
  }

  function toggleGift() {
    giftOpen.value = !giftOpen.value;
  }

  function setSoundOn(value: boolean) {
    soundOn.value = value;
  }

  function openPhoto(photoId: string) {
    if (babyPhotos.some((photo) => photo.id === photoId)) selectedPhotoId.value = photoId;
  }

  function closePhoto() {
    selectedPhotoId.value = null;
  }

  function stepPhoto(direction: -1 | 1) {
    if (activePhotoIndex.value < 0 || babyPhotos.length < 2) return;
    const nextIndex = (activePhotoIndex.value + direction + babyPhotos.length) % babyPhotos.length;
    selectedPhotoId.value = babyPhotos[nextIndex]?.id ?? null;
  }

  return {
    entered,
    wished,
    giftOpen,
    soundOn,
    selectedPhotoId,
    activePhoto,
    activePhotoIndex,
    enter,
    makeWish,
    toggleGift,
    setSoundOn,
    openPhoto,
    closePhoto,
    stepPhoto,
  };
});
