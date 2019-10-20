import React from 'react'
import PropTypes from 'prop-types'
import Styled from 'rsg-components/Styled'

const styles = ({ color, fontFamily }) => ({
	wrapper: {
		backgroundColor: color.base,
		borderRadius: 3,
		display: 'inline-block',
		height: 24
	},
	tag: {
		color: color.baseBackground,
		fontFamily: fontFamily.base,
		padding: [[2, 6]],
		display: 'inline-block',
		verticalAlign: 'top'
	},
	symbol: {
		height: 24,
		backgroundColor: color.codeFunction,
		borderRadius: [[3, 0, 0, 3]],
		padding: [[2, 4]],
		stroke: color.baseBackground
	}
})

function FunctionalTag({ classes }) {
	return (
		<span className={`vsg-functional-tag ${classes.wrapper}`}>
			<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg" className={classes.symbol}>
				<path
					fill="none"
					strokeLinecap="round"
					strokeLinejoin="round"
					strokeWidth="5"
					d="M22 14c-12 4-5 28-16 31M7 27h16M32 20c-3 7-3 17-1 25M53 20c3 7 2 17 0 25M38 26l10 13M48 26L37 39"
				/>
			</svg>
			<span className={classes.tag}>functional</span>
		</span>
	)
}

FunctionalTag.propTypes = {
	classes: PropTypes.object.isRequired
}

export default Styled(styles)(FunctionalTag)
