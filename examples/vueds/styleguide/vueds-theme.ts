import { ThemeConfig } from 'vue-styleguidist'

const theme: ThemeConfig = {
	maxWidth: 10000,
	color: {
		sidebarBackground: '#02172d',
		border: 'rgba(255, 255, 255, 0.1)',
		link: '#258aef',
		linkHover: '#1070d1',
		/**
		 * prism colors configuration
		 */
		codeComment: '#6d6d6d',
		codePunctuation: '#54a3f2',
		codeProperty: '#54a3f2',
		codeString: '#ffcc4d',
		codeInserted: '#EEEEEE',
		codeOperator: '#DDDDDD',
		codeKeyword: '#afe74c',
		codeFunction: '#54a3f2',
		codeVariable: '#AAAAAA',
		codeBase: '#FFFFFF',
		codeBackground: '#041d37'
	},
	sidebarWidth: 240,
	fontFamily: {
		base: ["'Fira Sans'", 'Helvetica', 'Arial', 'sans-serif'],
		monospace: ['Menlo', 'monospace']
	},
	fontSize: {
		h4: 18
	}
}

export default theme
