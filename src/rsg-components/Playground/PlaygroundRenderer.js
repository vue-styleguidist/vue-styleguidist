import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import Styled from 'rsg-components/Styled';

export const styles = ({ space, color, borderRadius }) => ({
	root: {
		marginBottom: space[4],
	},
	preview: {
		padding: space[2],
		border: [[1, color.border, 'solid']],
		borderRadius,
	},
	controls: {
		display: 'flex',
		alignItems: 'center',
	},
	toolbar: {
		marginLeft: 'auto',
	},
	tab: {}, // expose className to allow using it in 'styles' settings
});

export function PlaygroundRenderer(
	{ classes, name, preview, previewProps, tabButtons, tabBody, toolbar },
	{ config }
) {
	const { className, ...props } = previewProps;
	const navigation = config.navigation;
	return (
		<div className={classes.root}>
			<div className={cx(classes.preview, className)} {...props} data-preview={name}>
				{preview}
			</div>
			<div className={classes.controls}>
				<div className={classes.tabs}>{tabButtons}</div>
				{!navigation ? <div className={classes.toolbar}>{toolbar}</div> : null}
			</div>
			<div className={classes.tab}>{tabBody}</div>
		</div>
	);
}

PlaygroundRenderer.propTypes = {
	classes: PropTypes.object.isRequired,
	name: PropTypes.string.isRequired,
	preview: PropTypes.node.isRequired,
	previewProps: PropTypes.object.isRequired,
	tabButtons: PropTypes.node.isRequired,
	tabBody: PropTypes.node.isRequired,
	toolbar: PropTypes.node.isRequired,
};

PlaygroundRenderer.contextTypes = {
	config: PropTypes.object,
};

export default Styled(styles)(PlaygroundRenderer);
