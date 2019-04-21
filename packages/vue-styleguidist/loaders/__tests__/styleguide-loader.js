import vm from 'vm'
import path from 'path'
import { readFileSync } from 'fs'
import styleguideLoader from '../styleguide-loader'

/* eslint-disable quotes */
describe('styleguide-loader', () => {
	const file = path.resolve(__dirname, '../../../../test/components/Button.vue')
	const configDir = path.resolve(__dirname, '../../../../test')

	it('should return valid, parsable JS', () => {
		const result = styleguideLoader.pitch.call(
			{
				request: file,
				_styleguidist: {
					sections: [{ components: 'components/**/*.js' }],
					configDir,
					getExampleFilename: () => 'Readme.md',
					getComponentPathLine: filepath => filepath
				},
				addContextDependency: () => {}
			},
			readFileSync(file, 'utf8')
		)
		expect(result).toBeTruthy()
		expect(() => new vm.Script(result)).not.toThrow()
	})

	it('should add context dependencies to webpack from contextDependencies config option', () => {
		const contextDependencies = ['foo', 'bar']
		const addContextDependency = jest.fn()
		styleguideLoader.pitch.call(
			{
				request: file,
				_styleguidist: {
					sections: [{ components: 'components/**/*.js' }],
					configDir,
					getExampleFilename: () => 'Readme.md',
					getComponentPathLine: filepath => filepath,
					contextDependencies
				},
				addContextDependency
			},
			readFileSync(file, 'utf8')
		)
		expect(addContextDependency).toHaveBeenCalledTimes(2)
		expect(addContextDependency).toHaveBeenCalledWith(contextDependencies[0])
		expect(addContextDependency).toHaveBeenCalledWith(contextDependencies[1])
	})
})
