<script setup lang="ts">
import { Music2, Pause, Play } from "lucide-vue-next";
import { useBirthdayStore } from "../stores/birthdayStore";
import { useBirthdayAudio } from "../composables/useBirthdayAudio";

const birthday = useBirthdayStore();
const { toggleMusic } = useBirthdayAudio();
</script>

<template>
  <button
    class="birthday-song-player"
    type="button"
    :aria-label="birthday.soundOn ? 'Pause birthday song' : 'Play birthday song'"
    :aria-pressed="birthday.soundOn"
    @click="toggleMusic"
  >
    <span class="birthday-song-icon">
      <Music2 :size="18" />
    </span>
    <span class="birthday-song-copy">
      <span class="birthday-song-title">A little birthday song</span>
      <span class="birthday-song-status">{{ birthday.soundOn ? "NOW PLAYING" : "TAP TO PLAY" }}</span>
    </span>
    <span class="birthday-song-action" aria-hidden="true">
      <Pause v-if="birthday.soundOn" :size="15" />
      <Play v-else :size="15" />
    </span>
  </button>
</template>
