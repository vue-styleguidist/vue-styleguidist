import * as path from 'path'
import { ComponentDoc } from '../../../src/Documentation'
import { parse } from '../../../src/main'

const button = path.join(__dirname, './Wrapper.vue')
let docButton: ComponentDoc

describe('tests wrapper with root slot', () => {
  beforeEach(done => {
    docButton = parse(button)
    done()
  })

  it('should have a slot.', () => {
    expect(Object.keys(docButton.slots).length).toEqual(1)
  })

  it('should have a wrapper slot.', () => {
    expect(docButton.slots.footer.description).toBe('Modal footer here')
  })

  it('should show the slot as scoped', () => {
    expect(docButton.slots.footer.scoped).toBeTruthy()
  })

  it('should match the reference for the footer slot', () => {
    expect(docButton.slots.footer).toMatchSnapshot()
  })
})
