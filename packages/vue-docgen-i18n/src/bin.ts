#!/usr/bin/env node

import minimist from 'minimist'
import { parseMulti } from 'vue-docgen-api'
import * as path from 'path'
import globby from 'globby'
import generate from './generateTrans'

const { _: pathArray, lang = 'trad' } = minimist(process.argv.slice(2))

if (!pathArray.length) {
	// eslint-disable-next-line no-console
	console.warn('You must provide a array of path to run')
}

pathArray.forEach(async p => {
	const files = await globby(p, { cwd: process.cwd(), absolute: true })
	if (!files.length) {
		// eslint-disable-next-line no-console
		console.warn(`No files detected with glob ${p}`)
	}
	files.forEach(async p1 => {
		const doc = await parseMulti(p1, { validExtends: () => false })
		generate(
			doc,
			`${path.join(path.dirname(p1), path.basename(p1).replace(/\.\w+$/, ''))}.${lang}.js`
		)
	})
})
