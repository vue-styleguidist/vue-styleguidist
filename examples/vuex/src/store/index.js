import Vue from 'vue'
import Vuex from 'vuex'
import { state, mutations, getters } from './mutations'

Vue.use(Vuex)

// eslint-disable-next-line import/no-named-as-default-member
export default new Vuex.Store({
	state,
	getters,
	mutations
})
