import transformTagsIntoObject from '../transformTagsIntoObject'

describe('transformTagsIntoObject', () => {
  it('should return ignore with description to true', () => {
    expect(transformTagsIntoObject([{ title: 'ignore', content: true }])).toMatchObject({
      ignore: [{ title: 'ignore', description: true }],
    })
  })
})
