<template>
  <button class="buttonComponent" @click.prevent="onClick">
    <!-- @slot Use this slot default -->
    <slot></slot>
  </button>
</template>

<script lang='ts'>
import { Component, Prop, Vue } from 'vue-property-decorator'

/**
 * This is an example of creating a reusable button component and using it with external data.
 * @author [Rafael](https://github.com/rafaesc92)
 * @version 1.0.5
 */
@Component({
	name: "ClassButton"
})
export default class MyComponent extends Vue {
	aHiddenData: string = ''

	/**
	 * An example of a property typed through the decorators arguments
	 */
	@Prop({ type: String })
	propNoType = ''

	/**
	 * An example of a property typed through the annotation
	 */
	@Prop() propA: number = 0

	/**
	 * A prop with a default value
	 */
	@Prop({ default: 'default value' })
	propB: string = 'hello'

	/**
	 * A prop with a hybrid type
	 */
	@Prop() propC: string | boolean = false

	/**
	 * method testing
	 * @public
	 */
	onClick(a: string) {
		/**
		 * Success event when we click
		 */
		this.$emit('success', a)
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
