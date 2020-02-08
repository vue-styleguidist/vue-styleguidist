/* eslint-disable no-console */

export default {
	props: {
		/**
		 * @ignore
		 */
		propA: {
			type: String,
			default: '#333'
		}
	},
	mounted() {
		this.hello()
	},
	methods: {
		hello() {
			console.log('hello from mixin!')
		}
	}
}
