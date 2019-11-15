export default ({ space }: { space: number[] }) => ({
	name: {
		'& code': {
			isolate: false,
			minWidth: 110,
			display: 'block'
		}
	},
	type: {
		isolate: false,
		margin: [[space[1], 0, 0, space[1]]],
		opacity: 0.5
	},
	descriptionWrapper: {
		// remove bottom margin from description
		'& p': {
			margin: 0,
			minWidth: 350
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
