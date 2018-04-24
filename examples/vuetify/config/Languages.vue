<template>
	<div class="language">
		<v-select :items="items" v-model="e1" label="Language" single-line></v-select>
	</div>
</template>

<script>
	import messages from './i18n';
	export default {
		data() {
			return {
				e1: '',
				items: [{
					text: 'English',
					value: 'en'
				}, {
					text: 'Español',
					value: 'es'
				}],
			};
		},
		watch: {
			e1(value) {
				this.$i18n.locale = value
			},
		},
	};

</script>
<style>
	.language {
		width: 102px;
		position: absolute;
		right: 0;
		top: -10px;
	}

</style>
