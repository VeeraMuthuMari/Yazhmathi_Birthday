import { useIntervalFn } from "@vueuse/core";
import { ref } from "vue";

type CountdownValues = { days: number; hours: number; minutes: number; seconds: number };
type CountdownState =
  { status: "countdown"; values: CountdownValues } | { status: "today" } | { status: "memory" };

const birthday = new Date(2026, 10, 7);
const dayMilliseconds = 86_400_000;

function calculateCountdown(): CountdownState {
  const now = new Date();
  const birthdayDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const targetDay = new Date(birthday.getFullYear(), birthday.getMonth(), birthday.getDate());
  if (birthdayDay.getTime() === targetDay.getTime()) return { status: "today" };
  if (birthdayDay.getTime() > targetDay.getTime()) return { status: "memory" };

  const remaining = targetDay.getTime() - now.getTime();
  return {
    status: "countdown",
    values: {
      days: Math.floor(remaining / dayMilliseconds),
      hours: Math.floor((remaining / 3_600_000) % 24),
      minutes: Math.floor((remaining / 60_000) % 60),
      seconds: Math.floor((remaining / 1_000) % 60),
    },
  };
}

export function useBirthdayCountdown() {
  const state = ref<CountdownState>(calculateCountdown());
  useIntervalFn(() => {
    state.value = calculateCountdown();
  }, 1000);

  return { state };
}
