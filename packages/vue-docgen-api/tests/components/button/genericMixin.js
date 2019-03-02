/**
 * @mixin
 */
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
			console.log('hello from mixin!')
		}
	}
}
