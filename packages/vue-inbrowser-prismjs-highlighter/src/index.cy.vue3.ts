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

  it('highlights examples with both a script and a script setup', () => {
		const code = dedent`<script lang="ts">
                        interface A {
                          a: number
                        }
                        </script>
                        <script lang="ts" setup>
                        import { ref, h } from 'vue'

                        const MyButton = () => {
                          return h('button', 
                            {
                              style: { color: 'red' },
                              "data-cy": "my-button"
                            },
                            'inline component'
                          )
                        }

                        const msg = ref("Push Me")
                        </script>

                        <template>
                          <div class="hello">
                            <h1>Colored Text</h1>
                            <input v-model="msg">
                            <div>
                              {{ msg }}
                            </div>
                            <div>
                              <MyButton/>
                            </div>
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
})
