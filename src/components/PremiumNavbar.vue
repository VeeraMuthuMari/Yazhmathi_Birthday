<script setup lang="ts">
import { Sparkles } from "lucide-vue-next";
import BackgroundMusic from "./BackgroundMusic.vue";
</script>

<template>
  <header class="topbar">
    <a class="brand" href="#home" aria-label="Veera's birthday home">
      <span class="brand-mark"><Sparkles :size="14" /></span>
      <span>VEERA&apos;S LITTLE WORLD</span>
    </a>
    <nav class="nav-links" aria-label="Main navigation">
      <a href="#countdown">The Day</a>
      <a href="#cake">Make a Wish</a>
      <a href="#wishes">A Little Note</a>
    </nav>
    <BackgroundMusic />
  </header>
</template>
