export default function isPromise(a: any): a is Promise<any> {
	return typeof a.then === 'function'
}
