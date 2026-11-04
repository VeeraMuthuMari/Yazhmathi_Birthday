<script setup lang="ts">
import { Heart, Sparkles } from "lucide-vue-next";
import FloatingBabyPortraits from "./FloatingBabyPortraits.vue";
</script>

<template>
  <section id="wishes" class="wishes-section">
    <div class="wish-backdrop" />
    <FloatingBabyPortraits scene="wishes" />
    <article
      v-motion
      class="wish-card"
      :initial="{ opacity: 0, y: 28, scale: 0.98 }"
      :visible-once="{ opacity: 1, y: 0, scale: 1, transition: { duration: 850 } }"
    >
      <div class="wish-emblem"><Sparkles :size="20" /></div>
      <p class="eyebrow">A LITTLE PRINCESS, A MILLION DREAMS</p>
      <h2>A Little Princess,<br /><i>A Million Dreams</i></h2>
      <div class="wish-divider"><span /> ✦ <span /></div>
      <p class="wish-copy">
        Dear Veera Yazhmathi,<br /><br />
        Three beautiful years of smiles, laughter, love, and unforgettable memories.<br /><br />
        You are our little sunshine, our precious blessing, and the sweetest reason behind countless happy
        moments.<br /><br />
        May your life always be filled with beautiful dreams, endless happiness, wonderful adventures, and
        unconditional love.<br /><br />
        Keep smiling, little star. The world is waiting for your beautiful sparkle!<br /><br />
        <i>Happy 3rd Birthday!</i>
      </p>
      <div class="wish-signature">With all our love <Heart :size="14" fill="currentColor" /></div>
    </article>
  </section>
</template>
