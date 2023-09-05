<template>
	<svg
		:height="radius * 2"
		:width="radius * 2"
		@click="
			convertTheThings(1)
			emit('save', circumference)
		"
	>
		<circle
			stroke="#EBEBEB"
			fill="transparent"
			:stroke-width="stroke"
			:r="normalizedRadius"
			:cx="radius"
			:cy="radius"
		/>
		<circle
			stroke="currentColor"
			fill="transparent"
			:stroke-dasharray="circumference + ' ' + circumference"
			:style="{ strokeDashoffset }"
			:stroke-width="stroke"
			:r="normalizedRadius"
			:cx="radius"
			:cy="radius"
			stroke-linecap="round"
		/>
	</svg>
</template>

<script>
function convertTheThings(value) {
	return value
}

export { convertTheThings }
</script>

<script lang="ts" setup>
import { computed } from 'vue'
import type * as Interfaces from './interfaces'

const emit = defineEmits<{
	/**
	 * Cancels everything
	 */
	(event: 'cancel'): void
	/**
	 * Save the world
	 */
	(event: 'save', arg: number): void
}>()

defineExpose([
	/**
	 * position of the dash offset
	 */
	'strokeDashoffset'
])

const props = withDefaults(defineProps<Interfaces.PropsInterface>(), {
	progress: 0
})

const normalizedRadius = props.radius - props.stroke * 2
const circumference = normalizedRadius * 2 * Math.PI

const strokeDashoffset = computed(() => {
	return circumference - (props.progress / 100) * circumference
})
</script>

<style scoped>
svg {
	transform: rotate(-90deg);
	transform-origin: 50% 50%;
}
</style>
