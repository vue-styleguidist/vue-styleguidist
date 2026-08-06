<template>
	<svg :height="radius * 2" :width="radius * 2">
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

<script lang="ts" setup>
import { computed } from 'vue'

defineOptions({
	name: 'ProgressBlobInVue'
})

const props = withDefaults(
	defineProps<{
		/**
		 * The radius of the circle.
		 */
		radius: number
		/**
		 * The stroke width of the circle.
		 */
		stroke: number
		/**
		 * The percentage of the circle that is filled.
		 */
		progress?: number
	}>(),
	{
		progress: 0
	}
)

const normalizedRadius = props.radius - props.stroke * 2
const circumference = normalizedRadius * 2 * Math.PI

const strokeDashoffset = computed(() => {
	return circumference - (props.progress / 100) * circumference
})
</script>
