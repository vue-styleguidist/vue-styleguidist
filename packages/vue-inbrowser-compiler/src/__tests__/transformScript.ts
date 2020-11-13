import transformScript from '../transformScript'

const transformScriptCode = (a: string) => {
	return transformScript(a)
}

test('basic transform', () => {
	expect(transformScriptCode(`import test from 'maxi-b'`)).toMatchInlineSnapshot(
		`"const maxi_b$0 = require('maxi-b');const test = maxi_b$0.default || maxi_b$0;;return {data:function(){return {test:test};}}"`
	)
})

test('basic transform with alias', () => {
	expect(transformScriptCode(`import { test as hum } from 'maxi-b'`)).toMatchInlineSnapshot(
		`"const maxi_b$0 = require('maxi-b');const hum = maxi_b$0.test;;return {data:function(){return {hum:hum};}}"`
	)
})

test('basic transform with no imports', () => {
	expect(transformScriptCode(`const output = 'test'`)).toMatchInlineSnapshot(
		`"const output = 'test';return {data:function(){return {output:output};}}"`
	)
})
