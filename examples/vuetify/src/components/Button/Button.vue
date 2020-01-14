
<script>
import { VBtn } from 'vuetify/lib'
import loggerMixin from '../../mixins/loggerMixin'

/**
 * The only true button.
 */
export default {
	name: 'Button',
	extends: VBtn,
	mixins: [loggerMixin],
	props: {
		/**
		 * The color for the button.
		 * @values primary, secondary, accent, error, info, success, warning
		 *
		 */
		color: {
			type: String,
			default: 'success'
		},
		/**
		 * The size of the button
		 * @values small, normal, large
		 */
		size: {
			type: String,
			default: 'normal'
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
}
</script>