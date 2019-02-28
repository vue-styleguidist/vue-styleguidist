import * as path from 'path'
import { ComponentDoc } from '../../../src/Documentation'
import { parse } from '../../../src/main'

const button = path.join(__dirname, './MyButton.vue')
let docButton: ComponentDoc
describe('tests button with pug', () => {
  beforeEach(done => {
    docButton = parse(button)
    done()
  })

  it('should have a slot.', () => {
    expect(Object.keys(docButton.slots).length).toEqual(1)
  })

  it('should have a default slot.', () => {
    expect(docButton.slots.default).not.toBeUndefined()
  })

  it('the default slot should have "Use this slot default" as description', () => {
    expect(docButton.slots.default.description).toEqual('Use this slot default')
  })
})
