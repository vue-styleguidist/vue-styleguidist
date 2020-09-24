import loggerMixin from '../../mixins/loggerMixin'

/**
 * The only true button.
 */
export default {
	name: 'ButtonJSX',
	mixins: [loggerMixin],
	props: {
		/**
		 * The color for the button.
		 */
		color: {
			type: String,
			default: '#333'
		},
		/**
		 * Gets called when the user clicks on the button
		 * @ignore
		 */
		onClick: {
			type: Function,
			default: event => {
				console.log('You have clicked me!', event.target)
			}
		}
	},
	render() {
		return (
			<div class="Button">
				<button class="button" on-click={this.onClick} style={{ color: this.color }}>
					{this.$slots.default}
				</button>
			</div>
		)
	}
}
