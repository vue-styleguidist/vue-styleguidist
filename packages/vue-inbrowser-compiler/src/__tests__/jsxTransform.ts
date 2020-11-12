import JSXTransform from '../jsxTransform'

test('basic transform', () => {
	expect(JSXTransform(`return (<Comp/>)`)).toMatchInlineSnapshot(`"return (h(Comp))"`)
})

test('more composed transform', () => {
	expect(JSXTransform(`return <Comp><Single/></Comp>`)).toMatchInlineSnapshot(
		`"return h(Comp,[h(Single)])"`
	)
})

test('transform JSXText', () => {
	expect(JSXTransform(`return <Comp><Bubble>Hello</Bubble></Comp>`)).toMatchInlineSnapshot(
		`"return h(Comp,[h(Bubble,[\\"Hello\\"])])"`
	)
})

test('transform attributes', () => {
	expect(
		JSXTransform(`return <Wabble add={() => wobble} remove={wobble++}/>`)
	).toMatchInlineSnapshot(`"return h(Wabble,{add:() => wobble,remove:wobble++})"`)
})

test('transform spread attributes', () => {
	expect(JSXTransform(`return <Wabble {...spread} add={bubble}/>`)).toMatchInlineSnapshot(
		`"return h(Wabble,{...spread,add:bubble})"`
	)
})

test('transform fragment with Vue.fragment', () => {
	expect(JSXTransform(`return <><Comp/><Comp/></>`)).toMatchInlineSnapshot(
		`"return h(_Fragment,[h(Comp),h(Comp)])"`
	)
})

test('transform mukltiple JSX sources', () => {
	expect(
		JSXTransform(`
	function render1(){
		return <Comic>sans</Comic>
	}
	function render1(){
		return <Sans>froid</Sans>
	}
	return <><Comp/><Comp/></>`)
	).toMatchInlineSnapshot(`
		"
			function render1(){
				return h(Comic,[\\"sans\\"])
			}
			function render1(){
				return h(Sans,[\\"froid\\"])
			}
			return h(_Fragment,[h(Comp),h(Comp)])"
	`)
})

test('transform code in a render function', () => {
	expect(
		JSXTransform(`return {
		render(){return <Compo/>}
	}`)
	).toMatchInlineSnapshot(`
		"return {
				render(){return h(Compo)}
			}"
	`)
})

test('preserves inhouse expressions', () => {
	expect(JSXTransform(`return <Compo>{hello++}</Compo>`)).toMatchInlineSnapshot(
		`"return h(Compo,[hello++])"`
	)
})

test('map and nested JSX expressions', () => {
	expect(JSXTransform(`return <Compo>{hello.map(a =><Inside/>)}</Compo>`)).toMatchInlineSnapshot(
		`"return h(Compo,[hello.map(a =>h(Inside))])"`
	)
})

test('multiple nested JSX expressions', () => {
	expect(
		JSXTransform(
			`return <Compo>{hello.map(a =><Inside>{condition ? <Center/> : <Counter/>}</Inside>)}</Compo>`
		)
	).toMatchInlineSnapshot(
		`"return h(Compo,[hello.map(a =>h(Inside,[condition ? h(Center) : h(Counter)]))])"`
	)
})
