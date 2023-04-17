import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import typescript from '@rollup/plugin-typescript'
import pkg from './package.json' assert { type: 'json' }

const deps = { ...pkg.dependencies }
delete deps['ts-map']

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
			tsconfig: './tsconfig.build.json',
			declaration: false,
      sourceMap: true,
		})
	],
	external: Object.keys(deps)
}
