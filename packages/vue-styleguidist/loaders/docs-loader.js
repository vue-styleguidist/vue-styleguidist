// https://vue-loader.vuejs.org/guide/custom-blocks.html#example

module.exports = function(source, map) {
	this.callback(
		null,
		`export default function (Component) {
		Component.options.__docs = ${JSON.stringify(source)}
	  }`,
		map
	)
}
