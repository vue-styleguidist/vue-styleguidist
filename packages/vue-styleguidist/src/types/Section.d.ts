import { EXPAND_MODE } from './enums'
import { Component } from './Component'

interface BaseSection {
	name?: string
	visibleName?: string
	components?: any
	sections?: BaseSection[]
	ignore?: string | string[]
	content?: string
	sectionDepth?: number
	description?: string
	exampleMode?: EXPAND_MODE
	usageMode?: EXPAND_MODE
	slug?: string
	filepath?: string
	href?: string
	external?: string
}

export interface Section extends BaseSection {
	components?: (() => string | string[]) | string | string[]
	sections?: Section[]
}

export interface ProcessedSection extends BaseSection {
	name: string
	components?: Component[]
	content: string
	sections: ProcessedSection[]
}
