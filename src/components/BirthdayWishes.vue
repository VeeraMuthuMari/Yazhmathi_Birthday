<script setup lang="ts">
import { Heart, Sparkles } from "lucide-vue-next";
</script>

<template>
  <section id="wishes" class="wishes-section">
    <div class="wish-backdrop" />
    <article
      v-motion
      class="wish-card"
      :initial="{ opacity: 0, y: 28, scale: 0.98 }"
      :visible-once="{ opacity: 1, y: 0, scale: 1, transition: { duration: 850 } }"
    >
      <div class="wish-emblem"><Sparkles :size="20" /></div>
      <p class="eyebrow">A LITTLE NOTE FOR YOU</p>
      <h2>A Little Princess,<br /><i>A Million Dreams</i></h2>
      <div class="wish-divider"><span /> ✦ <span /></div>
      <p class="wish-copy">
        Dear Veera Yazhmathi,<br /><br />
        You are a beautiful little blessing who fills every heart with happiness.<br /><br />
        May your world always be filled with endless laughter, magical adventures, beautiful dreams, and
        unconditional love.<br /><br />
        Keep smiling, keep shining, and continue spreading happiness wherever you go.<br /><br />
        You are precious beyond words!<br /><br />
        <i>Happy Birthday, Little Princess!</i>
      </p>
      <div class="wish-signature">With all our love <Heart :size="14" fill="currentColor" /></div>
    </article>
  </section>
</template>
