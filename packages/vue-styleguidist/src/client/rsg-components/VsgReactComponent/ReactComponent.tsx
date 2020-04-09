import React, { Component } from 'react'
import * as Rsg from 'react-styleguidist'
import RsgReactComponent from 'react-styleguidist/lib/client/rsg-components/ReactComponent/ReactComponent'

interface ReactComponentProps {
	component: Rsg.Component & { props: { subComponents?: Rsg.Component[] } }
	depth: number
	exampleMode?: string
	usageMode?: string
}

export const DocumentedComponentContext = React.createContext({})

export default class VsgReactComponent extends Component<ReactComponentProps> {
	static propTypes = RsgReactComponent.propTypes

	render() {
		return (
			<>
				<DocumentedComponentContext.Provider value={this.props.component}>
					<RsgReactComponent {...this.props} />
				</DocumentedComponentContext.Provider>
				{this.props.component.props.subComponents ? (
					<div>
						{this.props.component.props.subComponents.map((c, i) => (
							<DocumentedComponentContext.Provider
								key={(c.props && c.props.displayName) || i}
								value={c}
							>
								<RsgReactComponent {...this.props} component={c} depth={this.props.depth + 1} />
							</DocumentedComponentContext.Provider>
						))}
					</div>
				) : null}
			</>
		)
	}
}
