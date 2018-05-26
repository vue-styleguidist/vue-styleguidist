import getPageTitle from '../getPageTitle';

const baseTitle = 'Styleguide';

describe('getPageTitle', () => {
	xit('should return style guide title for the all view', () => {
		const result = getPageTitle([], baseTitle, 'all');
		expect(result).toBe(baseTitle);
	});

	it('should return component name for component isolation mode', () => {
		const name = 'Component';
		const result = getPageTitle([{ components: [{ name }] }], baseTitle, 'component');
		expect(result).toMatch(name);
	});

	it('should return component name for example isolation mode', () => {
		const name = 'Component';
		const result = getPageTitle([{ components: [{ name }] }], baseTitle, 'example');
		expect(result).toMatch(name);
	});

	it('should return section name for section isolation mode', () => {
		const name = 'Section';
		const result = getPageTitle([{ name }], baseTitle, 'section');
		expect(result).toMatch(name);
	});
});
