<template>
	<button class="buttonComponent" @click.prevent="onClick">
		<!-- @slot Use this slot default -->
		<slot></slot>
	</button>
</template>

<script lang="ts">
import myMixin from './mixin'
import Component, { mixins } from 'vue-class-component'
import { Emit } from 'vue-property-decorator'

/**
 * This is an example of creating a reusable button component and using it with external data.
 * @author [Rafael](https://github.com/rafaesc92)
 * @version 1.0.5
 */
@Component({
	name: 'ClassComponent',
	props: {
		bundleHash: Number
	}
})
export default class MyComponent extends mixins(myMixin) {
	/**
	 * @public
	 */
	onClick(a: string) {
		this.$emit('success', a)
	}

	@Emit()
	fail() {
		return 1
	}
}
</script>

<style scoped>
.button {
	padding: 0.5em 1.5em;
	color: #666;
	background-color: #fff;
	border: 1px solid blue;
	border-radius: 0.3em;
	text-align: center;
	vertical-align: middle;
	cursor: pointer;
}
</style>
