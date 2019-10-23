/* eslint-disable import/prefer-default-export */

interface CompilableContent {
	raw: string
	compiled?: string
}

export interface Example {
	type: 'code' | 'text'
	lang: string
	content: string | CompilableContent
	settings: { [key: string]: string }
	compiled?: string
}
