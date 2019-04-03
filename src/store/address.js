import Vue from "vue";
import { deliveryAddress } from "@/const/api";
// setDefault 不是设置接口默认，而是设置业务层当前选择的地址
export const state = () => ({
  idMap: {},
  defaultAddress: {},
  selectedAddress: {}, //业务层当前选择的地址
  loaded: false,
  defaultStatusId: "" //默认地址id
});

export const getters = {
  list(state) {
    return Object.values(state.idMap).reverse();
  },
  defaultAddress(state) {
    // 获取业务层默认地址顺序，业务层当前选择的地址 -> 用户设置的默认地址-> 地址列表头一个
    return (
      (state.defaultAddress.provinceName && state.defaultAddress) ||
      state.idMap[state.defaultStatusId] ||
      Object.values(state.idMap).reverse()[0] ||
      {}
    );
  },
  selectedAddress(state) {
    // 获取业务层当前选择的地址
    return state.selectedAddress;
  },
  getItem: state => id => {
    return state.idMap[id];
  }
};
export const mutations = {
  mergeList(state, payload = []) {
    payload.forEach(item => {
      if (item.defaultStatus === 1) {
        state.defaultAddress = item; //默认地址，默认设置为业务层默认选中id
        state.defaultStatusId = item.id;
      }
      Vue.set(state.idMap, item.id, item);
    });
    state.loaded = true;
  },
  mergeCurrent(state, payload) {
    Object.keys(payload).forEach(key => {
      Vue.set(state.current, key, payload[key]);
    });
  },
  addItem(state, item) {
    Vue.set(state.idMap, item.id, item);
  },
  updateItem(state, item) {
    Vue.set(state.idMap, item.id, item);
  },
  deleteItem(state, id) {
    // 处理默认地址状态
    if (state.defaultStatusId === id) {
      state.defaultStatusId = "";
    }
    // 处理选择地址状态
    if (state.defaultAddress.id === id) {
      state.defaultAddress = {};
    }

    Vue.delete(state.idMap, id);
  },
  setDefault(state, address) {
    if (address) {
      state.defaultAddress = address;
    }
  },
  // 设置当前地址
  setSelectedAddress(state, address) {
    if (address && address.areaCode) {
      state.selectedAddress = address;
    }
  },
  // 设置默认地址
  setDefaultStatus(state, item) {
    item.defaultStatus = 1;
    state.defaultStatusId = item.id;
    Vue.set(state.idMap, item.id, item);
  },
  update(state, payload) {
    Object.keys(payload).forEach(k => {
      state[k] = payload[k];
    });
  }
};

export const actions = {
  async loadList({ commit, state, rootState }, data) {
    if (state.loaded) return Object.values(state.idMap).reverse();
    // 没有token不发请求
    if (!rootState.token) {
      return [];
    }
    const { payload = {} } = await this.$axios.$get(`${deliveryAddress}`);
    const list = payload ? payload.content : [];
    commit("mergeList", list);
    return list;
  },

  async addItem({ commit, state }, data) {
    const { payload } = await this.$axios.$post(deliveryAddress, data);
    commit("addItem", payload);

    if (payload.defaultStatus === 1) {
      commit("setDefaultStatus", payload);
      commit("setDefault", payload);
    }
    return payload;
  },
  async updateItem({ commit, state }, { id, address }) {
    const { payload } = await this.$axios.$put(
      `${deliveryAddress}/${id}`,
      address
    );
    commit("updateItem", payload);
    return payload;
  },

  async deleteItem({ commit, state }, id) {
    const { payload } = await this.$axios.$delete(`${deliveryAddress}/${id}`);
    commit("deleteItem", id);
    return payload;
  },

  async getItem({ commit, getters, state }, id) {
    let data = state.idMap[id];
    if (!data) {
      const { payload } = await this.$axios.$get(`${deliveryAddress}/${id}`);
      data = payload;
    }
    if (data) {
      return { ...data };
    } else {
      return false;
    }
  },
  // 调用接口设置默认地址
  async setDefaultStatus({ commit, dispatch, state }, id) {
    const data = state.idMap[id];
    const { payload } = await this.$axios.$put(
      `${deliveryAddress}/${id}/default`
    );
    commit("setDefaultStatus", data);
    commit("setDefault", data);
    return state.idMap[id];
  }
};
