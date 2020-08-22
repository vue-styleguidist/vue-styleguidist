touch2() { mkdir -p "$(dirname "$1")" && touch "$1" ; }

touch2 packages/vue-styleguidist/lib/bin/styleguidist.js
touch2 packages/vue-styleguidist/lib/scripts/index.js
touch2 packages/vue-docgen-cli/lib/bin.js