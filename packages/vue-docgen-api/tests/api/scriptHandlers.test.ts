import * as path from 'path'
import { parse, ParseOptions, TemplateParserOptions } from '../../src/main'
import Documentation from '../../src/Documentation'
import { NodePath } from 'ast-types'
import * as bt from '@babel/types'
import { ASTElement } from 'vue-template-compiler'

describe('extending handlers', () => {

	it('should execute a custom script handler', async () => {
		let hasRun = false

		await parse(path.resolve(__dirname, 'mock.vue'), {
			addScriptHandlers: [
				async function handler(
					doc: Documentation,
					componentDefinition: NodePath,
					ast: bt.File,
					opt: ParseOptions
				) {
					hasRun = true
				}
			]
		})

		expect(hasRun).toBe(true)
	})

	it('should execute a custom template handler', async () => {
		let hasRun = false

		await parse(path.resolve(__dirname, 'mock.vue'), {
			addTemplateHandlers: [
				async function handler(
					documentation: Documentation,
					templateAst: ASTElement,
					options: TemplateParserOptions
				) {
					hasRun = true
				}
			]
		});

		expect(hasRun).toBe(true)
	})
})

