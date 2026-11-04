<script setup lang="ts">
import { Sparkles } from "lucide-vue-next";
</script>

<template>
  <header class="topbar">
    <a class="brand" href="#home" aria-label="Veera's birthday home">
      <span class="brand-mark"><Sparkles :size="14" /></span>
      <span>VEERA&apos;S LITTLE WORLD</span>
    </a>
    <nav class="nav-links" aria-label="Main navigation">
      <a href="#games">Play the games</a>
    </nav>
  </header>
</template>
