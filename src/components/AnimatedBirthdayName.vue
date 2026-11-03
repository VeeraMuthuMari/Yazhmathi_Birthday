<script setup lang="ts">
import { ref } from "vue";
import { useBirthdayAudio } from "../composables/useBirthdayAudio";

const { playSoundEffect } = useBirthdayAudio();
const animationKey = ref(0);
const words = ["VEERA", "YAZHMATHI"];

function celebrateName() {
  animationKey.value += 1;
  void playSoundEffect("sparkle");
}
</script>

<template>
  <button
    class="animated-birthday-name"
    type="button"
    aria-label="VEERA YAZHMATHI. Touch to make the letters sparkle."
    @click="celebrateName"
  >
    <span v-for="word in words" :key="`${word}-${animationKey}`" class="animated-name-line">
      <span
        v-for="(letter, index) in word"
        :key="`${index}-${animationKey}`"
        class="animated-name-letter"
        :style="{ '--letter-index': index }"
        aria-hidden="true"
      >{{ letter }}</span>
    </span>
    <span class="name-sparkle name-sparkle-one" aria-hidden="true">✦</span>
    <span class="name-sparkle name-sparkle-two" aria-hidden="true">✧</span>
  </button>
</template>
