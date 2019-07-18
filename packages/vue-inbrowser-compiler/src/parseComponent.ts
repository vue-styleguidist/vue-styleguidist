export interface VsgSFCDescriptor {
	template?: string
	script?: string
	style?: string
}

type PartTypes = keyof VsgSFCDescriptor

const PARTS: Array<PartTypes> = ['template', 'script', 'style']

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
	const partsWithWrapper: VsgSFCDescriptor = {}

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
	return check.length ? {} : descriptor
}
