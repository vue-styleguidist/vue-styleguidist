import { mount } from 'cypress/vue2'
import "prismjs/themes/prism-tomorrow.css";
import dedent from 'dedent'
import './index.cy.css'
import getHighlighter from './index'

let highlight: Awaited<ReturnType<typeof getHighlighter>>

describe('VueInbrowserPrismjsHighlighter', () => {
  before(async () => {
    highlight = await getHighlighter()
  })

  it('highlights code from vsg examples', () => {
    const code = dedent`
    let a = 1
    <div>
      {{ a }}
    </div>`
    mount(({
      data:() => ({
        html: highlight('vsg')(code)
      }),
      template: `<pre v-html="html" />`}))
    cy.get('pre').should('have.text', code)
  })

  it('highlights code from vue sfc components', () => {
    const code = dedent`
    <script lang="ts" setup>
    let a:number = 1

    // now what if a line would come to wrap like this or like that?
    type A = {
      a: number
    }
    </script>
    <template>
      <div>
        {{ a }}
      </div>
    </template>`
    mount(({data:() => ({
      html: highlight('vsg')(code)
    }),
    template: `<pre v-html="html" />`}))
    cy.get('pre').should('have.text', code)
  })
})