import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory("/common-tools/"),
  routes: [
    {
      path: "/",
      redirect: "env-check",
    },
    {
      path: "/env-check",
      name: "envCheck",
      component: () => import("@/views/envCheck/index.vue"),
      meta: {
        title: "环境检测",
      },
    },
    {
      path: "/winning-order",
      name: "winningOrder",
      component: () => import("@/views/winning-order/index.vue"),
      meta: {
        title: "中奖榜单生成",
      },
    },
    {
      path: "/404",
      name: "404",
      component: () => import("@/views/404/index.vue"),
      meta: {
        title: "404 页面未找到",
      },
    },
  ],
});

router.beforeEach((to, from, next) => {
  if (to.matched.length === 0) {
    next({ path: "/404" });
  }
  if (from.path === "/" && to.name !== "envCheck" && to.name !== "404") {
    // console.log("刷新了");
    next({
      name: "envCheck",
      query: {
        redirectUri: to.name,
        ...to.query,
      },
    });
  } else {
    if (to.meta.title) {
      document.title = to.meta.title;
    }
    next();
  }
});

export default router;
