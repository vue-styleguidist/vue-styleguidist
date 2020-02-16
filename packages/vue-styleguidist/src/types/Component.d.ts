import {
	PropDescriptor,
	MethodDescriptor,
	SlotDescriptor,
	EventDescriptor,
	BlockTag,
	ComponentDoc
} from 'vue-docgen-api'
import * as b from '@babel/types'
import { Example } from './Example'

export interface ComponentProps extends ComponentDoc {
	tags?: {
		[key: string]: BlockTag[]
	}
	docsBlocks?: string[]
	visibleName?: string
	examples?: { require: string; toAST: () => b.Node } | Example[] | null
	example?: Example[]
}

export interface Component {
	visibleName?: string
	filepath?: string
	slug?: string
	pathLine?: string
	hasExamples?: boolean
	name?: string
	props: ComponentProps
	module: { require: string; toAST: () => any; default?: any } | any
	metadata: any
}
