<template>
  <svg
    :height="radius * 2"
    :width="radius * 2"
    @click="convertTheThings(); emit('save', circumference);"
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

defineExposed(['strokeDashoffset'])

const props = defineProps<{
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
}>()

const normalizedRadius = props.radius - props.stroke * 2
const circumference = normalizedRadius * 2 * Math.PI

const strokeDashoffset = computed(() => {
  return circumference - props.progress / 100 * circumference
})

export { convertTheThings }

</script>

<style scoped>
svg {
  transform: rotate(-90deg);
  transform-origin: 50% 50%;
}
</style>