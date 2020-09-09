import React from 'react'
import { render } from '@testing-library/react'
import { ArgumentRenderer, styles } from './ArgumentRenderer'

const name = 'Foo'
const type = { name: 'Array' }
const description = 'Converts foo to bar'
const props = {
	classes: Object.keys(styles({} as any)).reduce((a: Record<string, string>, cl: string) => {
		a[cl] = cl
		return a
	}, {}),
	name: 'argname'
}

it('should render argument', () => {
	const actual = render(
		<ArgumentRenderer {...props} name={name} type={type} description={description} />
	)

	expect(actual.container).toMatchSnapshot()
})

it('should render argument without type', () => {
	const actual = render(<ArgumentRenderer {...props} name={name} description={description} />)

	expect(actual.container).toMatchSnapshot()
})

it('should render optional argument', () => {
	const actual = render(
		<ArgumentRenderer
			{...props}
			type={{ type: 'OptionalType', expression: { name: 'Array' } }}
			description={description}
		/>
	)

	expect(actual.container).toMatchSnapshot()
})

it('should render default value of argument', () => {
	const actual = render(
		<ArgumentRenderer
			{...props}
			type={{ name: 'String' }}
			default="bar"
			description={description}
		/>
	)

	expect(actual.container).toMatchSnapshot()
})

it('should render default value of optional argument', () => {
	const actual = render(
		<ArgumentRenderer
			{...props}
			type={{ type: 'OptionalType', expression: { name: 'Boolean' } }}
			default="true"
			description={description}
		/>
	)

	expect(actual.container).toMatchSnapshot()
})

it('should render argument without description', () => {
	const actual = render(<ArgumentRenderer {...props} name={name} type={type} />)

	expect(actual.container).toMatchSnapshot()
})

it('should render return value', () => {
	const actual = render(
		<ArgumentRenderer {...props} type={type} description={description} returns />
	)

	expect(actual.container).toMatchSnapshot()
})

it('should render with block styles', () => {
	const actual = render(<ArgumentRenderer {...props} block />)

	expect(actual.container).toMatchSnapshot()
})
