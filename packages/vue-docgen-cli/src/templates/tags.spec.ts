import { expect } from 'vitest'
import { renderTags } from './tags'

describe('renderTags', () => {
	it('should render tags', () => {
		expect(
			renderTags({
				since: [
					{ title: 'since', content: '1.2.3' },
					{ title: 'since', content: 'ever' }
				]
			})
		).toMatchInlineSnapshot(`"<br/>\`@since\` 1.2.3<br/>\`@since\` ever"`)
	})
})
