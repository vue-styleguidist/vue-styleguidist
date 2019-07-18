import parseComponent from '../parseComponent'

describe('parseComponent', () => {
	it('should detect templates', () => {
		const comp = parseComponent(`
        <template>
            <template>
                <div>hello</div>
            </template>
            hello world
        </template>`)
		expect(comp.template).toMatchInlineSnapshot(`
				
				<template>
				  <div>
				    hello
				  </div>
				</template>
				hello world
				
		`)
	})

	it('should detect scripts', () => {
		const comp = parseComponent(`
        <script>
        export default {}
        </script>`)
		expect(comp.script).toMatchInlineSnapshot(`
		"
		        export default {}
		        "
	`)
	})

	it('should detect style', () => {
		const comp = parseComponent(`
        <style>
        .class3{
            color: red;
        }
        </style>`)
		expect(comp.style).toMatchInlineSnapshot(`
		"
		        .class3{
		            color: red;
		        }
		        "
	`)
	})

	it('should not see internal templates', () => {
		const comp = parseComponent(`
    <div>
        <template lang="pug">
            <template>
                <div>hello</div>
            </template>
            sad
        </template>
    </div>`)
		expect(comp.template).toBeUndefined()
	})
})
