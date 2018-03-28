import findSection from '../findSection';

const sections = [
	{
		name: 'Getting Started',
	},
	{
		name: 'General',
		sections: [
			{
				name: 'Particles',
				components: [
					{
						name: 'Button',
					},
					{
						name: 'Image',
					},
				],
			},
		],
	},
];

describe('findSection', () => {
	it('should return top level section', () => {
		const result = findSection(sections, 'General');
		expect(result).toEqual(sections[0]);
	});

	it('should return top level section when there is whitespace in name', () => {
		const result = findSection(sections, 'Getting Started');
		expect(result).toEqual(sections[0]);
	});

	it('should return nested sections', () => {
		const result = findSection(sections, 'Particles');
		expect(result).toEqual(sections[0].sections[0]);
	});

	it('should return undefined when no sections found', () => {
		const result = findSection(sections, 'Pizza');
		expect(result).toBeFalsy();
	});
});
