<template>
	<button class="buttonComponent" @click.prevent="onClick">
		<!-- @slot Use this slot default -->
		<slot></slot>
	</button>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
/**
 * Buttons allow users to perform an action or to navigate to another page.
 * They have multiple styles for various needs, and are ideal for calling attention
 * to where a user needs to do something in order to move forward in a flow.
 *
 * @displayName Button
 * @group Form Elements
 */
const component = defineComponent({
	name: 'DsButton',
	props: {}
})

export default component
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
