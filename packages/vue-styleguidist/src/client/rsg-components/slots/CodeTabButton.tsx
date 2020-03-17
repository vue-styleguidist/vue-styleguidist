import React from 'react'
import PropTypes from 'prop-types'
import TabButton from 'rsg-components/TabButton'

interface CodeTabeButtonProps {
	onClick: (e: React.MouseEvent) => void
	name: string
	active?: boolean
}

const CodeTabButton = (props: CodeTabeButtonProps) => <TabButton {...props}>View Code</TabButton>

CodeTabButton.propTypes = {
	onClick: PropTypes.func.isRequired,
	name: PropTypes.string.isRequired,
	active: PropTypes.bool
}

export default CodeTabButton
