import cookie from "js-cookie";
import {
  loginUrl,
  wxlogin,
  registerUrl,
  userInfo,
  tenantCode,
  collect
} from "@/const/api";

export const state = () => ({
  avatarUrl: "",
  birthday: "",
  createdAt: "",
  createdBy: "",
  email: "",
  gender: "",
  id: "",
  isPassword: "",
  isTransactionPassword: "",
  mobile: "",
  nickName: "",
  realName: "",
  updatedAt: "",
  updatedBy: "",
  userName: "",
  from: "/" //记录登陆之前的页面
});

export const getters = {
  isLogin(state) {
    return state.id;
  },
  isTransactionPassword(state) {
    return state.isTransactionPassword !== "false";
  }
};
export const mutations = {
  update(state, payload) {
    Object.keys(payload).forEach(k => {
      state[k] = payload[k];
    });
  }
};

export const actions = {
  async go2Login({ commit }, path) {
    commit("update", { from: path });

    this.$router.push("/login");
  },
  async getInfo({ commit, dispatch }) {
    const { payload = {} } = await this.$axios.$get(`${userInfo}`);
    commit("update", payload || {});
    return payload;
  },
  async login({ commit, state, dispatch }, data) {
    await this.$axios.$post(loginUrl, data)
      .then(payload => {
        if (payload != 'error'){//登录成功
          commit("update", { id: payload })
        }
        return payload;
      })
    //登陆成功
    // commit("setToken", payload.token, { root: true });
    // console.log(payload);
    // commit("update", payload.member);

    // 清除地址缓存
    // commit(
    //   "address/update",
    //   {
    //     idMap: {},
    //     defaultAddress: {},
    //     loaded: false,
    //     defaultStatusId: "" //默认地址id
    //   },
    //   { root: true }
    // );
    // 清空购物车
    // commit(
    //   "cart/update",
    //   {
    //     loading: false,
    //     idMap: {},
    //     loaded: false,
    //     checkedList: []
    //   },
    //   { root: true }
    // );
    // // 清空评论
    // commit(
    //   "comments/update",
    //   {
    //     content: []
    //   },
    //   { root: true }
    // );
    // 如果存在重定向url，则直接跳转至该url
    // const redirectUrl = this.$router.currentRoute.query.redirectUrl;
    // if (redirectUrl) {
    //   window.location.href = redirectUrl;
    //   return;
    // }
    //
    // //跳转到之前的页面
    // if (payload.member.isPassword === "true") {
    //   this.$router.replace(state.from || "/");
    // } else {
    //   //  未绑定登录密码，需要调整至绑定密码页面
    //   this.$router.replace({
    //     name: "password-config",
    //     params: {
    //       phone: data.mobile,
    //       code: data.code
    //     }
    //   });
    // }
    // commit("update", { from: "/" });

  },
  async register({ commit, state, rootState }, { mobile, password, code }) {
    const data = {
      mobile,
      password,
      code
    };

    const { payload = {} } = await this.$axios.$post(registerUrl, data);
    //注册成功
    commit("update", payload.member);
    commit("setToken", payload.token, { root: true });
    //跳转到之前的页面
    this.$router.push(state.from || "/");
    commit("update", { from: "/" });
    return payload;
  },
  async registerForIndex(
    { commit, state, rootState },
    { mobile, password, code }
  ) {
    const data = {
      mobile,
      password,
      code
    };

    const { payload = {} } = await this.$axios.$post(registerUrl, data);
    //注册成功
    commit("update", payload.member);
    commit("setToken", payload.token, { root: true });
    //跳转到之前的页面
    // this.$router.push(state.from);
    // commit("update", { from: "/" });
    return payload;
  },
  async getCollection({ commit }, { accountId, itemId }) {
    const { payload = {} } = await this.$axios.$get(
      collect + `?itemId=${itemId}&accountId=${accountId}`
    );
    return payload;
  },

  async addCollection({ commit, state, dispatch }, data) {
    const { payload = {} } = await this.$axios.$post(collect, data);
    return payload;
  },

  async deleteCollection({ commit, state }, data) {
    const { payload = {} } = await this.$axios.$delete(collect, data);

    return payload;
  },

  async logout({ commit, state, dispatch }) {
    commit("setToken", "", { root: true });
    dispatch("clearStatus", "", { root: true });
    // 清除地址数据
    commit(
      "address/update",
      {
        idMap: {},
        defaultAddress: {},
        selectedAddress: {},
        loaded: false,
        defaultStatusId: "" //默认地址id
      },
      { root: true }
    );
    // 清空购物车
    commit(
      "cart/update",
      {
        loading: false,
        idMap: {},
        loaded: false,
        checkedList: []
      },
      { root: true }
    );
    // 清空评论
    commit(
      "comments/update",
      {
        content: []
      },
      { root: true }
    );

    commit("update", {
      avatarUrl: "",
      birthday: "",
      createdAt: "",
      createdBy: "",
      email: "",
      gender: "",
      id: "",
      isPassword: "",
      isTransactionPassword: "",
      mobile: "",
      nickName: "",
      realName: "",
      updatedAt: "",
      updatedBy: "",
      userName: "",
      from: "/" //记录登陆之前的页面
    });
  }
};
