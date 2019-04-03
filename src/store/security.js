import Vue from "vue";
import { updateAccountSecurity } from "@/const/api";
import qs from "qs";
import {
  checkLoginOldPassword,
  checkOldTransactionPassword
} from "@/const/api";
// export const state = () =({

// })

export const actions = {
  async updateSecurity({ commit, state }, data) {
    const { payload } = await this.$axios.$put(updateAccountSecurity, data);
    return payload;
  },
  async checkOldPassword({ commit, state }, data) {
    const { payload } = await this.$axios.$post(checkLoginOldPassword, data);
    return payload;
  },
  async checkOldTransactionPassword({ commit, state }, data) {
    const { payload } = await this.$axios.$post(
      checkOldTransactionPassword,
      data
    );
    return payload;
  }
};
