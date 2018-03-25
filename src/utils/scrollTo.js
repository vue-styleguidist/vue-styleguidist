export default function scrollTo(id) {
	const element = document.scrollingElement || document.documentElement;
	let to = 0;
	if (id) {
		to = document.getElementById(id).offsetTop;
		element.scrollTop = to;
	} else {
		element.scrollTop = 0;
	}
}
