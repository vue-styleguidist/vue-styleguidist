// eslint-disable-next-line import/no-unresolved, import/extensions
import { danger, warn, fail } from 'danger'

var fs = require('fs')
var path = require('path')
var getSize = require('get-folder-size')
var gzipSize = require('gzip-size')
var validateMessage = require('validate-commit-msg')

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

if (changePackages.length > 0 && lockfileChanged) {
	warn(`Changes were made to \`yarn.lock\`, but to no \`package.json\` file in the package.

Please remove \`yarn.lock\` changes from your pull request. Try to run \`git checkout master -- yarn.lock\` and commit changes.`)
}

//simple regex matcher to detect usage of helper function and its type signature
var hotMatch = /\bhot\(/gi
var hotSignatureMatch = /\bimport \{.*?hot.*?\} from '.*?\/helpers\/marble-testing'/gi

var coldMatch = /\bcold\(/gi
var coldSignatureMatch = /\bimport \{.*?cold.*?\} from '.*?\/helpers\/marble-testing'/gi

var errorCount = 0

// Warn when PR size is large
var bigPRThreshold = 600
if (danger.github.pr.additions + danger.github.pr.deletions > bigPRThreshold) {
	warn(':exclamation: Big PR (' + ++errorCount + ')')
	markdown(
		'> (' +
			errorCount +
			') : Pull Request size seems relatively large. If Pull Request contains multiple changes, split each into separate PR will helps faster, easier review.'
	)
}

// Check test exclusion (.only) is included
var modifiedSpecFiles = danger.git.modified_files.filter(function(filePath) {
	return filePath.match(/__tests__\/.+\.(js|jsx|ts|tsx)$/gi)
})

var testFilesIncludeExclusion = modifiedSpecFiles.reduce(function(acc, value) {
	var content = fs.readFileSync(value).toString()
	var invalid = content.indexOf('it.only') >= 0 || content.indexOf('describe.only') >= 0
	if (invalid) {
		acc.push(path.basename(value))
	}
	return acc
}, [])

if (testFilesIncludeExclusion.length > 0) {
	fail('an `only` was left in tests (' + testFilesIncludeExclusion + ')')
}

// Check test cases missing type signature import for test marble helper functions
var testFilesMissingTypes = modifiedSpecFiles.reduce(function(acc, value) {
	var content = fs.readFileSync(value).toString()

	var hotFnMatchesWithoutTypes = content.match(hotMatch) && !content.match(hotSignatureMatch)
	var coldFnMatchesWithoutTypes = content.match(coldMatch) && !content.match(coldSignatureMatch)

	if (hotFnMatchesWithoutTypes || coldFnMatchesWithoutTypes) {
		acc.push(path.basename(value))
	}

	return acc
}, [])

if (testFilesMissingTypes.length > 0) {
	fail(
		'missing type definition import in tests (' + testFilesMissingTypes + ') (' + ++errorCount + ')'
	)
	markdown(
		'> (' +
			errorCount +
			') : It seems updated test cases uses test scheduler interface `hot`, `cold` but miss to import type signature for those.'
	)
}

//validate commit message in PR if it conforms conventional change log, notify if it doesn't.
var messageConventionValid = danger.git.commits.reduce(function(acc, value) {
	var valid = validateMessage(value.message)
	return valid && acc
}, true)

if (!messageConventionValid) {
	warn('commit message does not follows conventional change log (' + ++errorCount + ')')
	markdown(
		'> (' +
			errorCount +
			') : vue-styleguidist uses conventional change log to generate changelog automatically. It seems some of commit messages are not following those, please check [contributing guideline](https://github.com/ReactiveX/rxjs/blob/master/CONTRIBUTING.md#commit-message-format) and update commit messages.'
	)
}
