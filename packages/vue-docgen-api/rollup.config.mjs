import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import typescript from '@rollup/plugin-typescript'
import pkg from './package.json' assert { type: 'json' }

const config = ({ input, outputFile, external }) => {
  return {
    input,
    output: [
      {
        file: `${outputFile}.cjs`,
        format: 'cjs',
      },
    ],
    plugins: [
      resolve(),
      commonjs(),
      typescript({
        tsconfig: './tsconfig.build.json',
        rootDir: '../../',
      }),
    ],
    external,
  }
}

const deps = {...pkg.dependencies}
delete deps['ts-map']

export default [
  config({
    input: './src/main.ts',
    outputFile: './dist/main',
    external: Object.keys(deps),
  }),
]