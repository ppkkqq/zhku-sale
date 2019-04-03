/*
* @Author: wukunpeng 
* @Date: 2018-09-14 19:34:13 
* @Last Modified by:   wukunpeng 
* @Last Modified time: 2018-09-14 19:34:13 
*/

import Vue from "vue";
import { skuDetail } from "@/const/api";

export const state = () => ({
  idMap: {},
  currentId: 1,
  loading: false
});

export const getters = {
  currentSku(state) {
    return state.idMap[state.currentId] || {};
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
  async getDetailById({ commit, state }, id) {
    let data = state.idMap[id];
    if (!data) {
      const { payload } = await this.$axios.$get(`${skuDetail}?id=${id}`);
      data = payload;
      commit("addItem", data);
    } else {
      commit("setCurrentId", id);
    }

    return data ? { ...data } : {};
  }
};
