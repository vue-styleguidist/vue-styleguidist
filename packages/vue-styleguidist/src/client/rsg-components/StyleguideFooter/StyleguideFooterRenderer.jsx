import React from 'react'
import PropTypes from 'prop-types'
import Markdown from 'rsg-components/Markdown'
import Styled from 'rsg-components/Styled'

const styles = ({ fontFamily, fontSize, color }) => ({
	root: {
		display: 'block',
		color: color.light,
		fontFamily: fontFamily.base,
		fontSize: fontSize.small
	}
})

export const StyleguideFooterRenderer= ({
	classes,
	homepageUrl
}) => {
	return (
		<footer className={classes.root}>
			<Markdown text={`Generated with [Vue Styleguidist](${homepageUrl})`} />
		</footer>
	)
}

StyleguideFooterRenderer.propTypes = {
	classes: PropTypes.objectOf(PropTypes.string.isRequired).isRequired,
	homepageUrl: PropTypes.string.isRequired
}

export default Styled(styles)(StyleguideFooterRenderer)
