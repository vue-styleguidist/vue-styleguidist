<template>
<div class="RandomButton">
	<button class="random-button" @click.prevent="handleClick">
		{{ label }}
	</button>
</div>
</template>

<script>
import sample from 'lodash/sample'

/**
 * An example-less button.
 * @deprecated Use the [only true button component](#button) instead
 */
export default {
	name: 'RandomButton',
	props: {
		/**
		 * List of possible labels.
		 */
		variants: {
			type: Array,
			required: true
		}
	},
	data() {
		return {
			label: sample(this.variants)
		}
	},
	methods: {
		handleClick() {
			this.label = sample(this.variants)
		}
	}
}
</script>
<style scope>
.random-button {
	padding: 0.5em 1.5em;
	color: #666;
	background-color: #fff;
	border: 1px solid currentColor;
	border-radius: 0.3em;
	font-size: 16px;
	font-weight: bold;
	text-align: center;
	vertical-align: middle;
	cursor: pointer;
}
</style>
