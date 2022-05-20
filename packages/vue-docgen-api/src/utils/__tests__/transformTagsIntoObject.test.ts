import transformTagsIntoObject from '../transformTagsIntoObject'

describe('transformTagsIntoObject', () => {
	it('should return ignore with description to true', () => {
		expect(transformTagsIntoObject([{ title: 'ignore', content: true }])).toMatchObject({
			ignore: [{ title: 'ignore', description: true }]
		})
	})

	it('should return multiple authors', () => {
		expect(
			transformTagsIntoObject([
				{ title: 'author', content: 'Bobby' },
				{ title: 'author', content: 'Mike' }
			])
		).toMatchObject({
			author: [
				{
					description: 'Bobby',
					title: 'author'
				},
				{
					description: 'Mike',
					title: 'author'
				}
			]
		})
	})

	it('should parse custom tags', () => {
		expect(transformTagsIntoObject([{ title: 'asdf', content: 'qwerty' }])).toMatchObject({
			asdf: [
				{
					title: 'asdf',
					description: 'qwerty'
				}
			]
		})
	})
})
