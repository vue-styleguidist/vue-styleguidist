module.exports = function isCodeVueSfc(code) {
	return /\n\W*<script/.test(code)
}
