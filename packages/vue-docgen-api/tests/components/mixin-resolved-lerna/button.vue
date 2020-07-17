<template>
	<button
		class="buttonComponent"
		@click.prevent="onClick"
		:style="`background:${color};width:${size}px;`"
	/>
</template>

<script>
import myMixin from '@test-vue-docgen/mixins'

export default {
	mixins: [myMixin]
}
</script>
