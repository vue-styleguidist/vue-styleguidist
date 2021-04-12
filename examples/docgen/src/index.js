import Vue from "vue";
import App from "./App.vue";

Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  el: "#app",
  components: { App },
  render: (h) => h(App),
  template: "<App/>",
});
