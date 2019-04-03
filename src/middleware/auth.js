import cookie from "js-cookie";

export default async function(context) {
  const { store, route, redirect, req, app } = context;

  let isLogin = store.getters["user/isLogin"];
  //已经登录，则不需要获取用户信息了
  if (isLogin) return;

  let token = cookie.get("token");
  if (token) {
    //存在token，则拉取用户信息
    try {
      store.commit("update", {
        token
      });
      await store.dispatch("user/getInfo");
      return;
    } catch (e) {
      await store.dispatch("clearStatus");
      console.error("get user error: ", e);
    }
  }
  // 未登录
  // const loginNeededPages = ["/cart", "/personal", "/otherPay"]; //需要做登录判断的页面路径
  // /*
  //   my模块和aft模块默认需要做登录判断
  // */
  // const myModuleReg = /^\/personal\/(\S)+/;
  // const aftModuleReg = /^\/applyAfterSale\/(\S)+/;
  // const path = route.path;
  // if (
  //   (myModuleReg.test(path) ||
  //     aftModuleReg.test(path) ||
  //     loginNeededPages.includes(path)) &&
  //   path !== "/login"
  // ) {
  //   store.commit("user/update", { from: path });

  //   // app.router.replace("/login");
  // }
}
