import {
  addOrder,
  orderList,
  cancelOrder,
  prePay,
  orderDetail,
  checkPay,
  orderPaidStatus,
  applyList,
  orderSettle
} from "@/const/api";
import qs from "qs";

export const state = () => ({
  loading: false
});

export const getters = {
  nickName(state, getters, rootState) {
    return rootState.user.nickName || rootState.user.mobile;
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
  async loadList({ commit, state, rootState }, query = {}) {
    const { payload = {} } = await this.$axios.$get(
      `${orderList}?${qs.stringify(query)}`
    );
    return payload;
  },
  async getPrePayDetail({ commit, state }, orderId) {
    //预订单不能缓存，主要在于倒计时
    const result = await this.$axios.$get(`${prePay}?orderId=${orderId}`);
    return result.payload;
  },
  async addOrder(
    { commit, getters },
    {
      address,
      childOrderItems,
      skuList,
      isCart,
      isEarnest,
      isTourism,
      isPreOrder,
      id,
      integralUsedAmount,
      ytCoinId
    }
  ) {
    // isPreOrder 是否是添加预订单
    //组装下单数据
    // "19", "1601", "50285", "51382"
    const data = {
      id: id, //修改预订单需要
      addressId: address.id,
      address: address.address,
      townId: 51382 || 0,
      areaId: 50285,
      cityId: 1601,
      provinceId: 19,
      townName: address.townName || "",
      areaName: address.areaName,
      cityName: address.cityName,
      provinceName: address.provinceName,
      receiverMobile: address.deliveryMobile,
      receiverName: address.deliveryName,
      tradeType: "presale",
      buyerNick: getters.nickName,
      childOrderItems: childOrderItems,
      integralUsedAmount: integralUsedAmount || 0,
      shopcardId: ytCoinId || "",
      skuAndQtyList: skuList.map(item => {
        return {
          skuId: item.skuId,
          quantity: item.quantity,
          categoryId: item.categoryId,
          markingId: item.markingId,
          markingType: item.markingType
        };
      })
    };
    const result = await this.$axios.$post(
      `${
        isPreOrder ? orderSettle : addOrder
      }?isCart=${isCart}&isEarnest=${isEarnest}&isTourism=${isTourism}`,
      data
    );
    return result.payload;
  },
  async cancelOrder({ commit, getters }, orderId) {
    const result = await this.$axios.$get(
      `${cancelOrder}?supplierOrderId=${orderId}`
    );
    return result.payload;
  },
  async getOrderDetail({ commit, getters }, { orderId, forPay }) {
    const result = forPay
      ? await this.$axios.$get(
          `${orderDetail}?orderId=${orderId}&forPay=${forPay}`
        )
      : await this.$axios.$get(`${orderDetail}?orderId=${orderId}`);
    return result.payload;
  },
  async gePreOrderDetail({ commit, getters }, preId) {
    const result = await this.$axios.$get(`${orderSettle}?id=${preId}`);
    return result.payload;
  },
  async checkPayStatus({ commit, getters }, orderId) {
    const result = await this.$axios.$get(
      `${orderPaidStatus}?orderNo=${orderId}`,
      { progress: false }
    );
    return result.payload;
  },
  async checkPay({ commit, getters }, orderId) {
    const result = await this.$axios.$get(`${checkPay}?orderId=${orderId}`);
    //1允许支付 0需要等待
    return result.payload === "1";
  },
  async getRefundList({ commit, state }, query = {}) {
    const result = await this.$axios.$get(
      `${applyList}?${qs.stringify(query)}`
    );
    return result.payload;
  }
};
