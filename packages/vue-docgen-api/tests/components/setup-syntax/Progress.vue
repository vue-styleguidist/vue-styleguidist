<template>
  <svg
    :height="radius * 2"
    :width="radius * 2"
    @click="convertTheThings"
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
  return value;
}

</script>

<script lang="ts" setup>
import { computed } from 'vue'

const props = defineProps<{
	radius: number
	stroke: number
	progress: number
}>()

const normalizedRadius = props.radius - props.stroke * 2
const circumference = normalizedRadius * 2 * Math.PI

const strokeDashoffset = computed(() => {
  return circumference - props.progress / 100 * circumference
})

export { convertTheThings }

</script>

<style scoped>
svg{
	transform: rotate(-90deg);
	transform-origin: 50% 50%;
}
</style>