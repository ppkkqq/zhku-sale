import { applyList, apply } from "@/const/api";

export const state = () => ({
  token: ""
});

export const getters = {};
export const mutations = {
  update(state, payload) {
    Object.keys(payload).forEach(k => {
      state[k] = payload[k];
    });
  }
};

export const actions = {
  async getApplyList({ commit, state }) {
    const result = await this.$axios.$get(applyList);
    return result.payload.list;
  },

  async Apply({ commit, state }, submitapply) {
    const data = {
      tradeOrderId: submitapply.tradeOrderId,
      idAndQuantity: submitapply.idAndQuantity,
      refundType: submitapply.refundType,
      description: submitapply.description,
      imgUrl: submitapply.imgUrl
    };
    const result = await this.$axios.$post(apply, data);
    return result.msg;
  }
};
