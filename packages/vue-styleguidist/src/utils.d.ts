/* eslint-disable import/no-duplicates */
/* eslint-disable import/prefer-default-export */

declare module 'glogg' {
	interface GloggLogger {
		debug(msg: string): void
		info(msg: string): void
		warn(msg: string): void
		error(msg: string): void
		on(event: string | symbol, listener: (...args: any[]) => void): void
	}
	function getLogger(namespace: string): GloggLogger
	export = getLogger
}

declare namespace NodeJS {
	interface Global {
		VUE_STYLEGUIDIST: Record<string, string>
	}
}

declare module 'lru-cache' {
	class LRUCache {
		constructor(num: number)
		get(key: string): any
		set(key: string, obj: any): void
	}
	export = LRUCache
}

declare module 'hash-sum' {
	function makehash(key: any): string
	export = makehash
}

declare module 'mini-html-webpack-plugin' {
	import { Plugin, loader } from 'webpack'

	class HtmlPlugin extends Plugin {
		constructor(options: any)
	}

	export = HtmlPlugin
}

declare module '@vxna/mini-html-webpack-template' {
	function template(...args: any[]): string
	export = template
}

declare module 'findup' {
	const findup: {
		sync(cwd: string, path: string): string
	}
	export = findup
}

declare module 'to-ast' {
	function toAst(input: any): any
	export = toAst
}

declare module 'common-dir' {
	function commonDir(paths: string[]): string
	export = commonDir
}

declare module 'css-loader' {
	import { loader as cssLoader } from 'webpack'

	const myLoader: cssLoader.Loader
	export = myLoader
}

declare module 'style-loader' {
	import { loader as styleLoader } from 'webpack'

	const myLoader: styleLoader.Loader
	export = myLoader
}

declare module 'q-i' {
	export const stringify: (obj: any) => string
}
