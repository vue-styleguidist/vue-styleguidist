import Vuex from 'vuex';

import beer from './modules/beer';
import loader from './modules/loader';

const createStore = () =>
	new Vuex.Store({
		modules: {
			beer,
			loader,
		},
	});

export default createStore;
