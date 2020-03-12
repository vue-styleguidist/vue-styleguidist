import * as Rsg from 'react-styleguidist'

export interface CodeExample extends Omit<Rsg.CodeExample, 'content'> {
	content: { raw: string; compiled: string } | string
	compiled?: string
}
