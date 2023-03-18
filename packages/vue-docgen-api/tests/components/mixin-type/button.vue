<template>
	<button
		class="buttonComponent"
		@click.prevent="onClick"
		:style="`background:${color};width:${size}px;`"
	/>
</template>

<script>
import { typed } from '@mixins/index'

export default {
	mixins: [typed],
	props: {
    a: {
      default: 'xxx'
    }
  }
}
</script>
