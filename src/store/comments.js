import { addOrder, addComments, getComments } from "@/const/api";

export const state = () => ({
  loading: false,
  commentList: [],
  totalElements: "",
  firstPage: 1,
  lastPage: 1
});

export const getters = {};
export const mutations = {
  update(state, payload) {
    state.commentList = [];
    state.totalElements = payload.totalElements;
    state.lastPage = payload.totalPages;
    payload.content.forEach(item => {
      let temp = {};
      Object.keys(item).forEach(k => {
        temp[k] = item[k];
      });
      state.commentList.push(temp);
    });
  }
};

export const actions = {
  async loadComment({ commit, state, dispatch }, { goodId, page }) {
    let list = await this.$axios.$get(
      getComments(goodId) + `&size=5&page=${page}`
    );
    const payload = list.payload;
    commit("update", payload);
  },
  //查看商品评价
  async getEcEvaluations({ commit, state, getters }, data) {
    const { payload = {} } = await this.$axios.$get(addComments + "/" + data);
    return payload;
  }
};
