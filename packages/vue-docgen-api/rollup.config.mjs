import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import typescript from '@rollup/plugin-typescript'
import pkg from './package.json' assert { type: 'json' }

const deps = { ...pkg.dependencies }
delete deps['ts-map']

export default {
	input: './src/main.ts',
	output: [
		{
			file: `./dist/main.cjs`,
			format: 'cjs',
      sourcemap: true
		}
	],
	plugins: [
		resolve(),
		commonjs(),
		typescript({
			tsconfig: './tsconfig.build.json',
			declaration: false,
      sourceMap: true,
		})
	],
	external: Object.keys(deps)
}
