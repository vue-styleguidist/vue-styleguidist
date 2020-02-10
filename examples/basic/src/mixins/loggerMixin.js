/* eslint-disable no-console */
export const myProps = {
	props: {
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
