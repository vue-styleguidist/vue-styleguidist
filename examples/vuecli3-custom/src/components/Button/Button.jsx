/**
 * The only true button.
 */
export default {
	name: 'Button',
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
				// eslint-disable-next-line no-console
				console.log('You have clicked me!', event.target)
			}
		}
	},
	computed: {
		fontSize() {
			let size
			switch (this.size) {
				case 'small':
					size = '10px'
					break
				case 'normal':
					size = '14px'
					break
				case 'large':
					size = '18px'
					break
			}
			return size
		}
	},
	render() {
		return (
			<div className="Button">
				<button
					className="button"
					on-click={this.onClick}
					style={{ color: this.color, fontSize: this.fontSize }}
				>
					{this.$slots.default}
				</button>
			</div>
		)
	}
}
