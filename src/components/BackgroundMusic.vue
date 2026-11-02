<script setup lang="ts">
import { AudioLines, VolumeX } from "lucide-vue-next";
import { useBirthdayStore } from "../stores/birthdayStore";
import { useBirthdayAudio } from "../composables/useBirthdayAudio";

const birthday = useBirthdayStore();
const { toggleMusic } = useBirthdayAudio();
</script>

<template>
  <button
    class="sound-button"
    type="button"
    :aria-label="birthday.soundOn ? 'Turn music off' : 'Turn music on'"
    @click="toggleMusic"
  >
    <AudioLines v-if="birthday.soundOn" :size="16" />
    <VolumeX v-else :size="16" />
    <span>{{ birthday.soundOn ? "SOUND ON" : "SOUND OFF" }}</span>
  </button>
</template>
