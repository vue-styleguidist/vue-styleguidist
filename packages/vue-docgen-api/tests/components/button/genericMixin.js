export default {
	props: {
		/**
		 * Another mixin
		 */
		secret: {
			type: String
		}
	},
	mounted() {
		this.hello()
	},
	methods: {
		hello() {
			// eslint-disable-next-line no-console
			console.log('hello from mixin!')
		}
	}
}
