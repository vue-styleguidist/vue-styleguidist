<template>
  <div />
</template>

<script>
// const theCategories = [1, 2, 3, 4, 5]; // comment this line out and try the others.

// Previously, all of the below would work.

// Neither of these work.
// const theCategories = require('./deps/exportDefault.js').default;
const theCategories = require('./deps/moduleExports.js')

// import theCategories from './deps/exportDefault'; // works!
// import theCategories from './deps/moduleExports'; // works!

module.exports = {
	props: {
		test
	}
}
</script>

<docs>

  ```jsx
  <external-require>
  </external-require>
  ```
</docs>
