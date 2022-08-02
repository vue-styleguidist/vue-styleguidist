import { h } from "vue"
import { VueLive } from "vue-live";
import layout from "./vue-live-layout.vue";

export default (props) => h(VueLive, { ...props, layout })