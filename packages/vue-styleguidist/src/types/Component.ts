import 'react-styleguidist/lib/typings/dependencies/react-docgen'

import { Component as VueConstructor } from 'vue'
import {
	PropDescriptor,
	MethodDescriptor,
	SlotDescriptor,
	EventDescriptor,
	BlockTag
} from 'vue-docgen-api'
import * as Rsg from 'react-styleguidist'
import { CodeExample } from './Example'

interface BaseComponentProps {
	displayName: string
	description?: string
	props?: PropDescriptor[]
	methods?: MethodDescriptor[]
	slots?: { [name: string]: SlotDescriptor }
	events?: { [name: string]: EventDescriptor }
	tags?: {
		[key: string]: BlockTag[]
	}
	docsBlocks?: string[]
	visibleName?: string
	examplesFile?: string
}

export interface LoaderComponentProps extends BaseComponentProps {
	examples?: Rsg.RequireItResult | null
	example?: Rsg.RequireItResult | Rsg.RequireItResult[] | null
}

export interface LoaderComponent extends Omit<Rsg.LoaderComponent, 'props'> {
	props: LoaderComponentProps
}

export interface ComponentProps extends BaseComponentProps {
	examples?: (CodeExample | Rsg.MarkdownExample)[]
	example?: (CodeExample | Rsg.MarkdownExample)[] | (CodeExample | Rsg.MarkdownExample)[][]
}

export interface Component extends Omit<Rsg.Component, 'props' | 'module'> {
	props: ComponentProps
	module: { default: VueConstructor } | VueConstructor
	subComponents?: Component[]
}
