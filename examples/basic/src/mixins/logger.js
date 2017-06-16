/* eslint-disable no-console */
export default {
	mounted() {
		this.hello();
	},
	methods: {
		hello() {
			console.log('hello from mixin!');
		},
	},
};
