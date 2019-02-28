import * as path from 'path'
import { ComponentDoc } from '../../../src/Documentation'
import { parse } from '../../../src/main'

const Base = path.join(__dirname, './Base.vue')
let docBase: ComponentDoc

describe('tests Base', () => {
  beforeAll(done => {
    docBase = parse(Base)
    done()
  })

  it('should return an object', () => {
    expect(typeof docBase).toBe('object')
  })

  it('The component name should be Base', () => {
    expect(docBase.displayName).toEqual('Base')
  })

  it('The component should has a description', () => {
    expect(docBase.description).toEqual('')
  })

  it('should has props', () => {
    expect(typeof docBase.props !== 'undefined').toBe(true)
  })

  it('should the component has one prop', () => {
    expect(Object.keys(docBase.props || {}).length).toEqual(1)
  })
})
