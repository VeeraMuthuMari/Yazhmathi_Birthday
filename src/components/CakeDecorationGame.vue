<script setup lang="ts">
import BirthdayCake3D from "./BirthdayCake3D.vue";

const emit = defineEmits<{ complete: [] }>();
</script>

<template>
  <BirthdayCake3D game-mode="decorate" @complete="emit('complete')" />
</template>
