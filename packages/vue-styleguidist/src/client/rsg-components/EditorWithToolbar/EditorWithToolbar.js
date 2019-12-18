/* eslint-disable react/prop-types */
import React from 'react'
import copy from 'clipboard-copy'
import { MdContentCopy } from 'react-icons/md'
// eslint-disable-next-line import/no-unresolved,import/extensions
import Editor from 'rsg-components/EditorNoTools'
import ToolbarButton from 'rsg-components/ToolbarButton'
import Styled from 'rsg-components/Styled'

const styles = ({ space }) => ({
	container: {
		position: 'relative'
	},
	copyButton: {
		position: 'absolute',
		right: space[1],
		top: space[1],
		zIndex: 3,
		cursor: 'pointer'
	}
})

function EditorWithToolbar(props) {
	const { classes } = props
	return (
		<div className={classes.container}>
			<ToolbarButton
				small
				className={classes.copyButton}
				onClick={() => copy(props.code)}
				title="Copy to clipboard"
			>
				<MdContentCopy />
			</ToolbarButton>
			<Editor {...props} />
		</div>
	)
}

export default Styled(styles)(EditorWithToolbar)
