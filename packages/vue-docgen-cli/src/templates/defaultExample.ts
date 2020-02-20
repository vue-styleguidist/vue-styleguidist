import { ComponentDoc, getDefaultExample } from 'vue-docgen-api'

export default (doc: ComponentDoc): string => {
	return `
\`\`\`vue live
${getDefaultExample(doc)}
\`\`\`
	`
}
