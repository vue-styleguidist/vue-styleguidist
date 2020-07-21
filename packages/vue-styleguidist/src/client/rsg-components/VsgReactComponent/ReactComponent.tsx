import React, { Component } from 'react'
import * as Rsg from 'react-styleguidist'
import PropTypes from 'prop-types'
import Styled, { JssInjectedProps } from 'rsg-components/Styled'
import Context from 'rsg-components/Context'
import RsgReactComponent from 'react-styleguidist/lib/client/rsg-components/ReactComponent/ReactComponent'
import getUrl from 'react-styleguidist/lib/client/utils/getUrl'

interface ReactComponentProps extends JssInjectedProps {
	component: Rsg.Component & {
		subComponents?: (Rsg.Component & {
			parentComponent?: { href?: string; visibleName?: string }
		})[]
	}
	depth: number
	exampleMode?: string
	usageMode?: string
}

const styles = ({ space }: Rsg.Theme) => ({
	subComponents: {
		borderLeft: '1px solid #CCCCCC',
		padding: `${space[2]}px 0 0 ${space[3]}px`,
		marginBottom: space[4]
	}
})

export const DocumentedComponentContext = React.createContext({})

export class VsgReactComponent extends Component<ReactComponentProps> {
	public static propTypes = {
		...RsgReactComponent.propTypes,
		classes: PropTypes.objectOf(PropTypes.string.isRequired).isRequired
	}

	public static contextType = Context

	render() {
		const {
			config: { pagePerSection }
		} = this.context

		const { component, classes } = this.props

		const getFinalUrl = (slug: string, depth: number) =>
			pagePerSection
				? getUrl({ slug, id: depth !== 1, takeHash: true })
				: getUrl({ slug, anchor: true })

		if (component.subComponents && component.props) {
			const links = component.subComponents.map(c => ({
				name: c.visibleName,
				url: getFinalUrl(c.slug || '', this.props.depth)
			}))
			component.props.tags = { ...component.props.tags, subComponents: links as any }
		}

		const parentHref = component.props ? getFinalUrl(component.slug || '', this.props.depth) : ''

		return (
			<>
				<DocumentedComponentContext.Provider value={component}>
					<RsgReactComponent {...this.props} />
				</DocumentedComponentContext.Provider>
				{component.subComponents ? (
					<div className={classes.subComponents}>
						{component.subComponents.map((c, i) => {
							c.parentComponent = {
								href: parentHref,
								visibleName: component.visibleName
							}
							return (
								<DocumentedComponentContext.Provider
									key={(c.props && c.props.displayName) || i}
									value={c}
								>
									<RsgReactComponent {...this.props} component={c} depth={this.props.depth + 1} />
								</DocumentedComponentContext.Provider>
							)
						})}
					</div>
				) : null}
			</>
		)
	}
}

export default Styled<ReactComponentProps>(styles as any)(VsgReactComponent as any)
