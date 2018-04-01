import Vue from 'vue';
import Vuex from 'vuex';
import BootstrapVue from 'bootstrap-vue';
import VueI18n from 'vue-i18n';
import Axios from 'axios';
import createStore from '../src/store/index';
import '../node_modules/bootstrap/dist/css/bootstrap.css';

/*
 * Load bootstrap
 */

Vue.use(BootstrapVue);

/*
 * Create Axios instance with configuration.
 */

let $axios = Axios.create(); /* jshint ignore:start */

/*
 * Extend axios to make it similar
 * to @nuxtjs/axios original plugin
 */
/* eslint-disable */ for (let method of [
	'request',
	'delete',
	'get',
	'head',
	'options',
	'post',
	'put',
	'patch',
]) {
	$axios['$' + method] = function() {
		return $axios[method].apply($axios, arguments).then(res => res && res.data);
	};
} /* jshint ignore:end */ /*
 * Load axios globaly
 */
/* eslint-enable */ Object.defineProperty(Vue.prototype, '$axios', {
	get() {
		return $axios;
	},
	set(val) {
		$axios = val;
	},
	configurable: true,
});

/*
 * Load store globaly with axios injection
 */

Vue.use(Vuex);
const store = createStore();
store.$axios = $axios;
Vue.prototype.$store = store;

/*
 * Enable access to Vue in window
 * :/ Dirty hack for VueI18n :/
 */

window.Vue = Vue;

/*
 * Language files load
 */

const en = require('../src/assets/i18n/en.json');
const pl = require('../src/assets/i18n/pl.json');

const locales = [{ code: 'en' }, { code: 'pl' }];

/*
 * VueI18n instance initialization
 */

const i18n = new VueI18n({
	locale: 'en',
	messages: { en, pl },
	fallbackLocale: 'en',
});

/*
 * Manualy assign _i18n beacuse VueI18n above 7.3.2 uses it
 * to inject $i18n.
 */
// eslint-disable-next-line
Vue.prototype._i18n = i18n;

/*
 * Manualy assign locales to $i18n so we can access them
 */

Vue.prototype.$i18n.locales = locales;

/*
 * Mock switchLocalePath function from nuxt-vuei18n plugin
 * It's not needed since it's dedicated for ssr.
 */
// eslint-disable-next-line
Vue.prototype.switchLocalePath = locale => {
	// console.log(Vue.prototype.$i18n.locales.find(l => l.code === locale));
};

/*
 * Inject click with locale code change function.
 * Before injecting click function component must have dedicated id.
 */

window.onload = () => {
	locales.map(locale =>
		document.getElementById(`languageChangeTo${locale.code}`).addEventListener('click', () => {
			Vue.prototype.$i18n.locale = locale.code;
		})
	);
};
