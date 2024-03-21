import { computed, defineComponent, h } from 'vue'

const logoLockUp = {
	a: {
		viewBox: 'lockup-viewBox-a',
		data: 'lockup-data-a'
	},
	b: {
		viewBox: 'lockup-viewBox-b',
		data: 'lockup-data-b'
	}
}

const logoMark = {
	a: {
		viewBox: 'mark-viewBox-a',
		data: 'mark-data-a'
	},
	b: {
		viewBox: 'mark-viewBox-b',
		data: 'mark-data-b'
	}
}

export const CypressLockUp = defineComponent({
	props: {
		variant: {
			type: String as () => keyof typeof logoLockUp,
			default: 'default'
		}
	},
	setup(props) {
		const resolvedVariant = computed(() => logoLockUp[props.variant])
		return () =>
			h('svg', {
				viewBox: resolvedVariant.value?.viewBox,
				vHtml: resolvedVariant.value?.data
			})
	}
})

export const CypressMark = defineComponent({
	props: {
		variant: {
			type: String as () => keyof typeof logoMark,
			default: 'default'
		}
	},
	setup(props) {
		const resolvedVariant = computed(() => logoMark[props.variant])
		return () =>
			h('svg', {
				viewBox: resolvedVariant.value?.viewBox,
				vHtml: resolvedVariant.value?.data
			})
	}
})
