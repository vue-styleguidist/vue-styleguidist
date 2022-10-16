<template>
	<div></div>
</template>

<script>
import { externalProps } from './external-props'
import defaultExternalProps from './external-props'
const localPropVariable = [1, 2, 3]

export default {
	props: {
		firstProp: {
			type: Number,
			validator: v => localPropVariable.includes(v)
		},
		secondProp: {
			type: String,
			validator: v => externalProps.includes(v)
		},
		thirdProp: {
			type: String,

			// Let's make sure it also works with a different syntax
			validator(v) {
				return defaultExternalProps.indexOf(v) !== -1
			}
		}
	}
}
</script>
