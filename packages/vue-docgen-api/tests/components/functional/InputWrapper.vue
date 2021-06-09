<template functional>
	<div
		:class="{
			[$style.root]: true,
			[$style.error]: props.error,
			[$style.focused]: props.focused,
			[$style.hasIcon]: props.icon,
			[$style.disabled]: props.disabled
		}"
	>
		<label
			:class="{
				[$style.label]: true,
				[$style.labelFloating]:
					props.focused || (typeof props.value !== 'undefined' && props.value !== ''),
				[$style.labelAlwaysFloating]: props.labelAlwaysFloating || props.prefix || props.disabled
			}"
			:for="props.id"
			>{{ props.label }}</label
		>
		<div :class="$style.inputGroup">
			<SvgIcon v-if="props.icon" :name="props.icon" :class="$style.icon" />
			<div v-if="props.prefix" :class="$style.prefix">{{ props.prefix }}</div>
			<div :class="$style.input">
				<slot />
			</div>
		</div>
		<input :value="props.value" type="text" />
		<div :class="$style.errorMessage">{{ props.errorMessage }}</div>
	</div>
</template>

<script>
/**
 * Wrapper for input elements
 */
export default {
	functional: true,
	name: 'InputWrapper',
	status: 'ready',
	release: '0.0.1',
	props: {
		/**
		 * Should display error?
		 */
		error: {
			type: Boolean,
			default: false
		},
		/**
		 * True if input label should always be "up there"
		 */
		labelAlwaysFloating: {
			type: Boolean,
			default: false
		},
		/**
		 * String for label text
		 */
		label: {
			type: String,
			required: true
		},
		/**
		 * Should the input be focused?
		 */
		focused: {
			type: Boolean,
			default: false
		},
		/**
		 * Should the input be disabled?
		 */
		disabled: {
			type: Boolean,
			default: false
		},
		/**
		 * Prefix string for input field
		 */
		prefix: String,
		/**
		 * Prefix icon for input field
		 */
		icon: {
			type: String,
			default: ''
		},
		/**
		 * String with relevant error message
		 */
		errorMessage: {
			type: String,
			default: ''
		},
		/**
		 * Input value
		 * @model
		 */
		value: {
			required: true,
			type: String
		},
		/**
		 * Input ID
		 */
		id: {
			type: [String, Number],
			required: true
		}
	}
}
</script>

<style lang="scss" module>
/* Removed styles as they are irrelevant */
</style>

<docs lang="md">
`` `jsx <input-wrapper label="Label" value="–" id="sdf"> … </input-wrapper>  `` `
</docs>
