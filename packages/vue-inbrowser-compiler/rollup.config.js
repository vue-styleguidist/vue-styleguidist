import * as path from 'path'
import nodeResolve from '@rollup/plugin-node-resolve'
import typescript from '@rollup/plugin-typescript'
import commonjs from '@rollup/plugin-commonjs'
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
	plugins: [
		// allow rollup to look for modules in node_modules
		nodeResolve(),
		// Compile TypeScript files
		typescript({
			tsconfig: './tsconfig.build.json',
			cacheDir: '../../node_modules/.rpt3_cache',
			declarationDir: 'types',
			rootDir: 'src',
			include: ['**/*.ts', '../../../@types/**/*.ts']
		}),
		// Allow bundling cjs modules (unlike webpack, rollup doesn't understand cjs, `require()`)
		commonjs()
	],
	external: [...Object.keys(pkg.dependencies), ...Object.keys(pkg.peerDependencies)]
}
