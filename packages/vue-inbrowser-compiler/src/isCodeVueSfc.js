export default function isCodeVueSfc(code) {
	return /\n\W*<script/.test(code)
}
