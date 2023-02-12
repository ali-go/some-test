import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      redirect: "/vitural",
    },
    {
      path: "/vitural",
      name: "vitural",
      component: () => import("../views/VituralList.vue"),
    },
  ],
});

export default router;
