import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(),
  scrollBehavior() {
    return { top: 0, left: 0 };
  },
  routes: [
    {
      path: "/",
      name: "layout",
      component: () => import("./components/HelloWorld.vue"),
      beforeEnter: (to, from, next) => {
        const token = localStorage.getItem("token");
        if (!token) {
          return next({ name: "login" });
        }
        return next();
      },
      // children: [
      //   {
      //     path: "",
      //     name: "home",
      //     component: () => import("./components/HelloWorld.vue"),
      //   },
      // ],
    },
    {
      path: "/login",
      name: "login",
      component: () => import("./views/LoginView.vue"),
    },
  ],
});

export default router;
