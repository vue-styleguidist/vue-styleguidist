<template>
	<h1>hello</h1>
</template>

<script>
export default {
	name: 'mock',
	props: {
		reduce: {
			type: Function,
			/**
			 * @param {Object|String} option
			 * @return {Object|String}
			 */
			default: option => option,
		}
	}
}
</script>
