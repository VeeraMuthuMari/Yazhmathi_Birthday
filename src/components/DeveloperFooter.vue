<script setup lang="ts">
import { useClipboard } from "@vueuse/core";
import { Check, Copy, Heart, Linkedin, Mail, Sparkles } from "lucide-vue-next";

const email = "veeramuthumari2@gmail.com";
const { copy, copied } = useClipboard({ copiedDuring: 1800 });
</script>

<template>
  <footer class="developer-footer">
    <div class="developer-footer-glow" aria-hidden="true" />
    <div class="developer-particles" aria-hidden="true">
      <span
        v-for="particle in 12"
        :key="particle"
        :style="{
          '--particle': particle,
          '--left': `${(particle * 37 + 3) % 97}%`,
          '--delay': `${particle * -0.63}s`,
        }"
      />
    </div>
    <div class="developer-footer-content">
      <div class="developer-credit">
        <p class="developer-intro">
          Developed With <Heart class="developer-heart" :size="13" fill="currentColor" /> By
        </p>
        <p class="developer-name">VEERAMUTHUMARI</p>
        <p class="developer-credentials">B.Sc., MCA <span /> Software Engineer</p>
      </div>
      <div class="developer-contact" aria-label="Developer contact links">
        <a
          class="developer-contact-link"
          href="https://www.linkedin.com/in/veera-muthu-mari"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Visit Veeramuthumari on LinkedIn (opens in a new tab)"
        >
          <Linkedin :size="16" />
          <span>LinkedIn</span>
        </a>
        <div class="developer-email">
          <a class="developer-contact-link" :href="`mailto:${email}`" :aria-label="`Email ${email}`">
            <Mail :size="16" />
            <span>{{ email }}</span>
          </a>
          <button
            class="copy-email-button"
            type="button"
            :aria-label="copied ? 'Email copied' : 'Copy email address'"
            :title="copied ? 'Copied!' : 'Copy email address'"
            @click="copy(email)"
          >
            <Check v-if="copied" :size="14" />
            <Copy v-else :size="14" />
            <span class="copy-feedback" aria-live="polite">{{ copied ? "Copied" : "Copy" }}</span>
          </button>
        </div>
      </div>
    </div>
    <div class="developer-separator"><span /><Sparkles :size="12" /><span /></div>
    <p class="developer-copyright">© 2026 Veera Yazhmathi Birthday Celebration. All Rights Reserved.</p>
  </footer>
</template>
