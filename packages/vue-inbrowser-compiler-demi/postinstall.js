const pkg = require('vue/package.json')
const path = require('path')
const fs = require('fs')

function updateIndexForVue3() {
	// commonjs
	const indexPath = path.join(__dirname, './index.cjs.js')
	const indexContent = `
  const Vue = require('vue')
  
  module.exports.h = Vue.h
  module.exports.resolveComponent = Vue.resolveComponent
  module.exports.isVue3 = true
  `
	fs.writeFile(indexPath, indexContent, err => {
		if (err) {
			console.error(err)
		}
	})

	// esm
	const indexPathESM = path.join(__dirname, './index.esm.js')
	const indexContentESM = `
  export { h, resolveComponent } from 'vue'
  export const isVue3 = true
  `
	fs.writeFile(indexPathESM, indexContentESM, err => {
		if (err) {
			console.error(err)
		}
	})
}

if (pkg.version.startsWith('3.')) {
	updateIndexForVue3()
}
