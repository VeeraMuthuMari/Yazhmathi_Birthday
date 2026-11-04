<script setup lang="ts">
import { useBirthdayCountdown } from "../composables/useBirthdayCountdown";
import FloatingBabyPortraits from "./FloatingBabyPortraits.vue";

const { state } = useBirthdayCountdown();
const units = ["days", "hours", "minutes", "seconds"] as const;
</script>

<template>
  <section id="countdown" class="countdown-section">
    <FloatingBabyPortraits scene="countdown" />
    <div class="section-glow" />
    <div class="section-heading">
      <p class="eyebrow">A DATE WRITTEN IN STARDUST</p>
      <h2>Counting down to <i>your day</i></h2>
      <p class="section-intro">A little more magic, a little more wonder — the sweetest day is on its way.</p>
    </div>
    <div class="countdown-wrap">
      <p v-if="state.status === 'countdown'" class="eyebrow">THE MAGIC BEGINS IN</p>
      <div v-if="state.status === 'countdown'" class="countdown-grid" aria-live="polite">
        <div
          v-for="(unit, index) in units"
          :key="unit"
          v-motion
          class="countdown-card"
          :initial="{ opacity: 0, y: 18, scale: 0.96 }"
          :visible-once="{ opacity: 1, y: 0, scale: 1, transition: { delay: index * 100, duration: 650 } }"
        >
          <span class="count-value">{{ String(state.values[unit]).padStart(2, "0") }}</span>
          <span class="count-label">{{ unit }}</span>
        </div>
      </div>
      <p
        v-else-if="state.status === 'today'"
        v-motion
        class="birthday-today"
        :initial="{ opacity: 0, y: 12 }"
        :enter="{ opacity: 1, y: 0, transition: { duration: 700 } }"
        aria-live="polite"
      >
        It&apos;s Veera Yazhmathi&apos;s Special Day!
      </p>
      <p
        v-else
        v-motion
        class="birthday-today memory-message"
        :initial="{ opacity: 0, y: 12 }"
        :enter="{ opacity: 1, y: 0, transition: { duration: 700 } }"
      >
        The magic of your special day stays with us all year long, Veera.
      </p>
    </div>
    <div class="date-note">
      <span class="gold-dot" /> NOVEMBER 7 <span class="gold-dot" /> EVERY YEAR, FOREVER
    </div>
  </section>
</template>
