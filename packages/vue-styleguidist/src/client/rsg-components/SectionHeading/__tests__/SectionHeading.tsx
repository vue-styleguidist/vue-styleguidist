import React from 'react'
import { render } from '@testing-library/react'
import SectionHeading from '../index'
import SectionHeadingRenderer from '../SectionHeadingRenderer'

jest.mock(
	'rsg-components/Slot',
	() =>
		function slotMock() {
			return <div />
		}
)

describe('SectionHeading', () => {
	const FakeToolbar = () => <div>Fake toolbar</div>

	test('should forward slot properties to the toolbar', () => {
		const { container } = render(
			<SectionHeading
				id="section"
				slotName="slot"
				slotProps={{ foo: 1, bar: 'baz', isolated: false } as any}
				depth={2}
			>
				A Section
			</SectionHeading>
		)

		expect(container).toMatchSnapshot()
	})

	test('render a section heading', () => {
		const { container } = render(
			<SectionHeadingRenderer id="section" href="/section" depth={2} toolbar={<FakeToolbar />}>
				A Section
			</SectionHeadingRenderer>
		)

		expect(container.querySelector('h2')).toMatchInlineSnapshot(`
		<h2
		  class="rsg--heading-6 rsg--heading2-8"
		  id="section"
		>
		  <a
		    class="rsg--sectionName-2"
		    href="/section"
		  >
		    A Section
		  </a>
		</h2>
	`)
	})

	test('render a deprecated section heading', () => {
		const { container } = render(
			<SectionHeadingRenderer
				id="section"
				href="/section"
				depth={2}
				toolbar={<FakeToolbar />}
				deprecated
			>
				A Section
			</SectionHeadingRenderer>
		)

		expect(container.querySelector('h2')).toMatchInlineSnapshot(`
		<h2
		  class="rsg--heading-6 rsg--heading2-8"
		  id="section"
		>
		  <a
		    class="rsg--sectionName-2 rsg--isDeprecated-3"
		    href="/section"
		  >
		    A Section
		  </a>
		</h2>
	`)
	})

	test('prevent the heading level from exceeding the maximum allowed by the Heading component', () => {
		const { container } = render(
			<SectionHeadingRenderer id="section" href="/section" depth={7} toolbar={<FakeToolbar />}>
				A Section
			</SectionHeadingRenderer>
		)

		expect(container.querySelector('h6')).toMatchInlineSnapshot(`
		<h6
		  class="rsg--heading-6 rsg--heading6-12"
		  id="section"
		>
		  <a
		    class="rsg--sectionName-2"
		    href="/section"
		  >
		    A Section
		  </a>
		</h6>
	`)
	})

	test('the href have id=section query parameter ', () => {
		const { getByRole } = render(
			<SectionHeading
				id="section"
				pagePerSection
				slotName="slot"
				slotProps={{ foo: 1, bar: 'baz', isolated: false } as any}
				depth={2}
			>
				A Section
			</SectionHeading>
		)

		expect(getByRole('link').getAttribute('href')).toEqual('/?id=section')
	})
})
