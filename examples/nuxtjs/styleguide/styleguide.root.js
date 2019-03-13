import Vue from "vue";
import Vuex from "vuex";
import { state, mutations, getters } from "../src/store/mutations";

Vue.use(Vuex);

// in order not to polute the database and making useless database calls
// we mock axios (we could have used mock-axios instead)
Vue.prototype.$axios = {
  $get:() => Promise.resolve('success') 
};

const store = new Vuex.Store({
  state,
  getters,
  mutations
});

export default previewComponent => {
  // https://vuejs.org/v2/guide/render-function.html
  return {
    store,
    render(createElement) {
      return createElement(previewComponent);
    }
  };
};
