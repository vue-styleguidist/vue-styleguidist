module.exports = {
	isCodeVueSfc: function isCodeVueSfc(code) {
		return /\n\W*<script/.test(code)
	}
}
