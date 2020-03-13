import { parse } from 'vue-docgen-api'
import * as path from 'path'
import generate from '../lib/generateTrans'

async function run() {
	const doc = parse(path.join(__dirname, './Button.vue'))
	generate(doc, path.join(__dirname, './trad.js'))
}

run()
