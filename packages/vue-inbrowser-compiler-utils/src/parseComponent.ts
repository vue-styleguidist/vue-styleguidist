interface VsgSFCDescriptorSimple {
	template?: string
	script?: string
}

export interface VsgSFCDescriptor extends VsgSFCDescriptorSimple {
	styles?: string[]
}

// highest priority first
const PARTS: (keyof VsgSFCDescriptorSimple)[] = ['script', 'template']

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

	let codeCleaned = code

	// extract all parts
	PARTS.forEach(part => {
		const res = partsRE[part].exec(codeCleaned)
		if (res) {
			const partFound = res[0] as string
			partsWithWrapper[part] = partFound
			descriptor[part] = res[1]

			// once we have extracted one part,
			// remove it from the analyzed blob
			codeCleaned = codeCleaned.replace(partFound, '')
		}
	})

	// we assume that
	const styleRE = /(<style[^>]*>)([^<]+)(<.......)/g
	const styleFollowUpRE = /()([^<]+)(<.......)/g
	let styleAnalyzed = ''
	const stylesWithWrapper: string[] = []
	let stylePart: RegExpExecArray | undefined | null = styleRE.exec(codeCleaned)
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
			stylePart = styleRE.exec(codeCleaned)
			styleHeader = stylePart ? stylePart[1] : ''
		} else {
			styleAnalyzed += stylePart[3]
			styleFollowUpRE.lastIndex = styleRE.lastIndex
			stylePart = styleFollowUpRE.exec(codeCleaned)
		}
	}
	if (styles) {
		descriptor.styles = styles
		let j = styles.length
		while (j--) {
			codeCleaned = codeCleaned.replace(stylesWithWrapper[j], '').trim()
		}
	}
	return codeCleaned.trim().length ? {} : descriptor
}
