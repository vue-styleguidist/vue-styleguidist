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
	name: 'DropDown'
}
</script>
