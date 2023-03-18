<template>
	<select name="mySelect">
		<!-- @slot where the options will be listed -->
		<slot />
	</select>
</template>

<script>
/**
 * @requires ./MyOption.vue
 */
export default {
	name: 'DropDown',
	props: {
		/**
		  * Provides a two-way data binding interface to the component
 			* @model
			* @tttt
			* @see https://vuejs.org/v2/guide/components-custom-events.html#sync-Modifier
		 */
		modelValue: {
			type: String,
			default: 'default'
		}
	}
}
</script>
