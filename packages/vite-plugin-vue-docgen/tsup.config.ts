import type { Options } from 'tsup'

function defineTsup(opts: Options): Options {
	return opts
}

export default defineTsup({
	dts: true,
	clean: true,
	format: ['cjs', 'esm']
})
