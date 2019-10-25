import React from 'react'
import PropTypes from 'prop-types'
import map from 'lodash/map'
import capitalize from 'lodash/capitalize'
import Markdown from 'rsg-components/Markdown'
import Styled from 'rsg-components/Styled'

const list = array => array.map(item => item.description).join(', ')
const paragraphs = array => array.map(item => item.description).join('\n\n')

const fields = {
	deprecated: value => value[0].description,
	see: value => paragraphs(value),
	link: value => paragraphs(value),
	author: value => list(value),
	version: value => value[0].description,
	since: value => value[0].description
}

const styles = ({ space, color, fontFamily }) => ({
	wrapper: {
		color: color.base,
		fontFamily: fontFamily.base,
		fontSize: 'inherit',
		lineHeight: 1.5
	},
	name: {
		marginRight: space[1]
	}
})

function JsDoc(props) {
	const { classes } = props
	return map(
		fields,
		(format, field) =>
			props[field] && (
				<div className={`vsg-jsdoc-tag ${classes.wrapper}`} key={field}>
					<span className={`vsg-tag-name ${classes.name}`}>{capitalize(field)}:</span>
					<span className={`vsg-tag-value ${classes.value}`}>
						{<Markdown text={format(props[field])} inline />}
					</span>
				</div>
			)
	).filter(Boolean)
}

JsDoc.propTypes = {
	classes: PropTypes.object.isRequired,
	deprecated: PropTypes.array,
	see: PropTypes.array,
	link: PropTypes.array,
	author: PropTypes.array,
	version: PropTypes.array,
	since: PropTypes.array
}

export default Styled(styles)(JsDoc)
