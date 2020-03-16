#!/usr/bin/env node

import minimist from 'minimist'
import { parse } from 'vue-docgen-api'
import * as path from 'path'
import globby from 'globby'
import generate from './generateTrans'

const { _: pathArray, lang = 'trad' } = minimist(process.argv.slice(2))

pathArray.forEach(async p => {
	const files = await globby(p, { cwd: process.cwd(), absolute: true })
	files.forEach(async p1 => {
		const doc = await parse(p1, { validExtends: () => false })
		generate(
			doc,
			`${path.join(path.dirname(p1), path.basename(p1).replace(/\.\w+$/, ''))}.${lang}.js`
		)
	})
})
