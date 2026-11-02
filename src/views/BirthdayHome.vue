<script setup lang="ts">
import { defineAsyncComponent } from "vue";
import { Heart } from "lucide-vue-next";
import BirthdayHero from "../components/BirthdayHero.vue";
import BirthdayCountdown from "../components/BirthdayCountdown.vue";
import BirthdayWishes from "../components/BirthdayWishes.vue";
import GiftSurprise from "../components/GiftSurprise.vue";
import CelebrationSection from "../components/CelebrationSection.vue";
import DeveloperFooter from "../components/DeveloperFooter.vue";

const BirthdayCake3D = defineAsyncComponent(() => import("../components/BirthdayCake3D.vue"));

function enterExperience() {
  document.getElementById("countdown")?.scrollIntoView({ behavior: "smooth" });
}
</script>

<template>
  <main class="min-h-screen">
    <BirthdayHero @enter="enterExperience" />
    <BirthdayCountdown />
    <Suspense>
      <BirthdayCake3D />
      <template #fallback>
        <section id="cake" class="cake-section cake-loading-section">
          <div class="cake-copy">
            <p class="eyebrow">A WISH, JUST FOR YOU</p>
            <h2>Make a wish,<br /><i>little star.</i></h2>
          </div>
          <div class="cake-loading">Preparing a little magic…</div>
        </section>
      </template>
    </Suspense>
    <BirthdayWishes />
    <GiftSurprise />
    <CelebrationSection />
    <footer class="footer">
      <div class="footer-heart"><Heart :size="20" fill="currentColor" /></div>
      <p>
        Made With Endless Love <Heart class="inline-heart" :size="13" fill="currentColor" /> For Our Little
        Princess
      </p>
      <div class="footer-name">VEERA YAZHMATHI</div>
      <div class="footer-date">11 NOVEMBER 2023</div>
      <div class="footer-rule"><span /> A LITTLE WORLD, MADE FOR YOU <span /></div>
    </footer>
    <DeveloperFooter />
  </main>
</template>
