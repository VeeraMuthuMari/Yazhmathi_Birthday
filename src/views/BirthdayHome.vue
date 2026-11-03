<script setup lang="ts">
import { onMounted, onUnmounted } from "vue";
import Lenis from "lenis";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Heart } from "lucide-vue-next";
import BirthdayHero from "../components/BirthdayHero.vue";
import GameNavigation from "../components/GameNavigation.vue";
import DeveloperFooter from "../components/DeveloperFooter.vue";
import PhotoViewer from "../components/PhotoViewer.vue";
import BackgroundMusic from "../components/BackgroundMusic.vue";

let smoothScroll: Lenis | undefined;

onMounted(() => {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  smoothScroll = new Lenis({
    autoRaf: true,
    duration: 1.15,
    smoothWheel: true,
    wheelMultiplier: 0.88,
    anchors: true,
  });
  smoothScroll.on("scroll", ScrollTrigger.update);
  requestAnimationFrame(() => ScrollTrigger.refresh());
});

onUnmounted(() => {
  smoothScroll?.destroy();
  smoothScroll = undefined;
});

function enterExperience() {
  if (smoothScroll) {
    smoothScroll.scrollTo("#games", { duration: 1.25 });
  } else {
    const behavior = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";
    document.getElementById("games")?.scrollIntoView({ behavior });
  }
}

function goHome() {
  if (smoothScroll) {
    smoothScroll.scrollTo("#home", { duration: 0.9 });
  } else {
    document.getElementById("home")?.scrollIntoView({ behavior: "smooth" });
  }
}
</script>

<template>
  <main class="min-h-screen birthday-page">
    <div class="birthday-content">
      <BirthdayHero @enter="enterExperience" />
      <GameNavigation @home="goHome" />
      <footer class="footer">
        <div class="footer-heart"><Heart :size="20" fill="currentColor" /></div>
        <p>
          Made With Endless Love <Heart class="inline-heart" :size="13" fill="currentColor" /> For Our Little
          Star
        </p>
        <div class="footer-name">VEERA YAZHMATHI</div>
        <div class="footer-date">07 NOVEMBER 2026</div>
        <div class="footer-rule"><span /> A LITTLE WORLD, MADE FOR YOU <span /></div>
      </footer>
      <DeveloperFooter />
    </div>
    <PhotoViewer />
    <BackgroundMusic />
  </main>
</template>
