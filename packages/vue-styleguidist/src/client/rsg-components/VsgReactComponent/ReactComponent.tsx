import React, { Component } from 'react'
import * as Rsg from 'react-styleguidist'
import PropTypes from 'prop-types'
import RsgReactComponent from 'react-styleguidist/lib/client/rsg-components/ReactComponent/ReactComponent'
import Styled, { JssInjectedProps } from 'react-styleguidist/lib/client/rsg-components/Styled'

interface ReactComponentProps extends JssInjectedProps {
	component: Rsg.Component & {
		props: { subComponents?: (Rsg.Component & { parentName?: string })[] }
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
	static propTypes = {
		...RsgReactComponent.propTypes,
		classes: PropTypes.objectOf(PropTypes.string.isRequired).isRequired
	}

	render() {
		return (
			<>
				<DocumentedComponentContext.Provider value={this.props.component}>
					<RsgReactComponent {...this.props} />
				</DocumentedComponentContext.Provider>
				{this.props.component.props.subComponents ? (
					<div className={this.props.classes.subComponents}>
						{this.props.component.props.subComponents.map((c, i) => {
							c.parentName = this.props.component.visibleName
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
