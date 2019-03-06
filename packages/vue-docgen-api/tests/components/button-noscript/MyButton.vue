<template>
	<button class="buttonComponent">
		<!-- @slot Use this slot default -->
		<slot/>
	</button>
</template>

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
