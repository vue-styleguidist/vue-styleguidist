import path from 'path'
import identity from 'lodash/identity'
import getComponents from '../getComponents'

describe('getComponents', () => {
	it('should return an object for components', () => {
		const result = getComponents(['Foo.js', 'Bar.js'], {
			configDir: path.resolve(__dirname, '../../../test'),
			getExampleFilename: identity,
			getComponentPathLine: identity
		})

		expect(result).toMatchObject([
			{
				slug: 'foo',
				module: {
					require: 'Foo.js'
				},
				props: {},
				hasExamples: false,
				metadata: {}
			},
			{
				slug: 'bar',
				module: {
					require: 'Bar.js'
				},
				props: {},
				hasExamples: false,
				metadata: {}
			}
		])
	})
})
