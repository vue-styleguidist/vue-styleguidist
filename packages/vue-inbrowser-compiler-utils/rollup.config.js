import * as path from 'path'
import typescript from 'rollup-plugin-typescript2'
import commonjs from 'rollup-plugin-commonjs'
import resolveNode from 'rollup-plugin-node-resolve'
import pkg from './package.json'

const resolve = _path => path.resolve(__dirname, _path)
export default {
	input: resolve('./src/index.ts'),
	output: [
		{
			file: pkg.main,
			name: 'vueInbrowserCompilerUtils',
			format: 'umd',
			external: Object.keys(pkg.dependencies)
		},
		{
			file: pkg.module,
			format: 'es' // the preferred format
		}
	],
	plugins: [
		resolveNode(),
		// Compile TypeScript files
		typescript({
			useTsconfigDeclarationDir: true,
			tsconfig: './tsconfig.build.json',
			cacheRoot: '../../node_modules/.rpt2_cache'
		}),
		// Allow bundling cjs modules (unlike webpack, rollup doesn't understand cjs)
		commonjs()
	],
	external: Object.keys(pkg.dependencies)
}
