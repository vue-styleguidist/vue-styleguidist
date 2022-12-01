import { parse, ParserOptions } from '@babel/parser'
import * as bt from '@babel/types'

const babelParserOptions: ParserOptions = {
	sourceType: 'module',
	strictMode: false,
	tokens: true,
	plugins: [
		'decorators-legacy',
		'doExpressions',
		'objectRestSpread',
		'classProperties',
		'classPrivateProperties',
		'classPrivateMethods',
		'exportDefaultFrom',
		'exportNamespaceFrom',
		'asyncGenerators',
		'functionBind',
		'functionSent',
		'dynamicImport',
		'numericSeparator',
		'optionalChaining',
		'importMeta',
		'bigInt',
		'optionalCatchBinding',
		'throwExpressions',
		'nullishCoalescingOperator',
		'importAssertions'
	]
}

export default function buildParse(options: ParserOptions = {}): {
	parse: (src: string) => bt.File
} {
	options = {
		...babelParserOptions,
		...options,
		plugins: [...(babelParserOptions.plugins || []), ...(options.plugins || [])]
	}
	return {
		parse(src: string): bt.File {
			return parse(src, options) as bt.File
		}
	}
}
