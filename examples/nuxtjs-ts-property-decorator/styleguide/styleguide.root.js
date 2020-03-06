import Vue from "vue";
import Vuex from "vuex";
import { state, mutations, getters } from "../src/store/mutations";

Vue.use(Vuex);

// in order not to polute the database and making useless database calls
// we mock axios (we could have used mock-axios instead)
Vue.prototype.$axios = {
  $get:() => Promise.resolve([
    {employee_name:'success', employee_salary: "12"}, 
    {employee_name:'joe', employee_salary: "1789"},
    {employee_name:'bill', employee_salary: "13"},
    {employee_name:'martin', employee_salary: "1234"},
    {employee_name:'anette', employee_salary: "34"},
    {employee_name:'hilary', employee_salary: "567"},
  ]) 
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
