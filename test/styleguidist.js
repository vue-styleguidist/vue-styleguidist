var examplePath = process.argv[3] || 'basic';

process.argv[3] = '--config';
process.argv[4] = `examples/${examplePath}/styleguide.config.js`;

require('../bin/styleguidist');
