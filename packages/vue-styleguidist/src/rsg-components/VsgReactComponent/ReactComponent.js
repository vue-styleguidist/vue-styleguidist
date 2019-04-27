import React, { Component } from 'react'
import RsgReactComponent from 'react-styleguidist/lib/client/rsg-components/ReactComponent/ReactComponent'

export const DocumentedComponentContext = React.createContext({})

export default class ReactComponent extends Component {
	static propTypes = RsgReactComponent.PropTypes

	render() {
		return (
			<DocumentedComponentContext.Provider value={this.props.component}>
				<RsgReactComponent {...this.props} />
			</DocumentedComponentContext.Provider>
		)
	}
}
