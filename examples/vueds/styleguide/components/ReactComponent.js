import React from 'react';
import PropTypes from 'prop-types';
import Pathline from 'rsg-components/Pathline';
import Styled from 'rsg-components/Styled';

const styles = ({ color, fontSize, space }) => ({
	root: {
		marginBottom: space[6],
	},
	header: {
		marginBottom: space[3],
		background: '#e9f3fd',
		margin: '-16px -32px 48px -64px',
		padding: '64px 64px',
	},
	tabs: {
		marginBottom: space[3],
	},
	tabButtons: {
		marginBottom: space[1],
	},
	tabBody: {
		overflowX: 'auto',
		maxWidth: '100%',
		WebkitOverflowScrolling: 'touch',
	},
	docs: {
		color: color.base,
		fontSize: fontSize.text,
	},
});

export function ReactComponentRenderer({
	classes,
	name,
	heading,
	pathLine,
	description,
	docs,
	examples,
	tabButtons,
	tabBody,
}) {
	return (
		<div className={classes.root} data-testid={`${name}-container`}>
			<header className={classes.header}>
				{heading}
				{pathLine && <Pathline>{pathLine}</Pathline>}
			</header>
            {(description || docs) && (
				<div className={classes.docs}>
					{description}
					{docs}
				</div>
			)}
            {examples}
			{tabButtons && (
				<div className={classes.tabs}>
					<div className={classes.tabBody}>{tabBody}</div>
				</div>
			)}
		</div>
	);
}

ReactComponentRenderer.propTypes = {
	classes: PropTypes.object.isRequired,
	name: PropTypes.string.isRequired,
	heading: PropTypes.node.isRequired,
	filepath: PropTypes.string,
	pathLine: PropTypes.string,
	tabButtons: PropTypes.node,
	tabBody: PropTypes.node,
	description: PropTypes.node,
	docs: PropTypes.node,
	examples: PropTypes.node,
	isolated: PropTypes.bool,
};

export default Styled(styles)(ReactComponentRenderer);