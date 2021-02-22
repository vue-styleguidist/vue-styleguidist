<template>
	<div>
		<Button @click.native='pushButton'>Push Me</Button>
		<hr />
		<p>Next Dog Name: {{ dogName }}</p>
	</div>
</template>
<script lang='ts'>
const dogNames = ['test']

// You can also use 'exports.default = {}' style module exports.
export default Vue.extend({
	name: 'ButtonExample',
	data() {
		return { numClicks: 0, dogName: dogNames[0] }
	},
	methods: {
		pushButton() : number {
			this.numClicks += 1
			this.dogName = dogNames[this.numClicks]
		}
	}
})
</script>
