/* eslint-disable react/prop-types */
import React from 'react'
import PropTypes from 'prop-types'
import map from 'lodash/map'
import capitalize from 'lodash/capitalize'
import Markdown from 'rsg-components/Markdown'
import Argument from 'rsg-components/Argument'
import Styled from 'rsg-components/Styled'
import SubComponents from 'rsg-components/SubComponents'


const styles = ({ space, color }) => ({
	wrapper: {
		color: color.base,
		fontSize: 'inherit',
		lineHeight: 1.5
	},
	name: {
		marginRight: space[1]
	}
})

const list = (array) => array.map(item => item.description).join(', ')
const paragraphs = (array) => array.map(item => item.description).join('\n\n')

const fields = {
	deprecated: (value) =>
		typeof value[0].description === 'string' ? `${value[0].description}` : '',
	see: (value) => paragraphs(value),
	link: (value) => paragraphs(value),
	author: (value) => `${list(value)}`,
	version: (value) => `${value[0].description}`,
	since: (value) => `${value[0].description}`
}

const JsDocRenderer = ({ classes, field, children }) => (
	<div className={`vsg-jsdoc-tag ${classes.wrapper}`} key={field}>
		<span className={`vsg-tag-name ${classes.name}`}>{capitalize(field)}</span>
		<span className={`vsg-tag-value ${classes.value}`}>{children}</span>
	</div>
)

export const JsDoc = ({ classes, ...props }) => {
	return (
		<>
			{props.subComponents && <SubComponents subComponents={props.subComponents} />}
			{props.throws &&
				props.throws.map((throws, i) => (
					<JsDocRenderer key={i} field="throws" classes={classes}>
						<Argument
							name=""
							{...throws}
							description={
								typeof throws.description === 'boolean'
									? throws.description.toString()
									: throws.description
							}
						/>
					</JsDocRenderer>
				))}
			{map(fields, ({format, field}) => {
				const value = props[field]
				if (!value || !Array.isArray(value)) {
					return null
				}
				return (
					<JsDocRenderer key={field} field={field} classes={classes}>
						{<Markdown text={format(value) || ''} inline />}
					</JsDocRenderer>
				)
			})}
		</>
	)
}

JsDoc.propTypes = {
	classes: PropTypes.objectOf(PropTypes.string.isRequired).isRequired,
	subComponents: PropTypes.array,
	deprecated: PropTypes.array,
	see: PropTypes.array,
	link: PropTypes.array,
	author: PropTypes.array,
	version: PropTypes.array,
	since: PropTypes.array,
	throws: PropTypes.array
}

export default Styled(styles)(JsDoc)
