<template>
	<div>
		HELLO
	</div>
</template>

<script lang="ts">

import { Vue, Component, Prop } from 'nuxt-property-decorator'

@Component
export default class SomeComponent extends Vue {
	/** Description for propA */
	@Prop({ type: Number, default: 3}) readonly propA!: number

  /**
   * Description for mwthod. Don't froget to put `@public`.
	 * @public
   */
	public onClick(name: string) {
    /**
     * Success event when we click.
		 * @property {string} name description of name.
     * @property {boolean} success always true.
     */
    this.$emit('success', { name, success: true })
	}
}
</script>
