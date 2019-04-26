import React, { Component } from 'react'
import RsgReactComponent from 'react-styleguidist/lib/client/rsg-components/ReactComponent/ReactComponent'

export const FilePathContext = React.createContext('')

export default class ReactComponent extends Component {
	static propTypes = RsgReactComponent.PropTypes

	render() {
		return (
			<FilePathContext.Provider value={this.props.component.filepath}>
				<RsgReactComponent {...this.props} />
			</FilePathContext.Provider>
		)
	}
}
