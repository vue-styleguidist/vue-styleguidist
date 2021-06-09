import getAst from '../getAst'
import JSXTransform from '../jsxTransform'

const JSXTransformCode = (a: string) => {
	return JSXTransform(a, getAst(a), 'h', 'Fragment', 1).code
}

test('basic transform', () => {
	expect(JSXTransformCode(`() => { return (<Comp/>) }`)).toMatchInlineSnapshot(
		`"() => { return (h(Comp)) }"`
	)
})

test('more composed transform', () => {
	expect(JSXTransformCode(`() => { return <Comp><Single/></Comp> }`)).toMatchInlineSnapshot(
		`"() => { return h(Comp,[h(Single)]) }"`
	)
})

test('transform JSXText', () => {
	expect(
		JSXTransformCode(`() => { return <Comp><Bubble>Hello</Bubble></Comp> }`)
	).toMatchInlineSnapshot(`"() => { return h(Comp,[h(Bubble,[\\"Hello\\"])]) }"`)
})

test('transform attributes', () => {
	expect(
		JSXTransformCode(`() => { return <Wabble add={() => wobble} remove={wobble++}/> }`)
	).toMatchInlineSnapshot(`"() => { return h(Wabble,{add:() => wobble,remove:wobble++}) }"`)
})

test('transform spread attributes', () => {
	expect(
		JSXTransformCode(`() => { return <Wabble {...spread} add={bubble}/> }`)
	).toMatchInlineSnapshot(`"() => { return h(Wabble,{...spread,add:bubble}) }"`)
})

test('transform fragment with Vue.fragment', () => {
	expect(JSXTransformCode(`() => { return <><Comp/><Comp/></> }`)).toMatchInlineSnapshot(
		`"() => { return h(Fragment,[h(Comp),h(Comp)]) }"`
	)
})

test('transform mukltiple JSX sources', () => {
	expect(
		JSXTransformCode(`() => { 
	function render1(){
		return <Comic>sans</Comic>
	}
	function render1(){
		return <Sans>froid</Sans>
	}
	return <><Comp/><Comp/></>}`)
	).toMatchInlineSnapshot(`
		"() => { 
			function render1(){
				return h(Comic,[\\"sans\\"])
			}
			function render1(){
				return h(Sans,[\\"froid\\"])
			}
			return h(Fragment,[h(Comp),h(Comp)])}"
	`)
})

test('transform code in a render function', () => {
	expect(
		JSXTransformCode(`() => { return {
		render(){return <Compo/>}
	}}`)
	).toMatchInlineSnapshot(`
		"() => { return {
				render(){return h(Compo)}
			}}"
	`)
})

test('preserves inhouse expressions', () => {
	expect(JSXTransformCode(`() => { return <Compo>{hello++}</Compo>}`)).toMatchInlineSnapshot(
		`"() => { return h(Compo,[hello++])}"`
	)
})

test('map and nested JSX expressions', () => {
	expect(
		JSXTransformCode(`() => { return <Compo>{hello.map(a =><Inside/>)}</Compo>}`)
	).toMatchInlineSnapshot(`"() => { return h(Compo,[hello.map(a =>h(Inside))])}"`)
})

test('multiple nested JSX expressions', () => {
	expect(
		JSXTransformCode(
			`() => { return <Compo>{hello.map(a =><Inside>{condition ? <Center/> : <Counter/>}</Inside>)}</Compo>}`
		)
	).toMatchInlineSnapshot(
		`"() => { return h(Compo,[hello.map(a =>h(Inside,[condition ? h(Center) : h(Counter)]))])}"`
	)
})
