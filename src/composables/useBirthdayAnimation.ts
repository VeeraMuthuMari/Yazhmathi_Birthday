import confetti from "canvas-confetti";
import { nextTick } from "vue";
import gsap from "gsap";
import { useBirthdayStore } from "../stores/birthdayStore";

export function useBirthdayAnimation() {
  const birthday = useBirthdayStore();

  function celebrate() {
    void confetti({
      particleCount: 130,
      spread: 90,
      origin: { y: 0.65 },
      colors: ["#f1c982", "#f0a9c0", "#fff3df", "#b89ac8"],
    });
    window.setTimeout(() => {
      void confetti({
        particleCount: 75,
        spread: 120,
        origin: { y: 0.65 },
        colors: ["#f1c982", "#f0a9c0", "#fff3df"],
      });
    }, 350);
  }

  async function enterCelebration() {
    birthday.enter();
    await nextTick();
    gsap.fromTo(
      ".celebration-title",
      { y: 42, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1.25,
        ease: "power3.out",
      },
    );
    celebrate();
  }

  function makeWish() {
    birthday.makeWish();
    celebrate();
  }

  function openGift() {
    birthday.toggleGift();
    if (birthday.giftOpen) celebrate();
  }

  return { celebrate, enterCelebration, makeWish, openGift };
}
