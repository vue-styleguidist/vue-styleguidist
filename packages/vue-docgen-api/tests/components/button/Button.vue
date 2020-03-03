<template>
	<!-- here is a nice component template -->
	<button class="buttonComponent" @click.prevent="
	onClick()
	console.log('count', count)
	">
		<!-- @slot Use this slot default -->
		<slot></slot>
	</button>
</template>

<script>
import Vue from 'vue'
import { ClientTable } from 'some-plugin'
import another from '@mixins/another'
import anotherMixin from '@utils/anotherMixin'
import model from '@utils/model.json'
import genericMixin from './genericMixin'
import colorMixin from './colorMixin'
import review from '@utils/review.json'
import { multi, hidden } from '@mixins/multiMixin'
import { first, second } from './namedMixin'

Vue.use(ClientTable)

const NAME = 'buttonComponent'

console.log('mixin loaded but not parsed', hidden)

/**
 * This is an example of creating a reusable button component and using it with external data.
 * @author [Rafael](https://github.com/rafaesc92)
 * @version 1.0.5
 * @displayName Best Button
 */
export default {
	name: NAME,
	mixins: [another, genericMixin, colorMixin, multi, first, second],
	props: {
		/**
		 * The size of the button
		 * @values small, medium, large
		 */
		size: {
			default: 'normal'
		},
		/**
		 * Number of columns (1-12) the column should span.
		 */
		span: {
			type: [String, Number]
		},
		/** Sm breakpoint and above */
		spanSm: {
			type: [String, Number]
		},
		/** Md breakpoint and above */
		spanMd: {
			type: [String, Number]
		},
		/**
		 * The example props
		 */
		example: {
			default: false
		},
		/**
		 * Model example2
		 * @model
		 */
		example2: {
			type: String,
			default: 'example model'
		},
		/**
		 * The example3 props
		 */
		example3: {
			type: Number,
			default: 16
		},
		/**
		 * @ignore
		 * Add custom click actions.
		 **/
		onCustomClick: {
			default: () => () => null
		},
		/**
		 * Function default
		 */
		funcDefault: {
			type: Function,
			default: () => {
				return 'foo'
			}
		},
		/**
		 * Object or array defaults must be returned from
		 * a factory function
		 */
		propE: {
			type: Object,
			default: () => {
				return { message: 'hello' }
			}
		},
		/**
		 *@ignore
		 *
		 */
		prop1: String
	},
	data() {
		return {
			count: 0
		}
	},
	methods: {
		onClick() {
			console.log('Hello World')
			setTimeout(() => {
				/**
				 * Success event.
				 *
				 * @event success
				 * @property {object} demo - example
				 * @property {number} called - test called
				 * @property {boolean} isPacked - Indicates whether the snowball is tightly packed.
				 */
				this.$emit(
					'success',
					{
						demo: 'example'
					},
					10,
					false
				)
			}, 1000)
		}
	}
}
</script>

<style scoped>
.button {
	padding: 0.5em 1.5em;
	color: #666;
	background-color: #fff;
	border: 1px solid blue;
	border-radius: 0.3em;
	text-align: center;
	vertical-align: middle;
	cursor: pointer;
}
</style>
