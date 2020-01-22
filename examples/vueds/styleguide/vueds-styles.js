const lightBlue = '#e9f3fd'
const borderStyle = '1px solid #e2e6ea'

module.exports = function(theme) {
	return {
		StyleGuide: {
			logo: {
				isolated: false,
				padding: 24,
				color: lightBlue
			}
		},
		Version: {
			version: {
				isolated: false,
				color: theme.color.link,
				margin: [[8, 0, 0]],
				padding: [[4, 8, 5]],
				display: 'inline-block',
				fontWeight: 400,
				lineHeight: 1,
				border: [[1, 'solid', theme.color.link]],
				textTransform: 'uppercase',
				fontSize: '11px',
				letterSpacing: '1px',
				borderRadius: 3
			}
		},
		Logo: {
			logo: {
				isolated: false,
				color: lightBlue,
				fontWeight: 400
			}
		},
		Link: {
			link: {
				'&, &:link, &:visited': {
					isolated: false,
					fontWeight: 600
				}
			}
		},
		ComponentsList: {
			list: {
				'& & a': {
					isolate: false,
					fontWeight: 'normal'
				},
				'& & a:hover': {
					isolate: false,
					color: theme.color.linkHover
				}
			}
		},
		TableOfContents: {
			input: {
				isolated: false,
				padding: '8px 16px 9px',
				color: 'white',
				border: '1px solid transparent',
				background: '#07294c'
			}
		},
		Playground: {
			preview: {
				isolated: false,
				padding: '40px',
				backgroundColor: '#f9fafb',
				border: borderStyle,
				boxShadow: 'inset 0 0 8px rgba(0, 17, 35, 0.05)',
				margin: '16px 0 0',
				borderRadius: '0',
				borderTopLeftRadius: 3,
				borderTopRightRadius: 3
			}
		},
		SectionHeading: {
			sectionName: {
				lineHeight: '1.3',
				width: 'calc(100% + 128px)',
				fontSize: '48px',
				'&:hover': {
					textDecoration: 'none',
					fontSize: '48px',
					lineHeight: '1.3'
				}
			},
			wrapper: {
				'& > h1': {
					width: 'calc(100% + 64px)',
					flexGrow: 2,
					padding: '48px 30px',
					fontFamily: ["'Fira Sans'", 'Helvetica', 'Arial', 'sans-serif'],
					margin: '-16px -30px 24px',
					background: lightBlue
				}
			},
			toolbar: {
				display: 'none'
			}
		},
		Editor: {
			root: {
				borderTopLeftRadius: 0,
				borderTopRightRadius: 0
			}
		},
		Table: {
			cellHeading: {
				color: '#1a3c5f',
				padding: '16px 48px 16px 16px'
			},
			tableHead: {
				borderBottom: borderStyle
			},
			cell: {
				padding: '16px 48px 16px 16px'
			},
			table: {
				'& tr:hover': {
					backgroundColor: 'rgba(233, 243, 253, 0.3)'
				}
			}
		}
	}
}
