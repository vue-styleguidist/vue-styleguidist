import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import typescript from '@rollup/plugin-typescript'
import pkg from './package.json' assert { type: 'json' }

const deps = {
	...pkg.dependencies,
	'prismjs/components/prism-clike.js': true,
	'prismjs/components/prism-markup.js': true,
	'prismjs/components/prism-javascript.js': true,
	'prismjs/components/prism-typescript.js': true,
	'prismjs/components/prism-jsx.js': true,
	'prismjs/components/prism-tsx.js': true,
	'prismjs/components/prism-css.js': true
}

export default {
	input: './src/index.ts',
	output: [
		{
			file: `./dist/index.cjs`,
			format: 'cjs',
			sourcemap: true
		},
		{
			file: `./dist/index.mjs`,
			format: 'es',
			sourcemap: true
		}
	],
	plugins: [
		resolve(),
		commonjs(),
		typescript({
			tsconfig: './tsconfig.build.json'
		})
	],
	external: Object.keys(deps)
}
