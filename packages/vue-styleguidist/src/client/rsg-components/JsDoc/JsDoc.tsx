import React from 'react'
import PropTypes from 'prop-types'
import * as Rsg from 'react-styleguidist'
import map from 'lodash/map'
import Markdown from 'rsg-components/Markdown'
import Argument from 'rsg-components/Argument'
import capitalize from 'lodash/capitalize'
import Styled, { JssInjectedProps } from 'rsg-components/Styled'
import { Param } from 'vue-docgen-api'

export interface TagProps {
	deprecated?: Param[]
	see?: Param[]
	link?: Param[]
	author?: Param[]
	version?: Param[]
	since?: Param[]
	throws?: Param[]
}

const styles = ({ space, color }: Rsg.Theme) => ({
	wrapper: {
		color: color.base,
		fontSize: 'inherit',
		lineHeight: 1.5
	},
	name: {
		marginRight: space[1]
	}
})

const list = (array: Param[]) => array.map(item => item.description).join(', ')
const paragraphs = (array: Param[]) => array.map(item => item.description).join('\n\n')

const fields: Record<keyof Omit<TagProps, 'throws'>, (v: Param[]) => string> = {
	deprecated: (value: Param[]) => `${value[0].description}`,
	see: (value: Param[]) => paragraphs(value),
	link: (value: Param[]) => paragraphs(value),
	author: (value: Param[]) => list(value),
	version: (value: Param[]) => `${value[0].description}`,
	since: (value: Param[]) => `${value[0].description}`
}

interface JsDocRendererProps {
	classes: Record<string, string>
	field: string
	children: React.ReactNode
}

const JsDocRenderer = ({ classes, field, children }: JsDocRendererProps) => (
	<div className={`vsg-jsdoc-tag ${classes.wrapper}`} key={field}>
		<span className={`vsg-tag-name ${classes.name}`}>{capitalize(field)}:</span>
		<span className={`vsg-tag-value ${classes.value}`}>{children}</span>
	</div>
)

export const JsDoc: React.FC<TagProps & JssInjectedProps> = ({ classes, ...props }) => {
	return (
		<>
			{props.throws &&
				props.throws.map((throws, i) => (
					<>
						<JsDocRenderer key={i} field="throws" classes={classes}>
							{
								<Argument
									key={i}
									name=""
									{...throws}
									description={
										typeof throws.description === 'boolean'
											? throws.description.toString()
											: throws.description
									}
								/>
							}
						</JsDocRenderer>
					</>
				))}
			{map(fields, (format: (v: Param[]) => string, field: keyof TagProps) => {
				const value = props[field]
				if (!value || !Array.isArray(value)) return null
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
	deprecated: PropTypes.array,
	see: PropTypes.array,
	link: PropTypes.array,
	author: PropTypes.array,
	version: PropTypes.array,
	since: PropTypes.array,
	throws: PropTypes.array
}

export default Styled<TagProps & JssInjectedProps>(styles)(JsDoc)
