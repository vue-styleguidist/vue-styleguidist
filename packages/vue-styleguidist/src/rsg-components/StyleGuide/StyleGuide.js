import React, { Component } from 'react'
import PropTypes from 'prop-types'
import TableOfContents from 'rsg-components/TableOfContents'
import StyleGuideRenderer from 'rsg-components/StyleGuide/StyleGuideRenderer'
import { DisplayModes } from 'react-styleguidist/lib/client/consts'
import Sections from 'rsg-components/Sections'
import Welcome from 'rsg-components/Welcome'
import Error from 'rsg-components/Error'
import NotFound from 'rsg-components/NotFound'
import { HOMEPAGE } from '../../../scripts/consts'

/**
 * This function will return true, if the sidebar should be visible and false otherwise.
 *
 * These sorted conditions (highest precedence first) define the visibility
 * state of the sidebar.
 *
 * - Sidebar is hidden for isolated example views
 * - Sidebar is always visible when pagePerSection
 * - Sidebar is hidden when showSidebar is set to false
 * - Sidebar is visible when showSidebar is set to true for non-isolated views
 *
 * @param {boolean} displayMode
 * @param {boolean} showSidebar
 * @param {boolean} pagePerSection
 * @returns {boolean}
 */
function hasSidebar(displayMode, showSidebar) {
	return displayMode === DisplayModes.notFound || (showSidebar && displayMode === DisplayModes.all)
}

export default class StyleGuide extends Component {
	static propTypes = {
		codeRevision: PropTypes.number.isRequired,
		config: PropTypes.object.isRequired,
		slots: PropTypes.object.isRequired,
		sections: PropTypes.array.isRequired,
		welcomeScreen: PropTypes.bool,
		renderRootJsx: PropTypes.object,
		patterns: PropTypes.array,
		displayMode: PropTypes.string,
		allSections: PropTypes.array.isRequired,
		pagePerSection: PropTypes.bool
	}

	static childContextTypes = {
		codeRevision: PropTypes.number.isRequired,
		config: PropTypes.object.isRequired,
		slots: PropTypes.object.isRequired,
		displayMode: PropTypes.string,
		renderRootJsx: PropTypes.object
	}

	static defaultProps = {
		displayMode: DisplayModes.all
	}

	state = {
		error: false,
		info: null
	}

	getChildContext() {
		return {
			codeRevision: this.props.codeRevision,
			config: this.props.config,
			slots: this.props.slots,
			displayMode: this.props.displayMode,
			renderRootJsx: this.props.renderRootJsx
		}
	}

	componentDidCatch(error, info) {
		this.setState({
			error,
			info
		})
	}

	render() {
		const {
			config,
			sections,
			welcomeScreen,
			patterns,
			displayMode,
			allSections,
			pagePerSection
		} = this.props

		if (this.state.error) {
			return <Error error={this.state.error} info={this.state.info} />
		}

		if (welcomeScreen) {
			return <Welcome patterns={patterns} />
		}

		return (
			<StyleGuideRenderer
				title={config.title}
				version={config.version}
				homepageUrl={HOMEPAGE}
				toc={<TableOfContents sections={allSections} useRouterLinks={pagePerSection} />}
				hasSidebar={hasSidebar(displayMode, config.showSidebar)}
			>
				{sections.length ? <Sections sections={sections} depth={1} /> : <NotFound />}
			</StyleGuideRenderer>
		)
	}
}
