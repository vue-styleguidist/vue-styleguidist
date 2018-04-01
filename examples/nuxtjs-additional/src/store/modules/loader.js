const mutations = {
	SET(state, loader) {
		state.loader = loader;
	},
};

const actions = {
	START({ commit }) {
		commit('SET', true);
	},
	STOP({ commit }) {
		commit('SET', false);
	},
};

const getters = {
	GET(state) {
		return state.loader;
	},
};

const state = () => ({
	loader: false,
});

export default {
	namespaced: true,
	state,
	mutations,
	actions,
	getters,
};
