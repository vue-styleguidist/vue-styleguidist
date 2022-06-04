declare module 'walkes' {
	import { Program } from '@babel/types'

	export default function (ast: Program, visitors: any): void
}
