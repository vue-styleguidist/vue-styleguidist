export const name = 'EverButton'

/**
 * This is a button that represents a javascript only component, not a vue SFC
 */
export const Button = {
	name,

	inheritAttrs: false,

	props: {
		as: {
			type: String,
			default: 'button'
		},
		type: {
			type: String,
			default: 'button'
		},
		variant: {
			type: String,
			default: 'solid'
		},
		variantColor: {
			type: String,
			default: 'gray'
		},
		size: {
			type: [String, Number],
			default: 'md'
		},
		isDisabled: {
			type: Boolean
		}
	},

	render(h) {
		const childAttrs = {
			as: this.as,
			disabled: this.isDisabled,
			'aria-disabled': this.isDisabled
		}

		if (this.as === 'button') {
			childAttrs.type = this.type
		} else {
			childAttrs.role = 'button'
		}

		return h(
			'div',
			{
				attrs: childAttrs,
				on: this.$listeners
			},
			this.$slots.default
		)
	}
}
