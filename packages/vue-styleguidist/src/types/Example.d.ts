/* eslint-disable import/prefer-default-export */

export interface Example {
	type: 'code' | 'text'
	lang: string
	content: { raw: string; compiled: string } | string
	settings: { [key: string]: string }
	compiled?: string
}

export interface ExampleLoader extends Example {
	content: string
}
