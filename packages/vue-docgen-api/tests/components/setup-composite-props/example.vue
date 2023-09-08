<template>
	<button type="button">
		{{ msg }}
	</button>
</template>

<script lang="ts" setup>
import { computed } from 'vue'

type BaseProps = {
	/**
	 * The msg of the button
	 */
	msg: string
}

type MyProps = BaseProps & {
	/**
	 * primary or secondary button
	 */
	primary?: boolean
	/**
	 * size of the button
	 */
	size?: 'small' | 'medium' | 'large'
}

const { primary = false, size = 'small', msg } = defineProps<MyProps>()
</script>
