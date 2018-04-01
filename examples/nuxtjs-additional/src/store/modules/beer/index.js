import API from './const';

const mutations = {
	SET(state, beer) {
		state.beer = beer;
	},
};

const actions = {
	/* jshint ignore:start */
	async LOAD({ commit, getters, dispatch }) {
		dispatch('loader/START', {}, { root: true });
		const data = await this.$axios
			.$get(`${API.GET_BEERS}/${getters.GET_NEXT_ID}`, { progress: false })
			.finally(() => {
				dispatch('loader/STOP', {}, { root: true });
			});
		commit('SET', data);
	},
	/* jshint ignore:end */
};

const getters = {
	GET(state) {
		return state.beer.length !== 0 ? state.beer[0] : state.beer;
	},
	GET_NEXT_ID(state) {
		return state.beer.length === 0 ? 1 : state.beer[0].id + 1;
	},
};

const state = () => ({
	beer: [],
});

export default {
	namespaced: true,
	state,
	mutations,
	actions,
	getters,
};
