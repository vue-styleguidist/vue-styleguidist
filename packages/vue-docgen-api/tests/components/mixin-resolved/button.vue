<template>
	<button class="buttonComponent" @click.prevent="onClick" :style="`background:${color};width:${size}px;`" />
</template>

<script>
import { anotherMixin, myMixin, funcMixin } from '@mixins/index'
import { multi, hidden } from 'multiMixin'

export default {
	mixins: [anotherMixin, myMixin, funcMixin('test')]
}
</script>
