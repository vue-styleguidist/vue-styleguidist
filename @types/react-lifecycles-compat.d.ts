declare module 'react-lifecycles-compat' {
	import * as React from 'react'
	export function polyfill<T>(component: React.ComponentType<T>): React.ComponentType<T>
}
