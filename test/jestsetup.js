/* eslint-disable no-console */
import Vue from 'vue'
import { configure, shallow, render, mount } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

process.env.NODE_ENV = 'test'
Vue.config.productionTip = false
Vue.config.devtools = false

// Make Enzyme functions available in all test files without importing
global.shallow = shallow
global.render = render
global.mount = mount

configure({ adapter: new Adapter() })

// document.createRange “polyfill” for CodeMirror
document.createRange = function() {
	return {
		setEnd: () => {},
		setStart: () => {},
		getBoundingClientRect() {
			return {
				right: 0
			}
		},
		getClientRects() {
			return {
				right: 0
			}
		}
	}
}

// requestAnimationFrame “polyfill”
window.requestAnimationFrame = a => a()

jest.mock('react-scripts/config/webpack.config.dev', () => ({ cra: true }), { virtual: true })
jest.mock('webpack-dev-server', function() {
	return function() {
		return {
			app: {}
		}
	}
})
