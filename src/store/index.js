import {
  sendSms,
  ytCoin,
  wechatPay,
  checkPay,
  queryIntegral,
  categoryTree,
  featuredFirsts,
  findAddress
} from "@/const/api";
import cookie from "js-cookie";
import qs from "qs";
import { isWeiXin } from "@/utils";

// 最好提前在你的 store 中初始化好所有所需属性
// https://vuex.vuejs.org/zh-cn/mutations.html
export const state = () => ({
  token: "",
  locationCity: {}, //定位城市
  locationCityforJD: {}, //定位城市JD
  selectedCity: {}, //手动选择城市
  selectedCityforJD: {}, //手动选择城市JD
  ytCoin: {
    // balance: 0, //余额
    // balanceAmt: 0, //总计获得金额
    // usedAmt: 0, //总计使用金额
    // status: null //账户状态(string)
    scTotalNum: 0
  }, //国源通币
  integral: {
    balanceNum: 0, //积分余额
    totalNum: 0, //创建账号后获得积分总数
    useNum: 0, //已用积分
    wasteNum: 0 //账户状态(string)
  } //积分
});
export const getters = {
  provinceCode(state, getters, rootState, rootGetters) {
    if (getters["address/defaultAddress"]) {
      return getters["address/defaultAddress"].provinceCode;
    } else {
      return state.selectedCity.provinceCode || state.locationCity.provinceCode;
    }
  },
  selectedCity(state, getters, rootState, rootGetters) {
    if (state.selectedCity && state.selectedCity.provinceCode) {
      return state.selectedCity;
    }
    return state.locationCity;
  },
  selectedCityforJD(state, getters, rootState, rootGetters) {
    if (state.selectedCityforJD && state.selectedCityforJD.provinceCode) {
      return state.selectedCityforJD;
    }
    return state.locationCityforJD;
  }
};
//  mutation 必须同步执行
export const mutations = {
  update(state, payload) {
    Object.keys(payload).forEach(k => {
      if (k === "selectedCity") {
        localStorage.setItem("currentCity", JSON.stringify(payload[k]));
        state[k] = JSON.parse(localStorage.getItem("currentCity"));
      } else {
        state[k] = payload[k];
      }
    });
  },
  setToken(state, payload) {
    state.token = payload;
  }
};

// Action 提交的是 mutation，而不是直接变更状态
// Action 可以包含任意异步操作
export const actions = {
  //获取验证码
  async getVerificationCode(context, { mobile }) {
    const payload = await this.$axios.$post(sendSms, { mobile });
    return payload;
  },
  async getYtCoin({ commit }, memberId) {
    const { payload = {} } = await this.$axios.$get(`${ytCoin}`);
    commit("update", {
      ytCoin: payload
    });
    return payload;
  },
  async getIntegral({ commit }, memberId) {
    const { payload = {} } = await this.$axios.$get(
      queryIntegral + `?memberId=${memberId}`
    );
    commit("update", {
      integral: payload
    });
    return payload;
  },
  async clearStatus({ commit }) {
    //清楚应用状态
    // cookie.remove("token", { path: "/", domain: ".gtytong.com" });
    // cookie.remove("token", { path: "/" /*, domain: ".gtytong.com"*/ });
  },
  async payOder({ commit }, query = {}) {
    const { payload = {} } = await this.$axios.$get(
      `${wechatPay}?${qs.stringify(query)}`
    );
    return payload;
  },
  async prePayOder({ commit }, query = {}) {
    const { payload = {} } = await this.$axios.$get(
      `${checkPay}?${qs.stringify(query)}`
    );
    return payload;
  },
  async categoryTree({ commit }) {
    const { payload = {} } = await this.$axios.$get(`${categoryTree}`);
    return payload;
  },
  //获取首页推荐位
  async getRecommendList({ commit, state, getters }, data) {
    let querys = [];
    for (let key in data) {
      if (key === "programa") continue;
      querys.push(key + "=" + data[key]);
    }
    querys.push("programa=0"); //首页推荐位新接口
    const { payload = {} } = await this.$axios.$get(
      featuredFirsts + "?" + querys.join("&")
    );
    return payload;
  },
  // 获取JD地址编码（高德地址码->京东）
  async getJDAddress({ commit, state }, city) {
    const resp = await this.$axios.$post(`${findAddress}`, city);
    return resp.payload;
  }
};
