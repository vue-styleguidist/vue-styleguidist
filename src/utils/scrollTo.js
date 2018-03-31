export default function scrollTo() {
	const element = document.scrollingElement || document.documentElement;
	element.scrollTop = 0;
}
