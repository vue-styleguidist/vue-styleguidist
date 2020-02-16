/* eslint-disable no-console */
export const myProps = {
	props: {
		/**
		 * This prop comes from the loginMixin mixin
		 */
		inMixin: {
			type: Boolean,
			default: true
		},
		/**
		 * @ignore
		 */
		propA: {
			type: String,
			default: '#333'
		}
	}
}

export const logger = {
	mounted() {
		this.hello()
	},
	methods: {
		hello() {
			console.log('hello from mixin!')
		}
	}
}
