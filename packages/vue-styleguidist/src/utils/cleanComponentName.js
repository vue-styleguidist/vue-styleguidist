export default function cleanComponentName(displayName) {
	return displayName.replace(/[^A-Za-z0-9]/g, '')
}
