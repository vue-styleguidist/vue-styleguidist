import React from 'react'
import * as Rsg from 'react-styleguidist'
import PropTypes from 'prop-types'
import Markdown from 'rsg-components/Markdown'
import Styled from 'rsg-components/Styled'

const styles = ({ fontFamily, color }: Rsg.Theme) => ({
	root: {
		display: 'block',
		color: color.light,
		fontFamily,
		fontSize: 12
	}
})

interface StyleguideFooterRendererProps {
	classes: Record<string, string>
	homepageUrl: string
}

export const StyleguideFooterRenderer: React.FC<StyleguideFooterRendererProps> = ({
	classes,
	homepageUrl
}) => {
	return (
		<footer className={classes.root}>
			<Markdown text={`Generated with [Vue Styleguidist](${homepageUrl}) ❤️`} />
		</footer>
	)
}

StyleguideFooterRenderer.propTypes = {
	classes: PropTypes.objectOf(PropTypes.string.isRequired).isRequired,
	homepageUrl: PropTypes.string.isRequired
}

export default Styled<StyleguideFooterRendererProps>(styles)(StyleguideFooterRenderer)
