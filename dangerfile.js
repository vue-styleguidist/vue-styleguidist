// eslint-disable-next-line import/no-unresolved, import/extensions
import { danger, warn } from 'danger';

const packageChanged = danger.git.modified_files.includes('package.json');
const lockfileChanged = danger.git.modified_files.includes('yarn.lock');

if (packageChanged && !lockfileChanged) {
	warn(`Changes were made to \`package.json\`, but not to \`yarn.lock\`.

If you’ve changed any dependencies (added, removed or updated any packages), please run \`yarn install\` and commit changes in yarn.lock file.`);
}

if (!packageChanged && lockfileChanged) {
	warn(`Changes were made to \`yarn.lock\`, but not to \`package.json\`.

Please remove \`yarn.lock\` changes from your pull request. Try to run \`git checkout master -- yarn.lock\` and commit changes.`);
}
