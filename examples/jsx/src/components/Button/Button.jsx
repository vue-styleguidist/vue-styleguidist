import VueTypes from 'vue-types'
import PropTypes from '@znck/prop-types'
import loggerMixin from '../../mixins/loggerMixin'

/**
 * The only true button.
 */
export default {
	name: 'Button',
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
		 * The shape of my heart
		 */
		shape: PropTypes.shape({
			color: PropTypes.string,
			fontSize: PropTypes.number
		}),
		/**
		 * The size of the button
		 * `small, normal, large`
		 */
		size: VueTypes.string.def('normal'),
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
			<div class="Button">
				<button
					class="button"
					on-click={this.onClick}
					style={{ color: this.color, fontSize: this.fontSize }}
				>
					{this.$slots.default}
				</button>
			</div>
		)
	}
}
