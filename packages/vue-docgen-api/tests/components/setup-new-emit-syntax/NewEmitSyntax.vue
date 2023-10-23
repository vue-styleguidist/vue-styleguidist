<template>
	<input type="text" :value="modelValue" @input="onInput" />
</template>

<script lang="ts" setup>
const emit = defineEmits<{
  /**
   * An event without payload
   */
  eventWithoutPayload: []
  /**
   * An event with named tuple as payload
   */
  eventWithNamedPayload: [value: [boolean, string], secondValue: number]
  /**
   * An event with unnamed tuple as payload
   */
  eventWithUnnamedPayload: [number, boolean]
  /**
   * Event used for v-model
   */
  'update:modelValue': [value: string]
}>()

const props = defineProps<{
	/**
	 * The value of the input
	 */
	modelValue: string
}>()

function onInput(e: Event) {
	if (
		e.target &&
		(e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement)
	) {
		emit('update:modelValue', e.target.value)
	}
}
</script>
