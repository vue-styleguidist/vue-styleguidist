import React, { Component } from 'react'
import RsgReactComponent from 'react-styleguidist/lib/client/rsg-components/ReactComponent/ReactComponent'
import { VueComponentMapContext } from '../../utils/renderStyleguide'

export const DocumentedComponentContext = React.createContext({})

export default class ReactComponent extends Component {
	static propTypes = RsgReactComponent.PropTypes

	render() {
		return (
			<VueComponentMapContext.Consumer>
				{componentMap => (
					<DocumentedComponentContext.Provider value={componentMap[this.props.component.filepath]}>
						<RsgReactComponent {...this.props} />
					</DocumentedComponentContext.Provider>
				)}
			</VueComponentMapContext.Consumer>
		)
	}
}
