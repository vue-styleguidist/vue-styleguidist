<template>
<div class="Placeholder">
	<img class="placeholder" :src="getImageUrl()" :width="width" :height="height" />
</div>
</template>

<script>
/**
 * Button that counts how many times it was pressed and exposes a `@public` method to reset itself.
 */
export default {
	name: 'Placeholder',
	props: {
		/**
		 * `animal, bacon, beard, cat, city, food, nature, people`
		 */
		type: {
			type: String,
			default: 'animal'
		},
		width: {
			type: Number,
			default: 150
		},
		height: {
			type: Number,
			default: 150
		}
	},
	data() {
		return {
			value: 0
		}
	},
	methods: {
		getImageUrl() {
			const { type, width, height } = this
			const types = {
				animal: `http://placeimg.com/${width}/${height}/animals`,
				bacon: `http://baconmockup.com/${width}/${height}`,
				bear: `http://www.placebear.com/${width}/${height}`,
				beard: `http://placebeard.it/${width}/${height}`,
				cat: `http://lorempixel.com/${width}/${height}/cats`,
				city: `http://lorempixel.com/${width}/${height}/city`,
				food: `http://lorempixel.com/${width}/${height}/food`,
				nature: `http://lorempixel.com/${width}/${height}/nature`,
				people: `http://lorempixel.com/${width}/${height}/people`
			}
			return types[type]
		}
	}
}
</script>
<style scope>
.placeholder {
	background: #ccc;
}
</style>
<docs>

Another example with custom blocks inside `*.vue` files.

    <Placeholder type="animal"/>

</docs>
