import { getTypeDefinitionFromIdentifier } from './tsUtils'
import buildParser from '../../babel-parser'
import { ParseOptions } from '../../types'

describe('getTypeDefinitionFromIdentifier', () => {
	it('resolves an interface in the global scope', () => {
		const parser = buildParser({ plugins: ['typescript'] })
		const src = `
					interface AnotherInterface {
						/**
						 * contains a number
						 */
						prop3: number
					}

					interface LocalType extends AnotherInterface {
            /**
             * describe the local prop
             */
						prop1: boolean
						prop2: string
						[anotherInterface: string]: any
					}

					defineProps<LocalType>()
					`
		const astFile = parser.parse(src)
		const nodePath: any = getTypeDefinitionFromIdentifier(astFile, 'LocalType', {
			filePath: __filename
		} as ParseOptions)
		const props = nodePath
			?.map((prop: any) =>
				prop.node.key
					? prop.node.key.name + ' ' + prop.node.typeAnnotation.typeAnnotation.type
					: undefined
			)
			.filter(Boolean)
		expect(props).toStrictEqual([
			'prop3 TSNumberKeyword',
			'prop1 TSBooleanKeyword',
			'prop2 TSStringKeyword'
		])
	})

	it('resolves a Type alias in the global scope', () => {
		const parser = buildParser({ plugins: ['typescript'] })
		const src = `
					type LocalType = {
            /**
             * describe the local prop
             */
						prop1: boolean
						prop2: string
					}
					defineProps<LocalType>()
					`
		const astFile = parser.parse(src)
		const nodePath: any = getTypeDefinitionFromIdentifier(astFile, 'LocalType', {
			filePath: __filename
		} as ParseOptions)
		const props = nodePath?.map(
			(prop: any) => prop.node.key.name + ' ' + prop.node.typeAnnotation.typeAnnotation.type
		)
		expect(props).toStrictEqual(['prop1 TSBooleanKeyword', 'prop2 TSStringKeyword'])
	})

	it('resolves a Type alias defined in another file', () => {
		const parser = buildParser({ plugins: ['typescript'] })
		const src = `
		import type {LocalType} from './__fixtures__/types.ts';

		defineProps<LocalType>()
					`
		const astFile = parser.parse(src)
		const nodePath: any = getTypeDefinitionFromIdentifier(astFile, 'LocalType', {
			filePath: __filename,
			validExtends: (path: any) => path.endsWith('.ts')
		} as ParseOptions)
		const props = nodePath?.map(
			(prop: any) => prop.node.key.name + ' ' + prop.node.typeAnnotation.typeAnnotation.type
		)
		expect(props).toStrictEqual(['prop1 TSBooleanKeyword', 'prop2 TSStringKeyword'])
	})

	it('resolves a Type alias defined in another file', () => {
		const parser = buildParser({ plugins: ['typescript'] })
		const src = `
		import type {LocalType} from './__fixtures__/types.ts';

		defineProps<LocalType>()
					`
		const astFile = parser.parse(src)
		const nodePath: any = getTypeDefinitionFromIdentifier(astFile, 'LocalType', {
			filePath: __filename,
			validExtends: (path: any) => path.endsWith('.ts')
		} as ParseOptions)
		const props = nodePath?.map(
			(prop: any) => prop.node.key.name + ' ' + prop.node.typeAnnotation.typeAnnotation.type
		)
		expect(props).toStrictEqual(['prop1 TSBooleanKeyword', 'prop2 TSStringKeyword'])
	})
})
