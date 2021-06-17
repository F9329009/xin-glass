import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import Login from "../views/Login/index.vue";

// 功能路由
const adminComponents = {
  // 首页
  Home: () => import("../components/Home/index.vue"),
  // 玻璃架
  FrameSmall: () => import("../components/FrameSmall/index.vue"),
  // 生产报表
  ProductionReport: () => import("../components/ProductionReport/index.vue"),
  // 补片明细
  Patch: () => import("../components/Patch/index.vue"),
  // 订单统计
  OrderTotal: () => import("../components/OrderTotal/index.vue"),
};

const routes: Array<RouteRecordRaw> = [
  // 登陆页面
  {
    path: "/",
    name: "Login",
    component: Login,
    meta: { title: "登录" },
  },
  // 注册页面
  // {
  //   path: "/register",
  //   name: "Register",
  //   component: () => import("../views/Register/index.vue"),
  //   meta: { title: "注册" },
  // },
  // 后台
  {
    path: "/admin",
    name: "Admin",
    component: () => import("../views/Admin/index.vue"),
    // 网页 Title
    meta: { title: "后台" },
    // 默认跳转
    // redirect: "/admin/home",
    children: [
      // 首页
      {
        path: "/admin",
        name: "Home",
        // component: () => import("../components/Home/index.vue"),
        components: adminComponents,
        meta: { title: "后台" },
      },
      // 玻璃架管理
      {
        path: "/admin/framesmall/frame",
        name: "Frame",
        // component: () => import("../components/FrameSmall/index.vue"),
        components: adminComponents,
        meta: { title: "玻璃架管理" },
      },
      // 艾磊ERP
      // 生产报表
      {
        path: "/admin/alionerp/productionreport",
        name: "ProductionReport",
        // component: () => import("../components/ProductionReport/index.vue"),
        components: adminComponents,
        meta: { title: "生产报表" },
      },
      // 补片明细
      {
        path: "/admin/alionerp/patch",
        name: "Patch ",
        // component: () => import("../components/Patch/index.vue"),
        components: adminComponents,
        meta: { title: "补片明细" },
      },
      // 订单统计
      {
        path: "/admin/alionerp/ordertotal",
        name: "OrderTotal ",
        // component: () => import("../components/OrderTotal/index.vue"),
        components: adminComponents,
        meta: { title: "订单统计" },
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

// 使用 router.beforeEach 对路由进行遍历，设置title
//beforeEach 是 router 的钩子函数，在进入路由前执行
router.beforeEach((to, from, next) => {
  // 默认 title
  const defaultTitle = "管理系统";
  if (to.meta.title) {
    document.title = `${defaultTitle} - ${to.meta.title}`;
  } else {
    document.title = defaultTitle;
  }
  next();
});

export default router;
