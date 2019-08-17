import * as path from 'path'
import typescript from 'rollup-plugin-typescript'
import pkg from './package.json'

const resolve = _path => path.resolve(__dirname, _path)
export default {
	input: resolve('./src/index.ts'),
	output: [
		{
			file: pkg.main,
			format: 'cjs'
		},
		{
			file: pkg.module,
			format: 'es' // the preferred format
		}
	],
	plugins: [typescript({ tsconfig: './tsconfig.build.json' })],
	external: [...Object.keys(pkg.dependencies || {})]
}
