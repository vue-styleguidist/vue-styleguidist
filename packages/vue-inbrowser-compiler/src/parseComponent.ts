interface VsgSFCDescriptorSimple {
	template?: string
	script?: string
}

export interface VsgSFCDescriptor extends VsgSFCDescriptorSimple {
	styles?: string[]
}

const PARTS: Array<keyof VsgSFCDescriptorSimple> = ['template', 'script']

export default function parseComponent(code: string): VsgSFCDescriptor {
	// reinintialize regexp after each tour
	const partsRE: { [partName: string]: RegExp } = PARTS.reduce(
		(ret: { [partName: string]: RegExp }, part: string) => {
			ret[part] = new RegExp(`<${part}[^>]*>((.|\\n|\\r)+)</${part}>`, 'g')
			return ret
		},
		{}
	)

	const descriptor: VsgSFCDescriptor = {}
	const partsWithWrapper: VsgSFCDescriptorSimple = {}

	// extract all parts
	PARTS.forEach(part => {
		const res = partsRE[part].exec(code)
		if (res) {
			partsWithWrapper[part] = res[0]
			descriptor[part] = res[1]
		}
	})

	// make sure they are the only components of the code
	let check = code
	let i = PARTS.length
	while (i-- && check.length) {
		const withWrapper = partsWithWrapper[PARTS[i]]
		if (withWrapper) {
			check = check.replace(withWrapper, '').trim()
		}
	}

	// we assume that
	const styleRE = /(<style[^>]*>)([^<]+)(<.......)/g
	const styleFollowUpRE = /()([^<]+)(<.......)/g
	let styleAnalyzed: string = ''
	let stylesWithWrapper: string[] = []
	let stylePart: RegExpExecArray | undefined | null = styleRE.exec(check)
	let styleHeader: string = stylePart ? stylePart[1] : ''
	let styles: string[] | undefined
	while (stylePart) {
		styleAnalyzed += stylePart[2]

		if (stylePart[3] === '</style>') {
			if (!styles) {
				styles = []
			}
			styles.push(styleAnalyzed)
			stylesWithWrapper.push(`${styleHeader}${styleAnalyzed}</style>`)
			styleAnalyzed = ''
			styleHeader = ''

			// if we just started to analyze a new style tag
			stylePart = styleRE.exec(check)
			styleHeader = stylePart ? stylePart[1] : ''
		} else {
			styleAnalyzed += stylePart[3]
			styleFollowUpRE.lastIndex = styleRE.lastIndex
			stylePart = styleFollowUpRE.exec(check)
		}
	}
	if (styles) {
		descriptor.styles = styles
		let i = styles.length
		while (i--) {
			check = check.replace(stylesWithWrapper[i], '').trim()
		}
	}
	return check.length ? {} : descriptor
}
