import Vue from 'vue'
import Vuex from 'vuex'
import { state, mutations, getters } from './mutations'

Vue.use(Vuex)

export default () =>
	// eslint-disable-next-line import/no-named-as-default-member
	new Vuex.Store({
		state,
		getters,
		mutations
	})
