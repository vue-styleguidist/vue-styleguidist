import Vue from 'vue'
import { three } from '../../RandomButton/dog-names'

new Vue({
	data() {
		let i = 0
		return {
			opt: three.map(a => ({ text: a, value: i++ }))
		}
	},
	template: '<Radio :options="opt" />'
})
