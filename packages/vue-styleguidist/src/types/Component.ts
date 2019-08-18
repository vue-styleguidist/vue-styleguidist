export interface ComponentProps {
	displayName?: string
	visibleName?: string
	examples?: any[]
	example?: any
}

export interface Component {
	filepath?: string
	slug?: string
	pathLine?: string
	hasExamples?: boolean
	name?: string
	props: ComponentProps
	module: { require: string; toAST: () => any; default?: any } | any
	metadata: any
}
