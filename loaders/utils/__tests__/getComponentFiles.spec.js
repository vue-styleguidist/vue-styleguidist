import path from 'path';
import deabsDeep from 'deabsdeep';
import getComponentFiles from '../getComponentFiles';

const configDir = path.resolve(__dirname, '../../../test');
const components = ['one.js', 'two.js'];
const glob = 'components/**/[A-Z]*.js';

const deabs = x => deabsDeep(x, { root: configDir });
xdescribe('getComponentFiles', () => {
	it('should return an empty array if components is null', () => {
		const result = getComponentFiles();
		expect(result).toEqual([]);
	});

	it('should accept components as a function that returns file names', () => {
		const result = getComponentFiles(() => components, configDir);
		expect(deabs(result)).toEqual(['~/one.js', '~/two.js']);
	});

	it('should accept components as a function that returns absolute paths', () => {
		const absolutize = files => files.map(file => path.join(configDir, file));
		const result = getComponentFiles(() => absolutize(components), configDir);
		expect(deabs(result)).toEqual(['~/one.js', '~/two.js']);
	});

	it('should accept components as an array of file names', () => {
		const result = getComponentFiles(components, configDir);
		expect(deabs(result)).toEqual(['~/one.js', '~/two.js']);
	});

	it('should accept components as a function that returns absolute paths', () => {
		const absolutize = files => files.map(file => path.join(configDir, file));
		const result = getComponentFiles(absolutize(components), configDir);
		expect(deabs(result)).toEqual(['~/one.js', '~/two.js']);
	});

	it('should accept components as a glob', () => {
		const result = getComponentFiles(glob, configDir);
		expect(deabs(result)).toEqual([
			'~/components/Annotation/Annotation.js',
			'~/components/Button/Button.js',
			'~/components/Placeholder/Placeholder.js',
			'~/components/Price/Price.js',
			'~/components/RandomButton/RandomButton.js',
		]);
	});

	it('should ignore specified patterns', () => {
		const result = getComponentFiles(glob, configDir, ['**/*Button*']);
		expect(deabs(result)).toEqual([
			'~/components/Annotation/Annotation.js',
			'~/components/Placeholder/Placeholder.js',
			'~/components/Price/Price.js',
		]);
	});

	it('should throw if components is not a function, array or a string', () => {
		const fn = () => getComponentFiles(42, configDir);
		expect(fn).toThrowError('should be string, function or array');
	});
});
