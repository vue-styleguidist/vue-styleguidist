import React from 'react'
import PropTypes from 'prop-types'
// import * as path from 'path'
import { render } from '@testing-library/react'
import { parseSource, MethodDescriptor } from 'vue-docgen-api'
import MethodsRenderer, { columns } from '../MethodsRenderer'

// Test renderers with clean readable snapshot diffs
function ColumnsRenderer({ methods }: { methods: MethodDescriptor[] }) {
	return (
		<ul>
			{methods.map((row, rowIdx) => (
				<li key={rowIdx}>
					{columns(methods, {}).map((col, colIdx) => (
						<div key={colIdx}>{col.render(row)}</div>
					))}
				</li>
			))}
		</ul>
	)
}

ColumnsRenderer.propTypes = {
	methods: PropTypes.array
}

async function renderMethodsSection(methods: string[]) {
	const parsed = await parseSource(
		`export default {
			methods: {
				${methods.join(',\n')}
			}
		}`,
		''
	)
	if (Array.isArray(parsed) || !parsed.methods) {
		return render(<div />)
	}
	return render(<ColumnsRenderer methods={parsed.methods} />)
}

describe('MethodsRenderer', () => {
	it('should render a table', () => {
		const actual = render(
			<MethodsRenderer
				methods={[
					{
						name: 'method',
						modifiers: [],
						params: [],
						description: 'Public'
					}
				]}
			/>
		)

		expect(actual.container).toMatchSnapshot()
	})

	it('should render public method', async () => {
		const actual = await renderMethodsSection(['/**\n * Public\n * @public\n */\nmethod() {}'])

		expect(actual.container).toMatchSnapshot()
	})

	it('should render parameters', async () => {
		const actual = await renderMethodsSection([
			'/**\n * Public\n * @public\n * @param {Number} value - Description\n */\nmethod(value) {}'
		])

		expect(actual.container).toMatchSnapshot()
	})

	it('should render returns', async () => {
		const actual = await renderMethodsSection([
			'/**\n * @public\n * @returns {Number} - Description\n */\nmethod() {}'
		])

		expect(actual.container).toMatchSnapshot()
	})

	it('should render JsDoc tags', () => {
		const actual = render(
			<ColumnsRenderer
				methods={[
					{
						name: 'Foo',
						tags: {
							since: [
								{
									title: 'since',
									description: '1.0.0'
								}
							]
						}
					}
				]}
			/>
		)

		expect(actual.container).toMatchSnapshot()
	})

	it('should render deprecated JsDoc tags', () => {
		const actual = render(
			<ColumnsRenderer
				methods={[
					{
						name: 'Foo',
						tags: {
							deprecated: [
								{
									title: 'description',
									description: 'Use *another* method'
								}
							]
						}
					}
				]}
			/>
		)

		expect(actual.container).toMatchSnapshot()
	})
})
