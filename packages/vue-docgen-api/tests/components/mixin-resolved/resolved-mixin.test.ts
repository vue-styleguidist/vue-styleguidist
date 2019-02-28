import * as path from 'path'

import { ComponentDoc, PropDescriptor } from '../../../src/Documentation'
import { parse } from '../../../src/main'
const button = path.join(__dirname, './button.vue')
let docButton: ComponentDoc

describe('tests button', () => {
  beforeAll(done => {
    docButton = parse(button, {
      alias: {
        '@mixins': path.resolve(__dirname, '../../mixins'),
      },
      modules: [path.resolve(__dirname, '../../mixins')],
    })
    done()
  })

  describe('props', () => {
    let props: { [propName: string]: PropDescriptor }

    beforeAll(() => {
      props = docButton.props ? docButton.props : {}
    })

    it('should return the "color" prop description from passthrough exported mixin', () => {
      expect(props.color.description).toEqual('Another Mixins Error')
    })

    it('should return the "propsAnother" prop description from a vue file mixin', () => {
      expect(props.propsAnother.description).toEqual('Example prop in vue file')
    })
  })
})
