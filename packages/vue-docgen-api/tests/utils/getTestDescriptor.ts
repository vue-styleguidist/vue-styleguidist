export default function getTestDescriptor<T extends { name: string }>(
	props: T[] | undefined,
	propName: string
): T {
	const prop = props && props.find(p => p.name === propName)
	return prop || ({ name: '<fail>' } as T)
}
