/* eslint-disable no-console */
import { configure, shallow, render, mount } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

process.env.NODE_ENV = 'test'

// Make Enzyme functions available in all test files without importing
global.shallow = shallow
global.render = render
global.mount = mount

configure({ adapter: new Adapter() })

// document.createRange “polyfill” for CodeMirror
document.createRange = function () {
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

jest.mock('webpack-dev-server', function () {
	return function () {
		return {
			app: {}
		}
	}
})

// those two functions seem to be absent in JSdom 27
// FIXME: mocking them is really not a good idea.
window.clearImmediate = () => {}
window.setImmediate = () => {}
