import 'babel-polyfill'
import Vue from 'vue'
import Vuetify from 'vuetify'
import VueI18n from 'vue-i18n'
import { VApp } from 'vuetify/lib'
import 'vuetify/dist/vuetify.min.css'

Vue.use(VueI18n)
Vue.use(Vuetify, {
	components: {
		VApp
	}
})
