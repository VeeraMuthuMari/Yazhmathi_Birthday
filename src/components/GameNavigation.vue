<script setup lang="ts">
import { computed, defineAsyncComponent, ref } from "vue";
import { Home, Sparkles } from "lucide-vue-next";
import BirthdayCelebration from "./BirthdayCelebration.vue";

type GameId = "balloons" | "candles" | "stars" | "cake" | "gift" | "celebration";

const emit = defineEmits<{ home: [] }>();
const activeGame = ref<GameId>("balloons");
const completedGames = ref(new Set<GameId>());
const games: { id: Exclude<GameId, "celebration">; label: string; emoji: string }[] = [
  { id: "balloons", label: "Pop balloons", emoji: "🎈" },
  { id: "candles", label: "Light candles", emoji: "🕯️" },
  { id: "stars", label: "Catch stars", emoji: "⭐" },
  { id: "cake", label: "Decorate cake", emoji: "🎂" },
  { id: "gift", label: "Open a gift", emoji: "🎁" },
];
const gameComponents = {
  balloons: defineAsyncComponent(() => import("./BalloonPopGame.vue")),
  candles: defineAsyncComponent(() => import("./CandleLightingGame.vue")),
  stars: defineAsyncComponent(() => import("./MagicStarGame.vue")),
  cake: defineAsyncComponent(() => import("./CakeDecorationGame.vue")),
  gift: defineAsyncComponent(() => import("./GiftSurpriseGame.vue")),
};
const activeGameComponent = computed(() => gameComponents[activeGame.value as Exclude<GameId, "celebration">]);
const allGamesComplete = computed(() => completedGames.value.size === games.length);

function completeActiveGame() {
  if (activeGame.value === "celebration") return;
  const updated = new Set(completedGames.value);
  updated.add(activeGame.value);
  completedGames.value = updated;
  if (updated.size === games.length) activeGame.value = "celebration";
}

function replayAllGames() {
  completedGames.value = new Set();
  activeGame.value = "balloons";
}
</script>

<template>
  <section id="games" class="game-hub" aria-labelledby="game-hub-title">
    <header class="game-hub-header">
      <div>
        <p class="game-kicker">A MAGICAL LITTLE PLAYGROUND</p>
        <h2 id="game-hub-title">Let&apos;s play, Veera!</h2>
        <p>Pick a game. There&apos;s no hurry — play at your own pace.</p>
      </div>
      <button class="game-home-button" type="button" @click="emit('home')">
        <Home :size="19" /> Home
      </button>
    </header>
    <nav class="game-picker" aria-label="Birthday games">
      <button
        v-for="game in games"
        :key="game.id"
        class="game-picker-button"
        :class="{ 'is-active': activeGame === game.id, 'is-complete': completedGames.has(game.id) }"
        type="button"
        :aria-current="activeGame === game.id ? 'page' : undefined"
        @click="activeGame = game.id"
      >
        <span class="game-picker-emoji" aria-hidden="true">{{ game.emoji }}</span>
        <span>{{ game.label }}</span>
        <span v-if="completedGames.has(game.id)" class="game-check" aria-label="Completed">✓</span>
      </button>
      <button
        v-if="allGamesComplete"
        class="game-picker-button celebration-picker"
        :class="{ 'is-active': activeGame === 'celebration' }"
        type="button"
        :aria-current="activeGame === 'celebration' ? 'page' : undefined"
        @click="activeGame = 'celebration'"
      >
        <span class="game-picker-emoji" aria-hidden="true">🎉</span>
        <span>Celebrate!</span>
      </button>
    </nav>
    <div class="game-progress-wrap" aria-live="polite">
      <div class="game-progress-track" role="progressbar" :aria-valuenow="completedGames.size" aria-valuemin="0" aria-valuemax="5" aria-label="Games completed">
        <span :style="{ width: `${(completedGames.size / games.length) * 100}%` }" />
      </div>
      <span>{{ completedGames.size }} of {{ games.length }} magical games</span>
    </div>
    <div class="game-stage">
      <Suspense v-if="activeGame === 'celebration'">
        <BirthdayCelebration @replay="replayAllGames" />
        <template #fallback><div class="game-loading">The birthday magic is getting ready…</div></template>
      </Suspense>
      <Suspense v-else>
        <component :is="activeGameComponent" :key="activeGame" @complete="completeActiveGame" />
        <template #fallback>
          <div class="game-loading"><Sparkles :size="24" /> Getting your game ready…</div>
        </template>
      </Suspense>
    </div>
  </section>
</template>
