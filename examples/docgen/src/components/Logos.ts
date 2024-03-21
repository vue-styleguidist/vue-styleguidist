/* eslint-disable vue/one-component-per-file */
import { computed, defineComponent, h } from 'vue'

const logoLockUp = {
	a: {
		viewBox: '0 0 50 50',
		data: '<rect x="10" y="10" width="30" height="30" stroke="black" fill="transparent" stroke-width="5"/>'
	},
	b: {
		viewBox: '0 0 50 50',
		data: '<circle cx="25" cy="75" r="20" stroke="red" fill="transparent" stroke-width="5"/>'
	}
} as const

const logoMark = {
	a: {
		viewBox: '0 0 50 50',
		data: '<rect x="20" y="20" width="30" height="30" stroke="black" fill="transparent" stroke-width="5"/>'
	},
	b: {
		viewBox: '0 0 50 50',
		data: '<circle cx="12" cy="12" r="10" stroke="red" fill="transparent" stroke-width="5"/>'
	}
} as const

export const CypressLockUp = defineComponent({
	props: {
		variant: {
			type: String,
			default: 'default'
		}
	},
	setup(props) {
		const resolvedVariant = computed(() => logoLockUp[props.variant])
		return () =>
			h('svg', {
				viewBox: resolvedVariant.value?.viewBox,
				vHtml: resolvedVariant.value?.data
			} as any)
	}
})

export const CypressMark = defineComponent({
	props: {
		variant: {
			type: String,
			default: 'default'
		}
	},
	setup(props) {
		const resolvedVariant = computed(() => logoMark[props.variant])
		return () =>
			h('svg', {
				viewBox: resolvedVariant.value?.viewBox,
				vHtml: resolvedVariant.value?.data
			} as any)
	}
})
