<template>
	<input type="text" :value="modelValue" @input="onInput" />
</template>

<script lang="ts" setup>
type Emits = {
	/**
	 * An event without payload
	 */
	eventWithoutPayload: []
	/**
	 * An event with payload
	 */
	eventWithPayload: [value: boolean]
	/**
	 * Event used for v-model
	 */
	'update:modelValue': [value: string]
}
const emit = defineEmits<Emits>()

type Props = {
	/**
	 * The value of the input
	 */
	modelValue: string
}
const props = defineProps<Props>()

function onInput(e: Event) {
	if (
		e.target &&
		(e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement)
	) {
		emit('update:modelValue', e.target.value)
	}
}
</script>
