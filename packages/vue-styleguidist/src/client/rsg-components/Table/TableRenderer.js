import React from 'react'
import PropTypes from 'prop-types'
import Styled from 'rsg-components/Styled'
import cx from 'classnames'

export const styles = ({ space, color, fontFamily, fontSize }) => ({
	table: {
		width: '100%',
		borderCollapse: 'collapse',
		marginBottom: space[6]
	},
	tableHead: {
		borderBottom: [[1, color.border, 'solid']]
	},
	cellHeading: {
		color: color.base,
		paddingRight: space[2],
		paddingBottom: space[1],
		textAlign: 'left',
		fontFamily: fontFamily.base,
		fontWeight: 'bold',
		fontSize: fontSize.small,
		whiteSpace: 'nowrap'
	},
	dataRow: {
		'&:hover': {
			background: '#fbfbfb'
		}
	},
	cell: {
		color: color.base,
		paddingRight: space[2],
		paddingTop: space[1],
		paddingBottom: space[1],
		verticalAlign: 'top',
		fontFamily: fontFamily.base,
		fontSize: fontSize.small,
		borderBottom: [[1, color.border, 'solid']],
		'& div': {
			isolate: false,
			minWidth: 300
		}
	}
})

export function TableRenderer({ classes, columns, rows, getRowKey }) {
	return (
		<table className={classes.table}>
			<thead className={classes.tableHead}>
				<tr>
					{columns.map(({ caption }) => (
						<th key={caption} className={classes.cellHeading}>
							{caption}
						</th>
					))}
				</tr>
			</thead>
			<tbody>
				{rows.map(row => (
					<tr key={getRowKey(row)} className={classes.dataRow}>
						{columns.map(({ render, className }, index) => (
							<td key={index} className={cx(classes.cell, className)}>
								{render(row)}
							</td>
						))}
					</tr>
				))}
			</tbody>
		</table>
	)
}

TableRenderer.propTypes = {
	classes: PropTypes.object.isRequired,
	columns: PropTypes.arrayOf(
		PropTypes.shape({
			caption: PropTypes.string.isRequired,
			render: PropTypes.func.isRequired
		})
	).isRequired,
	rows: PropTypes.arrayOf(PropTypes.object).isRequired,
	getRowKey: PropTypes.func.isRequired
}

export default Styled(styles)(TableRenderer)
