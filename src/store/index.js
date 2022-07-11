import Vue from "vue";
import Vuex from "vuex";
import { setStorage, getStorage } from "@/utils/storage";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    //data
    token: getStorage("token"),
  },
  getters: {
    getters_token(state) {
      return state.token;
    },
  }, // computed
  mutations: {
    // methods
    getToken(state, params) {
      // params是传参
      state.token = params;
      setStorage("token", params);
    },
  },
  actions: {}, // 异步请求
  modules: {}, // 模块
});
