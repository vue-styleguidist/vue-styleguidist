import getHighlighter from './index'

let highlight: Awaited<ReturnType<typeof getHighlighter>>

describe('VueInbrowserPrismjsHighlighter', () => {
  beforeAll(async () => {
    highlight = await getHighlighter()
  })

  it('highlights code from vsg examples', () => {
    const code = `
    let a = 1
    <div>
      {{ a }}
    </div>`
    expect(highlight('vsg')(code)).toMatchInlineSnapshot(`
      "<span class=\\"line\\"></span>
      <span class='line'>    <span class=\\"token keyword\\">let</span> a <span class=\\"token operator\\">=</span> <span class=\\"token number\\">1</span></span>
      <span class='line'>    <span class=\\"token tag\\"><span class=\\"token tag\\"><span class=\\"token punctuation\\">&lt;</span>div</span><span class=\\"token punctuation\\">></span></span></span>
      <span class='line'>      {{ a }}</span>
      <span class='line'>    <span class=\\"token tag\\"><span class=\\"token tag\\"><span class=\\"token punctuation\\">&lt;/</span>div</span><span class=\\"token punctuation\\">></span></span></span>"
    `)
  })

  it('highlights code from vue sfc components', () => {
    const code = `
    <script lang="ts" setup>
    let a:number = 1
    type A = {
      a: number
    }
    </script>
    <template>
      <div>
        {{ a }}
      </div>
    </template>`
    expect(highlight('vsg')(code)).toMatchInlineSnapshot(`
      "<span class=\\"line\\"></span>
      <span class='line'>    <span class=\\"token tag\\"><span class=\\"token tag\\"><span class=\\"token punctuation\\">&lt;</span>script</span> <span class=\\"token attr-name\\">lang</span><span class=\\"token attr-value\\"><span class=\\"token punctuation attr-equals\\">=</span><span class=\\"token punctuation\\">\\"</span>ts<span class=\\"token punctuation\\">\\"</span></span> <span class=\\"token attr-name\\">setup</span><span class=\\"token punctuation\\">></span></span><span class=\\"token script\\"><span class=\\"token language-javascript\\"></span>
      <span class='line'>    <span class=\\"token keyword\\">let</span> <span class=\\"token literal-property property\\">a</span><span class=\\"token operator\\">:</span>number <span class=\\"token operator\\">=</span> <span class=\\"token number\\">1</span></span>
      <span class='line'>    type <span class=\\"token constant\\">A</span> <span class=\\"token operator\\">=</span> <span class=\\"token punctuation\\">{</span></span>
      <span class='line'>      <span class=\\"token literal-property property\\">a</span><span class=\\"token operator\\">:</span> number</span>
      <span class='line'>    <span class=\\"token punctuation\\">}</span></span>
      <span class='line'>    </span></span><span class=\\"token tag\\"><span class=\\"token tag\\"><span class=\\"token punctuation\\">&lt;/</span>script</span><span class=\\"token punctuation\\">></span></span></span>
      <span class='line'>    <span class=\\"token tag\\"><span class=\\"token tag\\"><span class=\\"token punctuation\\">&lt;</span>template</span><span class=\\"token punctuation\\">></span></span></span>
      <span class='line'>      <span class=\\"token tag\\"><span class=\\"token tag\\"><span class=\\"token punctuation\\">&lt;</span>div</span><span class=\\"token punctuation\\">></span></span></span>
      <span class='line'>        {{ a }}</span>
      <span class='line'>      <span class=\\"token tag\\"><span class=\\"token tag\\"><span class=\\"token punctuation\\">&lt;/</span>div</span><span class=\\"token punctuation\\">></span></span></span>
      <span class='line'>    <span class=\\"token tag\\"><span class=\\"token tag\\"><span class=\\"token punctuation\\">&lt;/</span>template</span><span class=\\"token punctuation\\">></span></span></span>"
    `)
  })
})