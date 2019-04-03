import Vue from "vue";
import { cartList, updateQty } from "@/const/api";
import qs from "qs";
import debounce from "lodash/debounce";

export const state = () => ({
  loading: false,
  // shopIdMap: {}, //放置商户列表对象
  idMap: {}, // 放置购物车列表对象
  loaded: false, // 用于判断是否已经发送请求获取购物车列表
  checkedList: [] // 用户已经选中的购物车中的商品
});

export const getters = {
  cartListByShop(state) {
    const shopIdMap = {};
    Object.values(state.idMap).map(item => {
      Vue.set(shopIdMap, item.shopId, {
        shopId: item.shopId,
        shopName: item.shopName,
        goodsType: item.goodsType,
        // 商品列表，如果不存在就取该商品
        list: (shopIdMap[item.shopId] &&
          shopIdMap[item.shopId].list &&
          shopIdMap[item.shopId].list.concat([item])) || [item]
      });
    });
    // return shopIdMap
    return Object.values(shopIdMap);
  },
  list(state) {
    return Object.values(state.idMap);
  },
  getItem: state => id => {
    return state.idMap[id];
  },
  getCheckedItems: state => () => {
    return state.checkedList;
  }
};
export const mutations = {
  mergeList(state, payload = []) {
    payload.forEach(shopItem => {
      // Vue.set(state.shopIdMap, shopItem.shopId, shopItem)

      shopItem.list.forEach(item => {
        Vue.set(state.idMap, item.skuId, item);
      });
    });
    state.loaded = true;
  },
  updateItemQuantity(state, { skuId, quantity }) {
    const item = state.idMap[skuId];
    item.quantity = quantity;
    Vue.set(state.idMap, item.skuId, item);
  },
  updateItemsChecked(state, skuIdList) {
    const checkedList = [];
    skuIdList.forEach(item => {
      checkedList.push(state.idMap[item]);
    });

    state.checkedList = checkedList;
  },
  removeCheckedList(state) {
    state.checkedList.forEach(goodsItem => {
      Vue.delete(state.idMap, goodsItem.skuId);
    });
    state.checkedList = [];
  },
  addItem(state, item) {
    Vue.set(state.idMap, item.skuId, item);
  },

  deleteItemByGroup(state, ids) {
    ids.forEach(id => {
      Vue.delete(state.idMap, id);
    });
  },

  update(state, payload) {
    Object.keys(payload).forEach(k => {
      state[k] = payload[k];
    });
  },
  updateCollect(state, item) {
    state.idMap[item.skuId].isCollect = item.isCollect;
  }
};

export const actions = {
  updateCollect({ commit, state }, item) {
    commit("updateCollect", item);
  },
  async loadList({ commit, state }, query = {}) {
    let carts = await this.$axios.get(`${cartList}?${qs.stringify(query)}`);
    commit("mergeList", carts);
  },

  async deleteItemByGroup({ commit, state }, ids) {
    const { payload } = await this.$axios.$delete(cartList, {
      data: ids
    });
    commit("deleteItemByGroup", ids.skuIdList);
  },

  //加入购物车
  async add2Cart(
    { commit },
    { skuId, quantity, categoryId, markingId, markingType }
  ) {
    try {
      commit("update", { loading: true });
      let result = await this.$axios.$post(cartList, {
        skuId,
        quantity,
        categoryId,
        markingId,
        markingType
      });
      commit("update", { loaded: false });
      return result;
    } catch (e) {
      throw e;
    } finally {
      commit("update", { loading: false });
    }
  },
  //修改购物车sku数量
  async updateSkuQuantity({ state, commit }, { skuId, quantity }) {
    try {
      commit("updateItemQuantity", { skuId, quantity });
      // 超过2s间隔才发请求
      debounce(async () => {
        // 最后数量相等才发请求
        if (state.idMap[skuId].quantity !== quantity) {
          return;
        }
        let result = await this.$axios.$post(updateQty, { skuId, quantity });
        return result;
      }, 2000)();
      // let result = await this.$axios.$post(updateQty, { skuId, quantity });
      // return result;
    } catch (e) {
      throw e;
    }
  },
  // 获取购物车数量
  async productCount({ rootState }) {
    if (!rootState.token) {
      return 0;
    }
    let data = {
      size: "1",
      provinceCode: 12,
      cityCode: 904,
      areaCode: 3378,
      townCode: 57894,
      provinceName: "江苏",
      cityName: "南京市",
      areaName: "栖霞区",
      townName: "栖霞街道"
    };
    const resp = await this.$axios.$get(cartList, { params: data });
    const totalElements = resp.payload.totalElements;
    const showNumber = totalElements > 99 ? "99+" : totalElements;
    return showNumber;
  }
};
