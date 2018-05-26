import path from 'path';
import getProps from '../getProps';

xdescribe('getProps', () => {
	it('should return an object for props', () => {
		const result = getProps({
			displayName: 'Button',
			description: 'The only true button.',
			methods: [],
			props: {
				children: {
					type: {},
					required: true,
					description: 'Button label.',
				},
				color: {
					type: {},
					required: false,
					description: '',
				},
			},
		});

		expect(result).toMatchSnapshot();
	});

	it('should return an object for props without description', () => {
		const result = getProps({
			displayName: 'Button',
			props: {
				children: {
					type: {},
					required: true,
					description: 'Button label.',
				},
			},
		});

		expect(result).toMatchSnapshot();
	});

	it('should remove non-public methods', () => {
		const result = getProps(
			{
				displayName: 'Button',
				methods: [
					{
						docblock: `Public method.
@public`,
					},
					{
						docblock: `Private method.
@private`,
					},
					{
						docblock: 'Private method by default.',
					},
				],
			},
			__filename
		);

		expect(result).toMatchSnapshot();
	});

	it('should return an object for props with doclets', () => {
		const result = getProps(
			{
				displayName: 'Button',
				description: `
The only true button.

@foo Foo
@bar Bar
`,
			},
			__filename
		);

		expect(result).toMatchSnapshot();
	});

	it('should return require statement for @example doclet', () => {
		const result = getProps(
			{
				displayName: 'Button',
				description: `
The only true button.

@example ../../../test/components/Placeholder/examples.md
`,
			},
			__filename
		);

		expect(result).toMatchSnapshot();
	});

	it('should return require statement for @example doclet only when the file exists', () => {
		const result = getProps(
			{
				displayName: 'Button',
				description: `
The only true button.

@example example.md
`,
			},
			__filename
		);

		expect(result).toMatchSnapshot();
	});

	it('should highlight code in description (regular code block)', () => {
		const result = getProps({
			description: `
The only true button.

    alert('Hello world');
`,
		});

		expect(result).toMatchSnapshot();
	});

	it('should highlight code in description (fenced code block)', () => {
		const result = getProps({
			description: `
The only true button.

\`\`\`
alert('Hello world');
\`\`\`
`,
		});

		expect(result).toMatchSnapshot();
	});

	it("should not crash when using doctrine to parse a default prop that isn't in the props list", () => {
		const result = getProps({
			description: 'The only true button.',
			methods: [],
			props: {
				crash: {
					description: undefined,
				},
			},
		});

		expect(result).toMatchSnapshot();
	});

	it('should guess a displayName for components that react-docgen was not able to recognize', () => {
		const result = getProps(
			{
				methods: [],
				props: {},
			},
			path.join('an', 'absolute', 'path', 'to', 'YourComponent.js')
		);
		expect(result).toHaveProperty('displayName', 'YourComponent');
	});
});
