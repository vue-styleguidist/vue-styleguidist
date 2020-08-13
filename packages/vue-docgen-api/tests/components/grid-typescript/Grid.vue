<template>
	<div>
		<!-- @slot Use this slot header -->
		<slot name="header"></slot>
		<table class="grid">
			<thead>
				<tr>
					<th
						v-for="key in columns"
						:key="key"
						@click="sortBy(key)"
						:class="{ active: sortKey == key }"
					>
						{{ key | capitalize }}
						<span class="arrow" :class="sortOrders[key] > 0 ? 'asc' : 'dsc'"></span>
					</th>
				</tr>
			</thead>
			<tbody>
				<tr v-for="entry in filteredData" :key="entry">
					<td v-for="key in columns" :key="key">{{ entry[key] }}</td>
				</tr>
			</tbody>
		</table>

		<!-- @slot Use this slot footer -->
		<slot name="footer"></slot>
	</div>
</template>

<script lang="ts">
import Vue from 'vue'
import text from './utils'

interface IData {
	sortKey: string
	sortOrders: Record<string, number>
	filterKey?: string
}

interface ForParam {
	color: string
}

/**
 * This is an example of creating a reusable grid component and using it with external data.
 * @version 1.0.5
 * @author [Rafael](https://github.com/rafaesc92)
 * @since Version 1.0.1
 */
export default Vue.extend({
	name: 'grid',
	props: {
		/**
		 * object/array defaults should be returned from a factory function
		 * @version 1.0.5
		 * @since Version 1.0.1
		 * @see See [Wikipedia](https://en.wikipedia.org/wiki/Web_colors#HTML_color_names) for a list of color names
		 * @link See [Wikipedia](https://en.wikipedia.org/wiki/Web_colors#HTML_color_names) for a list of color names
		 */
		msg: {
			type: [String, Number],
			default: text
		},
		/**
		 * describe data
		 * @version 1.0.5
		 */
		data: Array,

		images: {
			type: Array,
			default: function () {
				return [{}]
			}
		},
		/**
		 * prop function
		 */
		propFunc: {
			default: function () {}
		},
		/**
		 * get columns list
		 */
		columns: {
			type: Array
		},
		/**
		 * filter key
		 * @ignore
		 */
		filterKey: {
			type: String,
			default: 'example'
		}
	},
	data(): IData {
		var sortOrders: { [key: string]: number } = {}
		;(this as any).columns.forEach(function (key: string) {
			sortOrders[key] = 1
		})
		return {
			sortKey: '',
			sortOrders: sortOrders,
			filterKey: undefined
		}
	},
	computed: {
		filteredData(): IData {
			var sortKey = this.sortKey
			var filterKey: string = this.filterKey ? this.filterKey.toLowerCase() : ''
			var order = this.sortOrders[sortKey] || 1
			var data = this.$props.data
			if (filterKey) {
				data = data.filter(function (row: { [key: string]: string }) {
					return Object.keys(row).some(function (key) {
						return String(row[key]).toLowerCase().indexOf(filterKey) > -1
					})
				})
			}
			if (sortKey) {
				data = data.slice().sort(function (a: any, b: any) {
					a = a[sortKey]
					b = b[sortKey]
					return (a === b ? 0 : a > b ? 1 : -1) * order
				})
			}
			return data
		}
	},
	filters: {
		capitalize(str: string): string {
			return str.charAt(0).toUpperCase() + str.slice(1)
		}
	},
	methods: {
		/**
		 * Sets the order
		 *
		 * @public
		 * @version 1.0.5
		 * @since Version 1.0.1
		 * @param {string} key Key to order
		 * @returns {string} Test
		 */
		sortBy(key: string): void {
			this.sortKey = key
			this.sortOrders[key] = this.sortOrders[key] * -1

			/**
			 * Success event.
			 *
			 * @event success
			 * @type {object}
			 */
			this.$emit('success', {
				demo: 'example success'
			})
		},

		/**
		 * @public
		 */
		publicMethod(test: number, param: ForParam) {
			console.log('test', test, param)
		},

		hiddenMethod(): void {
			/**
			 * Error event.
			 *
			 * @event error
			 * @type {object}
			 */
			this.$emit('error', {
				demo: 'example error'
			})
		}
	}
})
</script>

<style scoped>
.grid {
	margin-bottom: 20px;
}
</style>
