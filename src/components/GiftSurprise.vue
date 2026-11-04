<script setup lang="ts">
import { Sparkles } from "lucide-vue-next";
import { useBirthdayAnimation } from "../composables/useBirthdayAnimation";
import { useBirthdayAudio } from "../composables/useBirthdayAudio";
import FloatingBabyPortraits from "./FloatingBabyPortraits.vue";
import { useBirthdayStore } from "../stores/birthdayStore";

const birthday = useBirthdayStore();
const { openGift } = useBirthdayAnimation();
const { playChime } = useBirthdayAudio();

function toggleGift() {
  openGift();
  void playChime();
}
</script>

<template>
  <section id="gift" class="gift-section" :class="{ 'gift-revealed': birthday.giftOpen }">
    <FloatingBabyPortraits scene="gift" />
    <div
      v-motion
      class="gift-copy"
      :initial="{ opacity: 0, x: -22 }"
      :visible-once="{ opacity: 1, x: 0, transition: { duration: 750 } }"
    >
      <p class="eyebrow">SEALED WITH A SPARKLE</p>
      <h2>A little something<br /><i>just for you.</i></h2>
      <p class="section-intro">
        There&apos;s a tiny bit of magic tucked inside. Open it when you&apos;re ready, little star.
      </p>
      <button class="text-button" type="button" @click="toggleGift">
        {{ birthday.giftOpen ? "Close your surprise ↑" : "Open your surprise ↓" }}
      </button>
    </div>
    <button
      class="gift-box"
      :class="{ 'is-open': birthday.giftOpen }"
      type="button"
      :aria-label="birthday.giftOpen ? 'Close the surprise gift' : 'Open the surprise gift'"
      :aria-expanded="birthday.giftOpen"
      @click="toggleGift"
    >
      <span class="gift-aura" />
      <span class="gift-spark gift-spark-one">✦</span>
      <span class="gift-spark gift-spark-two">✧</span>
      <span class="gift-lid"><span class="gift-bow" /></span>
      <span class="gift-body"><span class="gift-ribbon" /></span>
      <span class="gift-label"><Sparkles :size="12" /> FOR VEERA</span>
      <span v-if="birthday.giftOpen" class="gift-butterflies" aria-hidden="true">
        <i class="butterfly"><b /><b /><b /><b /></i>
        <span>✦</span>
        <i class="butterfly"><b /><b /><b /><b /></i>
      </span>
    </button>
    <div
      v-if="birthday.giftOpen"
      v-motion
      class="gift-message"
      :initial="{ opacity: 0, y: 20 }"
      :enter="{ opacity: 1, y: 0, transition: { duration: 550 } }"
    >
      <Sparkles :size="16" />
      <p>
        May every little dream in your heart grow into something beautiful. You are loved more than all the
        stars in the sky.
      </p>
      <span>FOREVER YOURS, WITH LOVE</span>
    </div>
    <p v-else class="gift-prompt">A Magical Surprise Is Waiting For You!</p>
  </section>
</template>
