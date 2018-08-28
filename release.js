const fs = require('fs');
const inquirer = require('inquirer');
const semver = require('semver');
const pkg = require('./package.json');

/**
 * Examples packages
 */
const pkgExamples = [
	{
		url: './examples/basic/package.json',
		json: require('./examples/basic/package.json'),
	},
	{
		url: './examples/vuecli3/package.json',
		json: require('./examples/vuecli3/package.json'),
	},
	{
		url: './examples/sections/package.json',
		json: require('./examples/sections/package.json'),
	},
	{
		url: './examples/customised/package.json',
		json: require('./examples/sections/package.json'),
	},
	{
		url: './examples/vuex/package.json',
		json: require('./examples/vuex/package.json'),
	},
	{
		url: './examples/with-sass-loader/package.json',
		json: require('./examples/with-sass-loader/package.json'),
	},
	{
		url: './examples/vuetify/package.json',
		json: require('./examples/vuetify/package.json'),
	},
];

const curVersion = pkg.version;

(async () => {
	const { newVersion } = await inquirer.prompt([
		{
			type: 'input',
			name: 'newVersion',
			message: `Please provide a version (current: ${curVersion}):`,
		},
	]);

	if (!semver.valid(newVersion)) {
		// eslint-disable-next-line
		console.error(`Invalid version: ${newVersion}`);
		process.exit(1);
	}

	if (semver.lt(newVersion, curVersion)) {
		// eslint-disable-next-line
		console.error(
			`New version (${newVersion}) cannot be lower than current version (${curVersion}).`
		);
		process.exit(1);
	}

	const { yes } = await inquirer.prompt([
		{
			name: 'yes',
			message: `Release ${newVersion}?`,
			type: 'confirm',
		},
	]);

	if (yes) {
		pkg.version = newVersion;
		fs.writeFileSync('./package.json', JSON.stringify(pkg, null, 2));
		pkgExamples.forEach(({ json, url }) => {
			json.version = newVersion;
			json.dependencies['vue-styleguidist'] = newVersion;
			fs.writeFileSync(url, JSON.stringify(json, null, 2));
		});
	} else {
		process.exit(1);
	}
})();
