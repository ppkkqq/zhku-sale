import Vue from "vue";
import qs from "qs";
import {
  goodsDetail,
  goodsList,
  products,
  goodsMarkingDetail
} from "@/const/api";

export const state = () => ({
  idMap: {},
  currentId: 1,
  loaded: false
});

export const getters = {
  currentProduct(state) {
    return state.idMap[state.currentId] || {};
  },
  provinceCode(state, getters, rootState, rootGetters) {
    // return '120000'
    if (rootGetters["address/defaultAddress"]) {
      return rootGetters["address/defaultAddress"].provinceCode;
    } else {
      return (
        rootState.selectedCity.provinceCode ||
        rootState.locationCity.provinceCode
      );
    }
  }
};
export const mutations = {
  addItem(state, item) {
    Vue.set(state.idMap, item.id, item);
    state.currentId = item.id;
  },
  setCurrentId(state, id) {
    state.defaultId = id;
  }
};

export const actions = {
  async loadList({ commit, state }, query = {}) {
    // 我的订单列表根据请求参数获取列表，不保存在state里面
    // state只缓存了加载了详情的product
    const queryStr = qs.stringify(query);
    const { payload = {} } = await this.$axios.$get(
      `${query.isSearchCenter ? products : goodsList}?${queryStr}`
    );
    return payload || [];
  },

  async getDetailById({ commit, state, getters }, { id, location }) {
    //商品详情不做缓存，因为涉及库存
    // let areaId = provinceCode ? provinceCode : getters.provinceCode
    if (!location) {
      location = {};
    }
    let target = {};
    let goodsPayload = {};
    const { payload } = await this.$axios.$get(
      `${goodsDetail}?id=${id}&provinceCode=${location.provinceCode}&cityCode=${
        location.cityCode
      }&areaCode=${location.areaCode}&townCode=${
        location.townCode
      }&provinceName=${location.provinceName}&cityName=${
        location.cityName
      }&areaName=${location.areaName}&townName=${location.townName}`
    );
    if (payload.markingId) {
      await this.$axios.$get(`${goodsMarkingDetail}?id=${id}`).then(res => {
        goodsPayload = res.payload;
      });
    }
    Object.assign(target, payload, goodsPayload);
    return target;
  }
};
