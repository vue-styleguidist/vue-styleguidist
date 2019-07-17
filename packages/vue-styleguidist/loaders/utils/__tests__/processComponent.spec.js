import path from 'path'
import processComponent from '../processComponent'

const config = {
	configDir: __dirname,
	getExampleFilename: componentpath => path.join(path.dirname(componentpath), 'Readme.md'),
	getComponentPathLine: componentpath => componentpath
}
describe('processComponent', () => {
	it('processComponent() should return an object for section with content', () => {
		const result = processComponent('pizza.js', config)

		expect(result).toMatchObject({
			slug: 'pizza',
			module: {
				require: 'pizza.js'
			}
		})
	})
})
