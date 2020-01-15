import getScript from '../getScript'

it('should return given code if code can be parsed properly', () => {
	const code = `export default {
        proper:'test'
    }`
	const result = getScript(code, false)

	expect(result).toEqual(code)
})

it('should return script part if SFC is detected', () => {
	const code = `export default {
        proper:'test'
    }`
	const result = getScript(`<script lang="ts">${code}</script>`, false)

	expect(result).toEqual(code)
})

it('should return script part if SFC is detected and it has a template', () => {
	const code = `export default {
        proper:'test'
    }`
	const result = getScript(
		`<template><div/></template>
        <script lang="ts">${code}</script>`,
		false
	)

	expect(result).toEqual(code)
})

it('should return script part if weird pseudo-jsx format', () => {
	const code = `const btn = require('button')`

	const result = getScript(
		`${code}
    <btn/>`,
		false
	)

	expect(result).toEqual(code)
})

it('should return itselft if user decided for jsx', () => {
	const code = `const btn = require('button')
    <btn/>`
	const result = getScript(code, true)

	expect(result).toEqual(code)
})

it('should parse new Vue as normal', () => {
	const code = `const merge = require("lodash/merge").default
    new Vue({
        template:\`
            <button  @click.prevent="isOpen = false">Close</button>
        \`
    })`

	const result = getScript(code, false)

	expect(result).toEqual(code)
})

it('should parse export default as itself', () => {
	const code = `const merge = require("lodash/merge").default
    export default {
        template:\`
            <button  @click.prevent="isOpen = false">Close</button>
        \`
    }`

	const result = getScript(code, false)

	expect(result).toEqual(code)
})

it('should parse module.exports as itself', () => {
	const code = `const merge = require("lodash/merge").default
    module.exports = {
        template:\`
            <button  @click.prevent="isOpen = false">Close</button>
        \`
    }`

	const result = getScript(code, false)

	expect(result).toEqual(code)
})
