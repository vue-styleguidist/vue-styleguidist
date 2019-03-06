// eslint-disable-next-line import/no-unresolved, import/extensions
import { danger, warn } from 'danger'

const packages = [
	'package.json',
	'packages/vue-styleguidist/package.json',
	'packages/vue-docgen-api/package.json',
	'packages/vue-cli-plugin-styleguidist/package.json'
]

const changePackages = packages.filter(f => {
	danger.git.modified_files.includes(f)
})

const lockfileChanged = danger.git.modified_files.includes('yarn.lock')

if (!lockfileChanged && changePackages.length) {
	if (changePackages.length === 1) {
		warn(`Changes were made to \`${changePackages[0]}\`, but not to \`yarn.lock\`.
		
If you’ve changed any dependencies (added, removed or updated any packages), please run \`yarn install\` and commit changes in yarn.lock file.`)
	} else {
		warn(`Changes were made to all the following files \`${changePackages.join(
			'`, `'
		)}\`, but not to \`yarn.lock\`.
		
If you’ve changed any dependencies (added, removed or updated any packages), please run \`yarn install\` and commit changes in yarn.lock file.`)
	}
}

if (!changePackages.length && lockfileChanged) {
	warn(`Changes were made to \`yarn.lock\`, but to no \`package.json\` file in the package.

Please remove \`yarn.lock\` changes from your pull request. Try to run \`git checkout master -- yarn.lock\` and commit changes.`)
}
