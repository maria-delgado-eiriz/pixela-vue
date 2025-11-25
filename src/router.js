import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(),
  scrollBehavior() {
    return { top: 0, left: 0 };
  },
  routes: [
    {
      path: "/",
      name: "default",
      component: () => import("./components/HelloWorld.vue"),
    },
  ],
});

export default router;
