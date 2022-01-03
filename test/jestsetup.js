process.env.NODE_ENV = 'test'

// those two functions seem to be absent in JSdom 27
// FIXME: mocking them is really not a good idea.
window.clearImmediate = () => {}
window.setImmediate = () => {}
