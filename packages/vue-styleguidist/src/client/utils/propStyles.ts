import * as Rsg from 'react-styleguidist'

const methodStyles = ({ space }: Rsg.Theme) => ({
	name: {
		'& code': {
			isolate: false,
			minWidth: 110,
			display: 'block'
		}
	},
	type: {
		isolate: false,
		marginLeft: space[1],
		opacity: 0.5,
		'& pre': {
			margin: 0
		}
	},
	descriptionWrapper: {
		// remove bottom margin from description
		'& p': {
			margin: 0,
			minWidth: 350
		},
		// add space before any next sibling
		'& + *': {
			marginTop: space[1]
		}
	},
	description: {
		isolate: false,
		width: '90%'
	},
	required: {
		isolate: false,
		fontWeight: 'bold'
	},
	values: {
		isolate: false,
		width: 150,
		margin: 0
	},
	default: {
		isolate: false,
		width: 150,
		margin: 0
	}
})

export default methodStyles
