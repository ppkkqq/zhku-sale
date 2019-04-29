import Vue from "vue";
import qs from "qs";
import { tenantCode } from "@/const/api";
// 为了finally的兼容性
require("promise.prototype.finally").shim();

const networkError = "Network Error";
export default function(context) {
  let { $axios, store, redirect, app, route } = context;
  // $axios.onRequest(config => {
  //   let url = config.url;
  //
  //   url += url.indexOf("?") > -1 ? "&" : "?";
  //   url += `token=${store.state.token}`;
  //   url += `&tenantCode=${tenantCode}`;
  //   url += `&currentTime=${Date.now()}`;
  //   config.url = url;
  //   return config;
  // });

  $axios.onError(error => {
    if (error.message === networkError || !error.response) {
      Vue.$message.error("网络请求失败，请检查您的网络");
      return;
    }

    if (process.client) {
      // axios 数据结构
      let resp = error.response;
      let data = resp.data;

      // TODO 的错误 需要日志监控
      console.log("error", error);

      if (resp.status !== 401) {
        return;
      }

      // 需要登录的接口，跳转至login

      store.dispatch("clearStatus");

      // 如不需要调整到login，则在传参时，增加noRedirect参数
      // let params = error.config.params;
      // if (!params) {
      //   // 如果是参数在url中，则取url中的query值
      //   // 如果url不存在query值，则传空
      //   params =
      //     qs.parse((error.config.url && error.config.url.split("?")[1]) || "", {
      //       ignoreQueryPrefix: true
      //     }) || {};
      // }

      // if (params.noRedirect) {
      //   return;
      // }
      const fullPath = app.router.app._route.fullPath; //带query
      const path = fullPath.split("?")[0]; //不带query

      const loginNeededPages = ["/cart", "/personal", "/otherPay"]; //需要做登录判断的页面路径
      /*
        my模块和aft模块默认需要做登录判断
      */
      const myModuleReg = /^\/personal\/(\S)+/;
      const aftModuleReg = /^\/applyAfterSale\/(\S)+/;
      if (
        (myModuleReg.test(path) ||
          aftModuleReg.test(path) ||
          loginNeededPages.includes(path)) &&
        path !== "/login"
      ) {
        Vue.$message.error(data.msg || data.payload);
        store.commit("user/update", { from: fullPath });
        app.router.replace("/login");
      }
    }
  });
}
