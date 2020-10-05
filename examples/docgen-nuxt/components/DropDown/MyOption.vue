<template>
	<option :value="val">
		<!-- @slot text displayed in the option -->
		<slot />
	</option>
</template>
<script>
export default {
	name: 'MyOption',
	props: {
		/**
		 * value associated with the option
		 */
		val: {
			type: String,
			required: true
		}
	}
}
</script>
