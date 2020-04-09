import vm from 'vm'
import path from 'path'
import { readFileSync } from 'fs'
import * as styleguideLoader from '../styleguide-loader'

jest.mock('react-styleguidist/lib/loaders/utils/getComponentFilesFromSections', () => () => [
	'foo',
	'bar'
])

jest.mock('../utils/getSections', () => () => [])

describe('styleguide-loader', () => {
	const file = path.resolve(__dirname, '../../../../../test/components/Button.vue')
	const configDir = path.resolve(__dirname, '../../../../../test')

	it('should return valid, parsable JS', done => {
		const callback = (err: string, result: string) => {
			expect(result).toBeTruthy()
			expect(() => new vm.Script(result)).not.toThrow()
			done()
		}

		styleguideLoader.pitch.call(
			{
				async: () => callback,
				request: file,
				_styleguidist: {
					sections: [{ components: 'components/**/*.js' }],
					configDir,
					getExampleFilename: () => 'Readme.md',
					getComponentPathLine: (filepath: string) => filepath,
					theme: 'path/to/themeFile.js'
				},
				addDependency: () => {},
				addContextDependency: () => {}
			} as any,
			readFileSync(file, 'utf8')
		)
	})

	it('should add context dependencies to webpack from contextDependencies config option', done => {
		const callback = () => {
			expect(addContextDependency).toHaveBeenCalledTimes(2)
			expect(addContextDependency).toHaveBeenCalledWith(contextDependencies[0])
			expect(addContextDependency).toHaveBeenCalledWith(contextDependencies[1])
			done()
		}

		const contextDependencies = ['foo', 'bar']
		const addContextDependency = jest.fn()
		styleguideLoader.pitch.call(
			{
				async: () => callback,
				request: file,
				_styleguidist: {
					sections: [{ components: 'components/**/*.js' }],
					configDir,
					getExampleFilename: () => 'Readme.md',
					getComponentPathLine: (filepath: string) => filepath,
					contextDependencies
				},
				addContextDependency
			} as any,
			readFileSync(file, 'utf8')
		)
	})
})
