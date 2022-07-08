import normalizeSfcComponent, { parseScriptCode } from './normalizeSfcComponent'

function evalFunction(sut: { script: string }): any {
	// eslint-disable-next-line no-new-func
	return new Function('require', sut.script)(() => ({
		default: { component: vi.fn() }
	}))
}

describe('normalizeSfcComponent', () => {
	it('bake template into a new Vue (export default)', () => {
		const sut = normalizeSfcComponent(`
<template>
<div/>
</template>
<script>
import {comp} from './comp'
const param = 'Foo'
export default {
	param
}
</script>`)
		expect(evalFunction(sut)).toMatchObject({ template: '\n\n<div/>\n', param: 'Foo' })
	})

	it('bake template into a new Vue (named exports)', () => {
		const sut = normalizeSfcComponent(`
<template>
<div/>
</template>
<script>
import comp from './comp'
const param = 'Foo'
export const compo = {
	param
}
</script>`)
		expect(evalFunction(sut)).toMatchObject({ template: '\n\n<div/>\n', param: 'Foo' })
	})

	it('bake template into a new Vue (es5 exports)', () => {
		const sut = normalizeSfcComponent(`
<template>
<div/>
</template>
<script>
const param = 'Foo'
module.exports = {
	param
}
</script>`)
		expect(evalFunction(sut)).toMatchObject({ template: '\n\n<div/>\n', param: 'Foo' })
	})

	it('should add const h = this.createElement at the beginning of a render function', () => {
		const sut = normalizeSfcComponent(`
<script>
export default {
render() {
	return h(Button)
},
data(){
	return {
		test:1
	}
},
computed:{
	propsSides(){
		return hello();
	}
}}
</script>`)
		expect(evalFunction(sut).render.toString()).toMatch(/const h = this\.\$createElement/)
	})
})

describe('parseScriptCode', () => {
  it('should return component code', () => {
    const ret = parseScriptCode(`
    export default () => {
      return <div>Hello</div>
    }`)

    expect(ret).toMatchInlineSnapshot(`
      {
        "component": "render: () => {
            return <div>Hello</div>
          }",
        "postprocessing": "",
        "preprocessing": "
          ",
      }
    `)
  })

  it('should replace spreads by concatenate', () => {
    const ret = parseScriptCode(`
    export default () => {
      return <div class='b' {...{class: 'a', style:{color:'blue'}}}>Hello</div>
    }`)

    expect(ret).toMatchInlineSnapshot(`
      {
        "component": "render: () => {
            return <div {...concatenate({class:'b'},{class: 'a', style:{color:'blue'}})} >Hello</div>
          }",
        "postprocessing": "",
        "preprocessing": "
          ",
      }
    `)
  })

  it('should replace spreads by concatenate on self closing tags', () => {
    const ret = parseScriptCode(`
    export default () => {
      return <CouCou class='b' {...{class: 'a', style:{color:'blue'}}} />
    }`)

    expect(ret).toMatchInlineSnapshot(`
      {
        "component": "render: () => {
            return <CouCou {...concatenate({class:'b'},{class: 'a', style:{color:'blue'}})} />
          }",
        "postprocessing": "",
        "preprocessing": "
          ",
      }
    `)
  })

  it('should return a full function', () => {
    const ret = parseScriptCode(`
    export default function (){
      return <CouCou class='b' {...{class: 'a', style:{color:'blue'}}} />
    }`)

    expect(ret).toMatchInlineSnapshot(`
      {
        "component": "render: function (){
            return <CouCou {...concatenate({class:'b'},{class: 'a', style:{color:'blue'}})} />
          }",
        "postprocessing": "",
        "preprocessing": "
          ",
      }
    `)
  })
})
