import React, { Component } from 'react'
import RsgReactComponent from 'react-styleguidist/lib/client/rsg-components/ReactComponent/ReactComponent'

export const DocumentedComponentContext = React.createContext({})

export default class VsgReactComponent extends Component {
	static propTypes = RsgReactComponent.PropTypes

	render() {
		return (
			<>
				<DocumentedComponentContext.Provider value={this.props.component}>
					<RsgReactComponent {...this.props} />
				</DocumentedComponentContext.Provider>
				{this.props.component.props.subComponents ? (
					<div>
						{this.props.component.props.subComponents.map(c => (
							<DocumentedComponentContext.Provider key={c.props.displayName} value={c}>
								<RsgReactComponent {...this.props} component={c} depth={this.props.depth + 1} />
							</DocumentedComponentContext.Provider>
						))}
					</div>
				) : null}
			</>
		)
	}
}
