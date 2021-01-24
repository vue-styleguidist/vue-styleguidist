import Vue from 'vue'
import { VueLive } from 'vue-live'
import 'vue-live/lib/vue-live.esm.css'
import VueLiveLayout from '../docs/VueLiveLayout.vue'

Vue.component('VueLive', {
	render(h) {
		return h(VueLive, { props: { ...this.$attrs, layout: VueLiveLayout } })
	}
})
