declare module 'walkes' {
	import { Node } from 'acorn'

	export default function(ast: Node, visitors: any): void
}
