import { mount } from 'cypress/vue2'
import 'prismjs/themes/prism-coy.css'
import dedent from 'dedent'
import './index.cy.css'
import getHighlighter from './index'

let highlight: Awaited<ReturnType<typeof getHighlighter>>

describe('VueInbrowserPrismjsHighlighter', () => {
	before(async () => {
		highlight = await getHighlighter('error-squiggles')
	})

	it('highlights code from vue sfc components', () => {
		const code = dedent`
    <script lang="ts">
    let a:number = 1

    // now what if a line would come to wrap like this or like that?
    type A = {
      a: number
    }

    export default 
    </script>
    <template>
      <div>
        {{ a }}
      </div>
    </template>`
		mount({
			data: () => ({
				html: highlight('vue-sfc')(code)
			}),
			template: `<pre v-html="html" />`
		})
		cy.get('pre').should('have.text', code)
	})

	it('highlights code from vsg examples with errors', () => {
		const code = dedent`
    let a = 1
    <div>
      {{ a }}
    </div>`

		const errorLoc = {
			start: {
				line: 0,
				column: 0
			},
			end: {
				line: 0,
				column: 5
			}
		}

		mount({
			data: () => ({
				html: highlight('vsg')(code, errorLoc)
			}),
			template: `<pre v-html="html" />`
		})
		cy.get('pre').should('have.text', `     ${code}`)
	})
})
