interface VsgSFCDescriptor {
	template?: string
	script?: string
	style?: string
}

type PartTypes = keyof VsgSFCDescriptor

const PARTS: Array<PartTypes> = ['template', 'script', 'style']
const partsRE: { [partName: string]: RegExp } = PARTS.reduce(
	(ret: { [partName: string]: RegExp }, part: string) => {
		ret[part] = new RegExp(`<${part}[^>]*>((.|\\n|\\r)+)</${part}>`, 'g')
		return ret
	},
	{}
)

export default function parseComponent(code: string): VsgSFCDescriptor {
	const descriptor: VsgSFCDescriptor = {}
	const partsWithWrapper: VsgSFCDescriptor = {}
	// extract all parts
	PARTS.forEach(part => {
		const res = partsRE[part].exec(code)
		partsWithWrapper[part] = res ? res[0] : undefined
		descriptor[part] = res ? res[1].trim() : undefined
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
	return check.length ? {} : descriptor
}
