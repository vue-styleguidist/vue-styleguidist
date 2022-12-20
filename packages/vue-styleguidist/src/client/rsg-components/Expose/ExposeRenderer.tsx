import React from 'react'
import PropTypes from 'prop-types'
import { ExposeDescriptor, ParamTag } from 'vue-docgen-api'
import Styled, { JssInjectedProps } from 'rsg-components/Styled'
import Markdown from 'rsg-components/Markdown'
import Name from 'rsg-components/Name'
import JsDoc from 'rsg-components/JsDoc'
import Table from 'rsg-components/Table'
import getOriginColumn from 'rsg-components/OriginColumn'
import exposeStyles from '../../utils/propStyles'

const getRowKey = (row: ExposeDescriptor) => row.name

function renderMethodName({ name, tags = [] }: ExposeDescriptor) {
  const tagsObject = tags.reduce((acc, tag: ParamTag) => {
    acc[tag.title] = tag.description
    return acc
  }, {} as Record<string, string | boolean | undefined>)
  
	return <Name deprecated={!!tagsObject.deprecated}>{name}</Name>
}

function renderDescription(myClasses: Record<string, string>) {
	return function renderDesc({ description, tags = [] }: ExposeDescriptor) {
    const tagsObject = tags.reduce((acc, tag: ParamTag) => {
      acc[tag.title] = tag.description
      return acc
    }, {} as Record<string, string | boolean | undefined>)

		return (
			<>
				{description && (
					<div className={myClasses.descriptionWrapper}>
						<Markdown text={description} />
					</div>
				)}
				<JsDoc {...tagsObject} />
			</>
		)
	}
}

export const columns = (methods: ExposeDescriptor[], classes: Record<string, string>) => [
	{
		caption: 'Exposed',
		render: renderMethodName,
		className: classes.name
	},
	{
		caption: 'Description',
		render: renderDescription(classes),
		className: classes.description
	},
	...getOriginColumn(methods)
]

interface ExposedRendererProps extends JssInjectedProps {
	expose: ExposeDescriptor[]
}

export const ExposeRenderer: React.FC<ExposedRendererProps> = ({ expose, classes }) => {
	return <Table columns={columns(expose, classes)} rows={expose} getRowKey={getRowKey} />
}

ExposeRenderer.propTypes = {
	classes: PropTypes.objectOf(PropTypes.string.isRequired).isRequired,
	expose: PropTypes.array.isRequired
}

export default Styled<ExposedRendererProps>(exposeStyles as any)(ExposeRenderer)
