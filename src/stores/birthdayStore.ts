import { defineStore } from "pinia";
import { ref } from "vue";

export const useBirthdayStore = defineStore("birthday", () => {
  const entered = ref(false);
  const wished = ref(false);
  const giftOpen = ref(false);
  const soundOn = ref(false);

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

  return { entered, wished, giftOpen, soundOn, enter, makeWish, toggleGift, setSoundOn };
});
