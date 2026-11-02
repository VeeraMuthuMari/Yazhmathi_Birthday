import { createRouter, createWebHistory } from "vue-router";
import BirthdayHome from "../views/BirthdayHome.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [{ path: "/", name: "birthday-home", component: BirthdayHome }],
  scrollBehavior: (to) => (to.hash ? { el: to.hash, behavior: "smooth" } : { top: 0 }),
});

export default router;
