yarn
yarn docs:build
cd examples
for D in *; do yarn build "${D}"; done
for D in *; do mv "${D}"/dist ../docs/dist/"${D}"; done