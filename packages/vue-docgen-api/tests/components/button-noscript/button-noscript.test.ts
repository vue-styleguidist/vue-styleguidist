import * as path from 'path'
import { ComponentDoc } from '../../../src/Documentation'
import { parse } from '../../../src/main'

const button = path.join(__dirname, './MyButton.vue')
let docButton: ComponentDoc

describe('tests button with no script block', () => {
  beforeEach(done => {
    docButton = parse(button)
    done()
  })

  it('should have a slot.', () => {
    expect(Object.keys(docButton.slots).length).toEqual(1)
  })

  it('should have a default slot.', () => {
    expect(typeof docButton.slots.default !== 'undefined').toBe(true)
  })

  it('the default slot should have "Use this slot default" as description', () => {
    expect(docButton.slots.default.description).toEqual('Use this slot default')
  })

  it('should match the snapshot', () => {
    expect(docButton).toMatchSnapshot()
  })
})
