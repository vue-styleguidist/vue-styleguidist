/**
 * Eval example code in a custom context:
 * - `require()` that allows you to require modules from Markdown examples (wont work dynamically because we need
 *   to know all required modules in advance to be able to bundle them with the code).
 * - `state` variable, `setState` function that will be bound to a React component
 *   that manages examples state on the frontend.
 *
 * Also prepends a given `code` with a `header` (maps required context modules to local variables).
 */
export default function evalInContext(
	header: string,
	__pragma__: (...args: any[]) => any,
	__concatenate__: (...args: any[]) => any,
	require: (path: string) => any,
	code: string
): (componentCode: string) => any {
	const func = new Function('require', '__pragma__', '__concatenate__', header + code) // eslint-disable-line no-new-func

	const requireScoped = require

	// Bind the `require` function, other context arguments will be passed from the frontend
	return func.bind(null, requireScoped, __pragma__, __concatenate__)
}
