import * as Rsg from 'react-styleguidist'
import { Component } from './Component'
import { CodeExample } from './Example'

export interface ProcessedSection extends Rsg.BaseSection {
	name: string
	href: string
	components?: Component[]
	filepath?: string
	content?: (CodeExample | Rsg.MarkdownExample)[]
	sections: ProcessedSection[]
	sectionDepth: number
	slug?: string
}
