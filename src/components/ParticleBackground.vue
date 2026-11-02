<script setup lang="ts">
import { computed } from "vue";
import { usePreferredReducedMotion } from "@vueuse/core";

const props = withDefaults(defineProps<{ count?: number; variant?: "hero" | "celebration" }>(), {
  count: 28,
  variant: "hero",
});
const prefersReducedMotion = usePreferredReducedMotion();
const particles = computed(() =>
  Array.from(
    { length: prefersReducedMotion.value === "reduce" ? Math.min(props.count, 6) : props.count },
    (_, index) => ({
      id: index,
      left: (index * 61 + 5) % 96,
      top: (index * 37 + 8) % 90,
    }),
  ),
);
const petals = computed(() =>
  Array.from({ length: prefersReducedMotion.value === "reduce" ? 0 : 10 }, (_, index) => ({
    id: index,
    left: (index * 43 + 11) % 94,
  })),
);
</script>

<template>
  <div class="particle-field" :class="`particle-field-${variant}`" aria-hidden="true">
    <span
      v-for="particle in particles"
      :key="particle.id"
      class="hero-speck"
      :style="{ '--i': particle.id, '--left': `${particle.left}%`, '--top': `${particle.top}%` }"
    />
    <template v-if="variant === 'hero'">
      <span
        v-for="petal in petals"
        :key="`petal-${petal.id}`"
        class="falling-petal"
        :style="{ '--i': petal.id, '--left': `${petal.left}%` }"
      />
    </template>
  </div>
</template>
