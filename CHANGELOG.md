# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [4.14.0](https://github.com/vue-styleguidist/vue-styleguidist/compare/v4.13.1...v4.14.0) (2020-03-18)


### Bug Fixes

* **docs:** Correct netlify build command ([92dc3be](https://github.com/vue-styleguidist/vue-styleguidist/commit/92dc3bee6ad6d08a1dfc6e9a011ea98db372664d))
* allow webpackConfig functions to return alias ([5a6b6a3](https://github.com/vue-styleguidist/vue-styleguidist/commit/5a6b6a30ba609b2ddfbf0b6d894e802ca157f724)), closes [#793](https://github.com/vue-styleguidist/vue-styleguidist/issues/793)
* make interface for codetabbutton exported ([ccd52d8](https://github.com/vue-styleguidist/vue-styleguidist/commit/ccd52d83ed7fafa6faf2f7ad9e31ff7ef0fd375f))


### Features

* expose typescript types for theming ([3110fb5](https://github.com/vue-styleguidist/vue-styleguidist/commit/3110fb5b8342b3c89a70e9ecaf710a4c3a77bee5))





## [4.13.1](https://github.com/vue-styleguidist/vue-styleguidist/compare/v4.13.0...v4.13.1) (2020-03-03)


### Bug Fixes

* an SFC example can contain JSX ([deb2dc7](https://github.com/vue-styleguidist/vue-styleguidist/commit/deb2dc7ebda80938d59ab458faa8699f7305eb35))
* multiple exports in parse export default ([7bb82dd](https://github.com/vue-styleguidist/vue-styleguidist/commit/7bb82ddb3e8173dccc344117a4a2e50b42360639))
* sort docs when all promises are resolved ([dbaa82e](https://github.com/vue-styleguidist/vue-styleguidist/commit/dbaa82e3a08113dd0182647ea2fa3a7b2b6bfdd4))
* **docgen:** export iev var names ([c02268b](https://github.com/vue-styleguidist/vue-styleguidist/commit/c02268b31fd34f8e1cabd4f149f2e8dd30ff0ee3))
* **docgen:** handlers expressions with multiline ([8e7c66c](https://github.com/vue-styleguidist/vue-styleguidist/commit/8e7c66c62388746579ddda3753aa743b41a88c43)), closes [#772](https://github.com/vue-styleguidist/vue-styleguidist/issues/772)





# [4.13.0](https://github.com/vue-styleguidist/vue-styleguidist/compare/v4.12.2...v4.13.0) (2020-03-02)


### Bug Fixes

* avoid systematic verbose ([d43c6b0](https://github.com/vue-styleguidist/vue-styleguidist/commit/d43c6b0d8b6b5c782d806925eccd6d4b95526292))
* use logger instead on console ([01ac6dc](https://github.com/vue-styleguidist/vue-styleguidist/commit/01ac6dc3ad67848d51033dec1be3245f30afdba3))


### Features

* allow mutiple extra example files ([d06283b](https://github.com/vue-styleguidist/vue-styleguidist/commit/d06283b841bca17db6125deb83bffc3ec565ac35))





## [4.12.2](https://github.com/vue-styleguidist/vue-styleguidist/compare/v4.12.1...v4.12.2) (2020-03-02)


### Bug Fixes

* **plugin:** pass cli options down to vsg ([6765aee](https://github.com/vue-styleguidist/vue-styleguidist/commit/6765aee4a72b8ab36eb0094ead8a92d7b4a6789c)), closes [#771](https://github.com/vue-styleguidist/vue-styleguidist/issues/771)
* allow examples start with < & pure template ([3860129](https://github.com/vue-styleguidist/vue-styleguidist/commit/3860129c4c7bac644df39e6ac3a128a4e09ea84d))
* avoid progress bar when verbose ([75f77d0](https://github.com/vue-styleguidist/vue-styleguidist/commit/75f77d0d6f92fa2f72ec9f625ec72c3c76077c92))
* bring back the full power of verbose option ([210bae2](https://github.com/vue-styleguidist/vue-styleguidist/commit/210bae2c9e5b935c17cb7add5bfdef9459b90a6c))
* hot reload default examples ([295cfe5](https://github.com/vue-styleguidist/vue-styleguidist/commit/295cfe553ce8d5e48a3c7607672017246d65d992))





## [4.12.1](https://github.com/vue-styleguidist/vue-styleguidist/compare/v4.12.0...v4.12.1) (2020-02-26)


### Bug Fixes

* remove annoying warning about double use ([1dce586](https://github.com/vue-styleguidist/vue-styleguidist/commit/1dce586111f53975a5585da1d5f580aa06b6c425))





# [4.12.0](https://github.com/vue-styleguidist/vue-styleguidist/compare/v4.11.0...v4.12.0) (2020-02-25)


### Bug Fixes

* pre classname warning ([b80f97a](https://github.com/vue-styleguidist/vue-styleguidist/commit/b80f97a9818410b46ec03552d27b2b59b18531d8))
* **docgen:** take mixin order into account ([626337e](https://github.com/vue-styleguidist/vue-styleguidist/commit/626337ebc2bce975b16815971f73f3a6f7b7a9b8)), closes [#761](https://github.com/vue-styleguidist/vue-styleguidist/issues/761)


### Features

* allow to ignore some example file lookup ([7104271](https://github.com/vue-styleguidist/vue-styleguidist/commit/71042712b28afc519ad631f873d8e62a87b821ae))
* detect when example file loaded twice ([e4b1a48](https://github.com/vue-styleguidist/vue-styleguidist/commit/e4b1a4808f0b175bb0a23088e139595da58b14c4))
* **docgen:** methods returned by other methods ([95e648c](https://github.com/vue-styleguidist/vue-styleguidist/commit/95e648c784773b57603e0f8ebca652a5f3a76b5d)), closes [#765](https://github.com/vue-styleguidist/vue-styleguidist/issues/765)





# [4.11.0](https://github.com/vue-styleguidist/vue-styleguidist/compare/v4.10.1...v4.11.0) (2020-02-22)


### Bug Fixes

* only show required props on default examples ([0f6bc11](https://github.com/vue-styleguidist/vue-styleguidist/commit/0f6bc1188cff5d4781bebb1ddef48d6b0f9482b2))


### Features

* give default examples a variable geometry ([535e347](https://github.com/vue-styleguidist/vue-styleguidist/commit/535e347e3970b5c48a40ac538892cffe85a89977))





## [4.10.1](https://github.com/vue-styleguidist/vue-styleguidist/compare/v4.10.0...v4.10.1) (2020-02-17)


### Bug Fixes

* update Prism theming & docs ([70514b9](https://github.com/vue-styleguidist/vue-styleguidist/commit/70514b95cea7d689ff404491ddf6d73c20f547a3))





# [4.10.0](https://github.com/vue-styleguidist/vue-styleguidist/compare/v4.9.1...v4.10.0) (2020-02-17)


### Features

* allow usage of prism themes ([921dbd5](https://github.com/vue-styleguidist/vue-styleguidist/commit/921dbd5e26c420d692f607a7f18bcff4e626d404))


### Reverts

* Revert "refactor: avoid converting events and slots" ([d8e4d4d](https://github.com/vue-styleguidist/vue-styleguidist/commit/d8e4d4dfab49c26be1ca2e254144b57c69a3019e))





## [4.9.1](https://github.com/vue-styleguidist/vue-styleguidist/compare/v4.9.0...v4.9.1) (2020-02-16)


### Bug Fixes

* create-server bis for csb ([0768c51](https://github.com/vue-styleguidist/vue-styleguidist/commit/0768c5143d41762caf59f5d07a1e0bc74a2570e3))
* update create-server for codesandbox ([4906894](https://github.com/vue-styleguidist/vue-styleguidist/commit/4906894767b9d14bb028a358bfaed69049fed91d))





# [4.9.0](https://github.com/vue-styleguidist/vue-styleguidist/compare/v4.8.1...v4.9.0) (2020-02-16)


### Bug Fixes

* make origin column smaller ([4b7027e](https://github.com/vue-styleguidist/vue-styleguidist/commit/4b7027ec27a03c8be588d93c3d2e8772e07d45d9))
* stop rendering bad event properties ([26fccd9](https://github.com/vue-styleguidist/vue-styleguidist/commit/26fccd9a78aba06f0a8403a8ff3123b8a8851aba))


### Features

* add displayOrigins to vue-cli-ui ([df871db](https://github.com/vue-styleguidist/vue-styleguidist/commit/df871dba383b2c01dd6b021d36b62026b70ec447))
* origin column on props event methods & slots ([8b0650f](https://github.com/vue-styleguidist/vue-styleguidist/commit/8b0650f08d3c4cde0970fd87aabb439cd1e06ef0))





## [4.8.1](https://github.com/vue-styleguidist/vue-styleguidist/compare/v4.8.0...v4.8.1) (2020-02-13)


### Bug Fixes

* protect slots in if statements ([1d3d29e](https://github.com/vue-styleguidist/vue-styleguidist/commit/1d3d29e25ee31d6e2ffdc616247d29dadec6700f)), closes [#753](https://github.com/vue-styleguidist/vue-styleguidist/issues/753)





# [4.8.0](https://github.com/vue-styleguidist/vue-styleguidist/compare/v4.7.7...v4.8.0) (2020-02-12)


### Bug Fixes

* **docgen:** protect empty comments before slots ([6484a10](https://github.com/vue-styleguidist/vue-styleguidist/commit/6484a106b2964c5f1858171ad4ad40642a4f98b9)), closes [#749](https://github.com/vue-styleguidist/vue-styleguidist/issues/749)


### Features

* add tags to slots ([dcbddf8](https://github.com/vue-styleguidist/vue-styleguidist/commit/dcbddf82631d53422d5666ca1eb1971d828b4f04))





## [4.7.7](https://github.com/vue-styleguidist/vue-styleguidist/compare/v4.7.6...v4.7.7) (2020-02-10)


### Bug Fixes

* import of named mixins failing ([185fb22](https://github.com/vue-styleguidist/vue-styleguidist/commit/185fb229d5404ed5e26e319b499cf13b1e3a5a8a))
* **docgen:** use webpack modules when resolving paths ([6b5b87f](https://github.com/vue-styleguidist/vue-styleguidist/commit/6b5b87f65e219ce5798ac0ea044271a25d6ad086)), closes [#743](https://github.com/vue-styleguidist/vue-styleguidist/issues/743)





## [4.7.6](https://github.com/vue-styleguidist/vue-styleguidist/compare/v4.7.5...v4.7.6) (2020-01-23)


### Bug Fixes

* **docgen:** handle empty handler ([f811ed3](https://github.com/vue-styleguidist/vue-styleguidist/commit/f811ed3d6d16be36eb10071dd15381d8008e54fd)), closes [#738](https://github.com/vue-styleguidist/vue-styleguidist/issues/738)





## [4.7.5](https://github.com/vue-styleguidist/vue-styleguidist/compare/v4.7.4...v4.7.5) (2020-01-23)


### Bug Fixes

* **docgen:** filter components more clearly ([09b15e9](https://github.com/vue-styleguidist/vue-styleguidist/commit/09b15e9824dd7687ceb8bd94455c4ed5870b3214)), closes [#735](https://github.com/vue-styleguidist/vue-styleguidist/issues/735)





## [4.7.4](https://github.com/vue-styleguidist/vue-styleguidist/compare/v4.7.3...v4.7.4) (2020-01-22)


### Bug Fixes

* **docgen:** allow multi line root comment ([c6eacf7](https://github.com/vue-styleguidist/vue-styleguidist/commit/c6eacf72ffd60a21ca45248951076464264f5ea4))
* **docgen:** docs only vue components ([fcc28f6](https://github.com/vue-styleguidist/vue-styleguidist/commit/fcc28f6f330736b565bd3343422a2cc8792f8200)), closes [#731](https://github.com/vue-styleguidist/vue-styleguidist/issues/731)
* **docgen:** make events parsed in template ([e361bef](https://github.com/vue-styleguidist/vue-styleguidist/commit/e361bef34cdc78baf08f12cf69eb17069af49527))





## [4.7.3](https://github.com/vue-styleguidist/vue-styleguidist/compare/v4.7.2...v4.7.3) (2020-01-21)


### Bug Fixes

* Revert "fix: avoid cors issue on codesandbox" ([20696ad](https://github.com/vue-styleguidist/vue-styleguidist/commit/20696ad508d97efe1e85add6704ad05154ebf359))
* Revert "fix: make library compatible with codesandbox" ([ed32d73](https://github.com/vue-styleguidist/vue-styleguidist/commit/ed32d73dbcb8894a3f5f3bcb7d6dcb7937588b13))





## [4.7.2](https://github.com/vue-styleguidist/vue-styleguidist/compare/v4.7.1...v4.7.2) (2020-01-20)


### Bug Fixes

* avoid cors issue on codesandbox ([26450b2](https://github.com/vue-styleguidist/vue-styleguidist/commit/26450b28535eeb032385a99799a05f6ccf1f7951))





## [4.7.1](https://github.com/vue-styleguidist/vue-styleguidist/compare/v4.7.0...v4.7.1) (2020-01-20)


### Bug Fixes

* make library compatible with codesandbox ([c4b531d](https://github.com/vue-styleguidist/vue-styleguidist/commit/c4b531db8d00f31eb9aad6aa240cb3ab1415541e))





# [4.7.0](https://github.com/vue-styleguidist/vue-styleguidist/compare/v4.6.1...v4.7.0) (2020-01-20)


### Features

* detect events in template ([327b54e](https://github.com/vue-styleguidist/vue-styleguidist/commit/327b54e5aa690aac039387cf6bb133d94c1774d9))
* parse $emit in templates ([21d5eca](https://github.com/vue-styleguidist/vue-styleguidist/commit/21d5ecafea66a1cdc1eb58387fd19bb9cb394437)), closes [#725](https://github.com/vue-styleguidist/vue-styleguidist/issues/725)





## [4.6.1](https://github.com/vue-styleguidist/vue-styleguidist/compare/v4.6.0...v4.6.1) (2020-01-19)


### Bug Fixes

* call to  ast-types builder ([071b067](https://github.com/vue-styleguidist/vue-styleguidist/commit/071b06717b9d93c125e71ec07e054a3a9811c58f))
* theme and styles as files ([0d33fe0](https://github.com/vue-styleguidist/vue-styleguidist/commit/0d33fe034e4ea6ea93a356b57745a8de17a32a47))





# [4.6.0](https://github.com/vue-styleguidist/vue-styleguidist/compare/v4.5.2...v4.6.0) (2020-01-19)


### Bug Fixes

* parse should export default cmp if available ([753dea4](https://github.com/vue-styleguidist/vue-styleguidist/commit/753dea4c26a3918488b08b32bfe8b7dbea109f60))


### Features

* allow iev as valid component ([21c4874](https://github.com/vue-styleguidist/vue-styleguidist/commit/21c48740823c3fd790abd689985f0558afbb374b)), closes [#713](https://github.com/vue-styleguidist/vue-styleguidist/issues/713)





## [4.5.2](https://github.com/vue-styleguidist/vue-styleguidist/compare/v4.5.1...v4.5.2) (2020-01-17)


### Bug Fixes

* multiple exports in vue files ([56fcdd8](https://github.com/vue-styleguidist/vue-styleguidist/commit/56fcdd8f0642347f16e88dd04b2d4c7ec8aef9c6)), closes [#717](https://github.com/vue-styleguidist/vue-styleguidist/issues/717)





## [4.5.1](https://github.com/vue-styleguidist/vue-styleguidist/compare/v4.5.0...v4.5.1) (2020-01-16)


### Bug Fixes

* requires in SFC examples ([cb22308](https://github.com/vue-styleguidist/vue-styleguidist/commit/cb223085f0e116ebb58d133a14de3216b81f5a01)), closes [#714](https://github.com/vue-styleguidist/vue-styleguidist/issues/714)





# [4.5.0](https://github.com/vue-styleguidist/vue-styleguidist/compare/v4.4.3...v4.5.0) (2020-01-15)


### Bug Fixes

* typings automated template ([711b14b](https://github.com/vue-styleguidist/vue-styleguidist/commit/711b14bffb7c733c7bdc0f75714b4ef5339dc554))


### Features

* update rsg with new theming ([af0ceb2](https://github.com/vue-styleguidist/vue-styleguidist/commit/af0ceb2bba6f9b8fe6a000c121e02b7a2e435c8c))





## [4.4.3](https://github.com/vue-styleguidist/vue-styleguidist/compare/v4.4.2...v4.4.3) (2020-01-11)


### Bug Fixes

* new Vue compatible with live require ([f3f68a8](https://github.com/vue-styleguidist/vue-styleguidist/commit/f3f68a83651c12d0293a395cc7f997c1eb2e8f36)), closes [#702](https://github.com/vue-styleguidist/vue-styleguidist/issues/702)





## [4.4.2](https://github.com/vue-styleguidist/vue-styleguidist/compare/v4.4.1...v4.4.2) (2020-01-10)


### Bug Fixes

* resolve immediately exported vars recursively ([7b27480](https://github.com/vue-styleguidist/vue-styleguidist/commit/7b27480b2954f9d9f9307d3ac717709cae3c3194))
* **docgen:** origin never cleared ([0dc4251](https://github.com/vue-styleguidist/vue-styleguidist/commit/0dc42513e83a46323ffb4227e4a0b5d485ca06cd))


### Performance Improvements

* avoid looking at node_modules in IEV ([55e29e3](https://github.com/vue-styleguidist/vue-styleguidist/commit/55e29e397b67bc19ebd535064d5a62fc67e690df))
* use await for reading file async ([cf254c0](https://github.com/vue-styleguidist/vue-styleguidist/commit/cf254c0c93e2a29bc78189bbd215e65cc7804e67))





## [4.4.1](https://github.com/vue-styleguidist/vue-styleguidist/compare/v4.4.0...v4.4.1) (2020-01-09)


### Bug Fixes

* collapsible sections tocMode ([e5f7bfd](https://github.com/vue-styleguidist/vue-styleguidist/commit/e5f7bfdfc70acaa97ed7ae297363c418dfec3001))





# [4.4.0](https://github.com/vue-styleguidist/vue-styleguidist/compare/v4.3.0...v4.4.0) (2020-01-09)


### Bug Fixes

* resolve conflicts ([ff45137](https://github.com/vue-styleguidist/vue-styleguidist/commit/ff45137696424526575aec9aaf118b482ff6db80))
* update error management in docgen loader ([f23f267](https://github.com/vue-styleguidist/vue-styleguidist/commit/f23f267c630f9ee92742d000a4c1cfb8fe698635))
* warning when documenting return of a method ([0a74e3b](https://github.com/vue-styleguidist/vue-styleguidist/commit/0a74e3bdf11fc821714ea0e0c44e008c473c9b8e))


### Features

* **docgen:** add vuetify exported component ([932e2ec](https://github.com/vue-styleguidist/vue-styleguidist/commit/932e2ec6e51402db365b6de15f36762bf999184e))





# [4.3.0](https://github.com/vue-styleguidist/vue-styleguidist/compare/v4.2.3...v4.3.0) (2020-01-08)


### Features

* collapsible sections ([43715a7](https://github.com/vue-styleguidist/vue-styleguidist/commit/43715a7532d07ba5f5f868a2628fbc10eae52543)), closes [#689](https://github.com/vue-styleguidist/vue-styleguidist/issues/689)
* **docgen:** resolve pass through components ([07d183f](https://github.com/vue-styleguidist/vue-styleguidist/commit/07d183faad4bb2125bb389dcc065865d2d105dcb))





## [4.2.3](https://github.com/vue-styleguidist/vue-styleguidist/compare/v4.2.2...v4.2.3) (2019-12-23)


### Bug Fixes

* add warning when using editorConfig ([b39f6f8](https://github.com/vue-styleguidist/vue-styleguidist/commit/b39f6f851455f208a9ae9092c8226cf2f7c3322c))
* typings of Styleguide ([f50d3b5](https://github.com/vue-styleguidist/vue-styleguidist/commit/f50d3b5b78cbab95c76f522cc2c7ae2c3b8a91c0))





## [4.2.2](https://github.com/vue-styleguidist/vue-styleguidist/compare/v4.2.1...v4.2.2) (2019-12-18)


### Performance Improvements

* **docgen:** make sure optional prop are optional ([3695ed6](https://github.com/vue-styleguidist/vue-styleguidist/commit/3695ed6632612de3ad68794a6fd3a62dd4e46533))





## [4.2.1](https://github.com/vue-styleguidist/vue-styleguidist/compare/v4.2.0...v4.2.1) (2019-12-11)


### Bug Fixes

* update copy-webpack-plugin to 5.1.0 ([fa2f13b](https://github.com/vue-styleguidist/vue-styleguidist/commit/fa2f13b)), closes [#675](https://github.com/vue-styleguidist/vue-styleguidist/issues/675)





# [4.2.0](https://github.com/vue-styleguidist/vue-styleguidist/compare/v4.1.2...v4.2.0) (2019-12-10)


### Features

* detect model property ([1c28167](https://github.com/vue-styleguidist/vue-styleguidist/commit/1c28167)), closes [#654](https://github.com/vue-styleguidist/vue-styleguidist/issues/654)
* **docgen:** allow to customize validExtends ([eb966c5](https://github.com/vue-styleguidist/vue-styleguidist/commit/eb966c5))
* pass validExtends to styleguide.config.js ([c22f7d5](https://github.com/vue-styleguidist/vue-styleguidist/commit/c22f7d5))





## [4.1.2](https://github.com/vue-styleguidist/vue-styleguidist/compare/v4.1.1...v4.1.2) (2019-12-08)

**Note:** Version bump only for package vue-styleguidist





## [4.1.1](https://github.com/vue-styleguidist/vue-styleguidist/compare/v4.1.0...v4.1.1) (2019-12-05)

**Note:** Version bump only for package vue-styleguidist





# [4.1.0](https://github.com/vue-styleguidist/vue-styleguidist/compare/v4.0.8...v4.1.0) (2019-12-04)


### Bug Fixes

* **docgen:** support [@values](https://github.com/values) on classPropHandler ([4b7f8b6](https://github.com/vue-styleguidist/vue-styleguidist/commit/4b7f8b6))


### Features

* **docgen:** multi-components in a file ([3790837](https://github.com/vue-styleguidist/vue-styleguidist/commit/3790837))





## [4.0.8](https://github.com/vue-styleguidist/vue-styleguidist/compare/v4.0.7...v4.0.8) (2019-12-02)


### Bug Fixes

* make sections without examples pre-compile ([56d675d](https://github.com/vue-styleguidist/vue-styleguidist/commit/56d675d))





## [4.0.7](https://github.com/vue-styleguidist/vue-styleguidist/compare/v4.0.6...v4.0.7) (2019-12-01)


### Bug Fixes

* **docgen:** avoid incorrect of getting nested '}' param type ([5df05e0](https://github.com/vue-styleguidist/vue-styleguidist/commit/5df05e0))
* destroy Vue component in Preview when replacing it or unmounting ([00b7658](https://github.com/vue-styleguidist/vue-styleguidist/commit/00b7658))





## [4.0.6](https://github.com/vue-styleguidist/vue-styleguidist/compare/v4.0.5...v4.0.6) (2019-11-21)


### Bug Fixes

* **plugin:** avoid fork-ts success notification ([9ac7a09](https://github.com/vue-styleguidist/vue-styleguidist/commit/9ac7a09))





## [4.0.5](https://github.com/vue-styleguidist/vue-styleguidist/compare/v4.0.4...v4.0.5) (2019-11-20)


### Bug Fixes

* **docgen:** ensure custom handlers are actually run ([7a0ac62](https://github.com/vue-styleguidist/vue-styleguidist/commit/7a0ac62))





## [4.0.4](https://github.com/vue-styleguidist/vue-styleguidist/compare/v4.0.3...v4.0.4) (2019-11-19)


### Bug Fixes

* **docgen:** fixed description extraction on non-SFC components ([85626fc](https://github.com/vue-styleguidist/vue-styleguidist/commit/85626fc))





## [4.0.3](https://github.com/vue-styleguidist/vue-styleguidist/compare/v4.0.2...v4.0.3) (2019-11-19)


### Bug Fixes

* babel typescript snafu ([d72c43e](https://github.com/vue-styleguidist/vue-styleguidist/commit/d72c43e)), closes [#639](https://github.com/vue-styleguidist/vue-styleguidist/issues/639)





## [4.0.2](https://github.com/vue-styleguidist/vue-styleguidist/compare/v4.0.1...v4.0.2) (2019-11-18)


### Bug Fixes

* import issue conflicts with babel ([f1ac618](https://github.com/vue-styleguidist/vue-styleguidist/commit/f1ac618)), closes [#635](https://github.com/vue-styleguidist/vue-styleguidist/issues/635)
* **plugin:** default custom components ([9c45104](https://github.com/vue-styleguidist/vue-styleguidist/commit/9c45104))





## [4.0.1](https://github.com/vue-styleguidist/vue-styleguidist/compare/v3.26.2...v4.0.1) (2019-11-15)


### Bug Fixes

* mixed scoped and non-scoped slots render ([4161ff2](https://github.com/vue-styleguidist/vue-styleguidist/commit/4161ff2))
* **plugin:** es6 requires fix in plugin ([205f7a1](https://github.com/vue-styleguidist/vue-styleguidist/commit/205f7a1))
* warning when unnamed event param ([df587dd](https://github.com/vue-styleguidist/vue-styleguidist/commit/df587dd))
* render event types as properties ([48fc5e7](https://github.com/vue-styleguidist/vue-styleguidist/commit/48fc5e7))
* **docgen:** avoid setting exportName to deps ([230e1e3](https://github.com/vue-styleguidist/vue-styleguidist/commit/230e1e3))
* **plugin:** load styleguidist right ([d4c6f6d](https://github.com/vue-styleguidist/vue-styleguidist/commit/d4c6f6d))
* section depth needs too be taken ([b663f1e](https://github.com/vue-styleguidist/vue-styleguidist/commit/b663f1e))
* wrongly filtered and typed props array ([3495840](https://github.com/vue-styleguidist/vue-styleguidist/commit/3495840))
* avoid double progressBar ([e39878e](https://github.com/vue-styleguidist/vue-styleguidist/commit/e39878e))
* move the build files to the right folder ([9944972](https://github.com/vue-styleguidist/vue-styleguidist/commit/9944972)), closes [#615](https://github.com/vue-styleguidist/vue-styleguidist/issues/615)
* publish templates with vsg ([f8df33f](https://github.com/vue-styleguidist/vue-styleguidist/commit/f8df33f))
* passing a webpackConfig should prioitize ([683f3dc](https://github.com/vue-styleguidist/vue-styleguidist/commit/683f3dc))
* split compiler & utils - efficient code split ([9ef9d06](https://github.com/vue-styleguidist/vue-styleguidist/commit/9ef9d06))
* **docgen:** make docgen output arrays only ([d456c6c](https://github.com/vue-styleguidist/vue-styleguidist/commit/d456c6c))
* **docgen:** avoid outputing empty array ([51d42bf](https://github.com/vue-styleguidist/vue-styleguidist/commit/51d42bf))
* publish templates with vsg ([f8df33f](https://github.com/vue-styleguidist/vue-styleguidist/commit/f8df33f))



### Code Refactoring

* **docgen:** make function docgen.parse async ([e17680b](https://github.com/vue-styleguidist/vue-styleguidist/commit/e17680b))
* **docgen:** make required always a boolean ([03bc88e](https://github.com/vue-styleguidist/vue-styleguidist/commit/03bc88e))



### Features

* review the style of default functions ([98ae04c](https://github.com/vue-styleguidist/vue-styleguidist/commit/98ae04c))
* **plugin:** better default config for ([9a19cc4](https://github.com/vue-styleguidist/vue-styleguidist/commit/9a19cc4))
* make arrow functions default cleaner ([f16b424](https://github.com/vue-styleguidist/vue-styleguidist/commit/f16b424))
* **docgen:** refactor bindings ([b501f82](https://github.com/vue-styleguidist/vue-styleguidist/commit/b501f82))
* use bindings comments in styleguidist ([4fb6551](https://github.com/vue-styleguidist/vue-styleguidist/commit/4fb6551))
* review design of all props output ([cc80bd5](https://github.com/vue-styleguidist/vue-styleguidist/commit/cc80bd5))
* use [@values](https://github.com/values) tag in props ([cb2fc74](https://github.com/vue-styleguidist/vue-styleguidist/commit/cb2fc74)), closes [#345](https://github.com/vue-styleguidist/vue-styleguidist/issues/345)
* **docgen:** accept more tags for event params ([cc55f58](https://github.com/vue-styleguidist/vue-styleguidist/commit/cc55f58))
* **docgen:** add exportName to CompoentDoc ([9466105](https://github.com/vue-styleguidist/vue-styleguidist/commit/9466105))
* add option to disable progress bar ([6ec4e9d](https://github.com/vue-styleguidist/vue-styleguidist/commit/6ec4e9d))
* **cli:** expose docgen-cli config interfaces ([25f0744](https://github.com/vue-styleguidist/vue-styleguidist/commit/25f0744))
* add plugin for docgen cli ([a545aa5](https://github.com/vue-styleguidist/vue-styleguidist/commit/a545aa5)), closes [#614](https://github.com/vue-styleguidist/vue-styleguidist/issues/614)
* add progress bar while compiling ([f16b901](https://github.com/vue-styleguidist/vue-styleguidist/commit/f16b901))
* emit types for vue-styleguidist ([f0af958](https://github.com/vue-styleguidist/vue-styleguidist/commit/f0af958))
* **cli:** use writeStream for better performance ([25da08c](https://github.com/vue-styleguidist/vue-styleguidist/commit/25da08c))
* **cli:** use writeStream for better performance ([25da08c](https://github.com/vue-styleguidist/vue-styleguidist/commit/25da08c))
* emit types for vue-styleguidist ([f0af958](https://github.com/vue-styleguidist/vue-styleguidist/commit/f0af958))
* use the functional tag in docgen cli ([c6f8725](https://github.com/vue-styleguidist/vue-styleguidist/commit/c6f8725))
* add progress bar while compiling ([f16b901](https://github.com/vue-styleguidist/vue-styleguidist/commit/f16b901))
* change defaults for codeSplit & simpleEditor ([810bf1c](https://github.com/vue-styleguidist/vue-styleguidist/commit/810bf1c))


### BREAKING CHANGES

* **docgen:** props, events, methods and slots are now all arrays

Co-authored-by: Sébastien D. <demsking@gmail.com>
* **docgen:** required for props is never a string anymore
* **docgen:** docgen becomes async, so do all of the handlers
* change defaults for `simpleEditor` mean that `editorConfig` will not work without `simpleEditor: false`
* compiler now exports compiler function as default
* isCodeVueSfc, styleScoper and adaptCreateElement
 are now their own package



## [3.26.2](https://github.com/vue-styleguidist/vue-styleguidist/compare/v3.26.1...v3.26.2) (2019-10-30)


### Bug Fixes

* move the build files to the right folder ([9944972](https://github.com/vue-styleguidist/vue-styleguidist/commit/9944972)), closes [#615](https://github.com/vue-styleguidist/vue-styleguidist/issues/615)
* make sure defaults are there for the plugin ([eb9ef4c](https://github.com/vue-styleguidist/vue-styleguidist/commit/eb9ef4c)), closes [#615](https://github.com/vue-styleguidist/vue-styleguidist/issues/615)
* make sure defaults are there for the plugin ([00a05ac](https://github.com/vue-styleguidist/vue-styleguidist/commit/00a05ac)), closes [#615](https://github.com/vue-styleguidist/vue-styleguidist/issues/615)










## [3.26.1](https://github.com/vue-styleguidist/vue-styleguidist/compare/v3.26.0...v3.26.1) (2019-10-30)


### Bug Fixes

* passing a webpackConfig should prioitize ([683f3dc](https://github.com/vue-styleguidist/vue-styleguidist/commit/683f3dc))
* split compiler & utils - efficient code split ([9ef9d06](https://github.com/vue-styleguidist/vue-styleguidist/commit/9ef9d06))
* **docgen:** make docgen output arrays only ([d456c6c](https://github.com/vue-styleguidist/vue-styleguidist/commit/d456c6c))


### Code Refactoring

* **docgen:** make function docgen.parse async ([e17680b](https://github.com/vue-styleguidist/vue-styleguidist/commit/e17680b))
* **docgen:** make required always a boolean ([03bc88e](https://github.com/vue-styleguidist/vue-styleguidist/commit/03bc88e))


### Features

* change defaults for codeSplit & simpleEditor ([810bf1c](https://github.com/vue-styleguidist/vue-styleguidist/commit/810bf1c))


### BREAKING CHANGES

* **docgen:** props, events, methods and slots are now all arrays

Co-authored-by: Sébastien D. <demsking@gmail.com>
* **docgen:** required for props is never a string anymore
* **docgen:** docgen becomes async, so do all of the handlers
* change defaults for `simpleEditor` mean that `editorConfig` will not work without `simpleEditor: false`
* compiler now exports compiler function as default
* isCodeVueSfc, styleScoper and adaptCreateElement
 are now their own package
* move the build files to the right folder ([3b5aea1](https://github.com/vue-styleguidist/vue-styleguidist/commit/3b5aea1)), closes [#615](https://github.com/vue-styleguidist/vue-styleguidist/issues/615)





# [3.26.0](https://github.com/vue-styleguidist/vue-styleguidist/compare/v3.25.0...v3.26.0) (2019-10-25)


### Bug Fixes

* **docgen:** allow for multiple times the same tag ([68a0204](https://github.com/vue-styleguidist/vue-styleguidist/commit/68a0204))
* tag class for JsDoc tag values ([38fdd46](https://github.com/vue-styleguidist/vue-styleguidist/commit/38fdd46))


### Features

* readable css class for JsDoc results ([a56f341](https://github.com/vue-styleguidist/vue-styleguidist/commit/a56f341)), closes [#602](https://github.com/vue-styleguidist/vue-styleguidist/issues/602)
* use the functional tag in docgen cli ([c6f8725](https://github.com/vue-styleguidist/vue-styleguidist/commit/c6f8725))





# [3.25.0](https://github.com/vue-styleguidist/vue-styleguidist/compare/v3.24.2...v3.25.0) (2019-10-15)


### Features

* **docgen:** add origin to documentation object ([31e2fe2](https://github.com/vue-styleguidist/vue-styleguidist/commit/31e2fe2)), closes [#594](https://github.com/vue-styleguidist/vue-styleguidist/issues/594)
* **docgen:** allow wrap export in if ([5744801](https://github.com/vue-styleguidist/vue-styleguidist/commit/5744801))
* add sponsor button ([59c7731](https://github.com/vue-styleguidist/vue-styleguidist/commit/59c7731))





## [3.24.2](https://github.com/vue-styleguidist/vue-styleguidist/compare/v3.24.1...v3.24.2) (2019-09-26)


### Bug Fixes

* **docgen:** detetct scopedSlots in render() ([5e7015d](https://github.com/vue-styleguidist/vue-styleguidist/commit/5e7015d)), closes [#586](https://github.com/vue-styleguidist/vue-styleguidist/issues/586)





## [3.24.1](https://github.com/vue-styleguidist/vue-styleguidist/compare/v3.24.0...v3.24.1) (2019-09-26)


### Bug Fixes

* **docgen:** allow default to be a method ([40ec2ae](https://github.com/vue-styleguidist/vue-styleguidist/commit/40ec2ae))





# [3.24.0](https://github.com/vue-styleguidist/vue-styleguidist/compare/v3.23.2...v3.24.0) (2019-09-25)


### Features

* vue-docgen-cli if getDestFile should not create md file ([55da63e](https://github.com/vue-styleguidist/vue-styleguidist/commit/55da63e))





## [3.23.2](https://github.com/vue-styleguidist/vue-styleguidist/compare/v3.23.1...v3.23.2) (2019-09-24)


### Bug Fixes

* add .vue to extension array in webpack config ([65da41b](https://github.com/vue-styleguidist/vue-styleguidist/commit/65da41b))





## [3.23.1](https://github.com/vue-styleguidist/vue-styleguidist/compare/v3.23.0...v3.23.1) (2019-09-20)


### Bug Fixes

* **docgen:** allow default to be a string key ([1fa756f](https://github.com/vue-styleguidist/vue-styleguidist/commit/1fa756f)), closes [#581](https://github.com/vue-styleguidist/vue-styleguidist/issues/581)
* extend quoting to methods and props ([10e2b3e](https://github.com/vue-styleguidist/vue-styleguidist/commit/10e2b3e))





# [3.23.0](https://github.com/vue-styleguidist/vue-styleguidist/compare/v3.22.3...v3.23.0) (2019-09-19)


### Features

* **compiler:** styleScoper deals with deep ([ff89890](https://github.com/vue-styleguidist/vue-styleguidist/commit/ff89890))





## [3.22.3](https://github.com/vue-styleguidist/vue-styleguidist/compare/v3.22.2...v3.22.3) (2019-09-12)


### Bug Fixes

* look at statements for description ([71969bf](https://github.com/vue-styleguidist/vue-styleguidist/commit/71969bf))





## [3.22.2](https://github.com/vue-styleguidist/vue-styleguidist/compare/v3.22.1...v3.22.2) (2019-08-24)


### Bug Fixes

* Fix bad links to docs ([a5a8978](https://github.com/vue-styleguidist/vue-styleguidist/commit/a5a8978))





## [3.22.1](https://github.com/vue-styleguidist/vue-styleguidist/compare/v3.22.0...v3.22.1) (2019-08-19)


### Bug Fixes

* **cli:** take cwd param into account ([7935956](https://github.com/vue-styleguidist/vue-styleguidist/commit/7935956))
* **compiler:** avoid conflict, rollup buble+acorn ([8c6d23a](https://github.com/vue-styleguidist/vue-styleguidist/commit/8c6d23a))
* if cwd is specified in cmd use to find config ([2bf97a1](https://github.com/vue-styleguidist/vue-styleguidist/commit/2bf97a1))





# [3.22.0](https://github.com/vue-styleguidist/vue-styleguidist/compare/v3.21.0...v3.22.0) (2019-08-19)


### Bug Fixes

* update react styleguidist to fix menu ([00ec66a](https://github.com/vue-styleguidist/vue-styleguidist/commit/00ec66a)), closes [#561](https://github.com/vue-styleguidist/vue-styleguidist/issues/561)
* update react styleguidist to fix menu (2) ([dba9fbf](https://github.com/vue-styleguidist/vue-styleguidist/commit/dba9fbf)), closes [#561](https://github.com/vue-styleguidist/vue-styleguidist/issues/561)


### Features

* **docgen:** class event [@emit](https://github.com/emit) ([4483168](https://github.com/vue-styleguidist/vue-styleguidist/commit/4483168)), closes [#305](https://github.com/vue-styleguidist/vue-styleguidist/issues/305)





# [3.21.0](https://github.com/vue-styleguidist/vue-styleguidist/compare/v3.20.5...v3.21.0) (2019-08-17)


### Features

* add defaultExamples config ([52d7d90](https://github.com/vue-styleguidist/vue-styleguidist/commit/52d7d90))





## [3.20.5](https://github.com/vue-styleguidist/vue-styleguidist/compare/v3.20.4...v3.20.5) (2019-08-16)

**Note:** Version bump only for package vue-styleguidist





## [3.20.4](https://github.com/vue-styleguidist/vue-styleguidist/compare/v3.20.3...v3.20.4) (2019-08-12)


### Bug Fixes

* watcher looking at md files ([536157d](https://github.com/vue-styleguidist/vue-styleguidist/commit/536157d))





## [3.20.3](https://github.com/vue-styleguidist/vue-styleguidist/compare/v3.20.2...v3.20.3) (2019-08-12)


### Bug Fixes

* watch when input md changes ([54ff5ac](https://github.com/vue-styleguidist/vue-styleguidist/commit/54ff5ac))





## [3.20.2](https://github.com/vue-styleguidist/vue-styleguidist/compare/v3.20.1...v3.20.2) (2019-08-11)


### Bug Fixes

* pages infinite lioop ([9e5acad](https://github.com/vue-styleguidist/vue-styleguidist/commit/9e5acad))





## [3.20.1](https://github.com/vue-styleguidist/vue-styleguidist/compare/v3.20.0...v3.20.1) (2019-08-10)


### Bug Fixes

* avoid defaulting outDir if outFile ([8a2a282](https://github.com/vue-styleguidist/vue-styleguidist/commit/8a2a282))
* avoid the squiggles in main menu ([5cc8f93](https://github.com/vue-styleguidist/vue-styleguidist/commit/5cc8f93))
* protect pipe character in templates ([0a0befc](https://github.com/vue-styleguidist/vue-styleguidist/commit/0a0befc))


### Performance Improvements

* cache compiled md in single file mode ([b867235](https://github.com/vue-styleguidist/vue-styleguidist/commit/b867235))





# [3.20.0](https://github.com/vue-styleguidist/vue-styleguidist/compare/v3.19.5...v3.20.0) (2019-08-10)


### Bug Fixes

* update react-styleguidist ([e820c12](https://github.com/vue-styleguidist/vue-styleguidist/commit/e820c12)), closes [#492](https://github.com/vue-styleguidist/vue-styleguidist/issues/492) [#199](https://github.com/vue-styleguidist/vue-styleguidist/issues/199)


### Features

* **docgen:** expose docs block in dogen-api ([4565559](https://github.com/vue-styleguidist/vue-styleguidist/commit/4565559))
* vue-docgen CLI to generate markdown files ([b05d7d3](https://github.com/vue-styleguidist/vue-styleguidist/commit/b05d7d3))





## [3.19.5](https://github.com/vue-styleguidist/vue-styleguidist/compare/v3.19.4...v3.19.5) (2019-08-07)


### Bug Fixes

* EditorWithToolbar naming case ([595a077](https://github.com/vue-styleguidist/vue-styleguidist/commit/595a077))


### Performance Improvements

* only precompile example for prod ([b7aeb58](https://github.com/vue-styleguidist/vue-styleguidist/commit/b7aeb58))





## [3.19.4](https://github.com/vue-styleguidist/vue-styleguidist/compare/v3.19.3...v3.19.4) (2019-08-06)


### Bug Fixes

* webpack dependency for yarn + storybook ([e4c5d2e](https://github.com/vue-styleguidist/vue-styleguidist/commit/e4c5d2e))





## [3.19.3](https://github.com/vue-styleguidist/vue-styleguidist/compare/v3.19.2...v3.19.3) (2019-08-06)


### Bug Fixes

* add webpack peerDependency ([16b1fa7](https://github.com/vue-styleguidist/vue-styleguidist/commit/16b1fa7))


### Performance Improvements

* remove multiple dependencies ([0927e85](https://github.com/vue-styleguidist/vue-styleguidist/commit/0927e85))





## [3.19.2](https://github.com/vue-styleguidist/vue-styleguidist/compare/v3.19.1...v3.19.2) (2019-08-05)


### Bug Fixes

* avoid dependency to webpack ([63ee996](https://github.com/vue-styleguidist/vue-styleguidist/commit/63ee996))





## [3.19.1](https://github.com/vue-styleguidist/vue-styleguidist/compare/v3.19.0...v3.19.1) (2019-08-04)


### Bug Fixes

* <docs src=> should not look at script tag ([2cef0d4](https://github.com/vue-styleguidist/vue-styleguidist/commit/2cef0d4))
* avoid hmr loop in plugin usage ([c6e4adf](https://github.com/vue-styleguidist/vue-styleguidist/commit/c6e4adf))





# [3.19.0](https://github.com/vue-styleguidist/vue-styleguidist/compare/v3.18.1...v3.19.0) (2019-08-02)


### Bug Fixes

* combining new Vue and imports was impossible ([d37359c](https://github.com/vue-styleguidist/vue-styleguidist/commit/d37359c))
* default example only appear when no doc ([b3b4156](https://github.com/vue-styleguidist/vue-styleguidist/commit/b3b4156))
* webpackConfig has priority on publicPath ([a06c1c6](https://github.com/vue-styleguidist/vue-styleguidist/commit/a06c1c6)), closes [#529](https://github.com/vue-styleguidist/vue-styleguidist/issues/529)
* wrong propTypes for playgroundAsync ([3fffa13](https://github.com/vue-styleguidist/vue-styleguidist/commit/3fffa13))


### Features

* allow import syntax ([5c61678](https://github.com/vue-styleguidist/vue-styleguidist/commit/5c61678)), closes [#104](https://github.com/vue-styleguidist/vue-styleguidist/issues/104)





## [3.18.1](https://github.com/vue-styleguidist/vue-styleguidist/compare/v3.18.0...v3.18.1) (2019-07-30)


### Bug Fixes

* editor should update when changing page ([35d0c3f](https://github.com/vue-styleguidist/vue-styleguidist/commit/35d0c3f))





# [3.18.0](https://github.com/vue-styleguidist/vue-styleguidist/compare/v3.17.2...v3.18.0) (2019-07-28)


### Bug Fixes

* async conlict with routing ([75424f7](https://github.com/vue-styleguidist/vue-styleguidist/commit/75424f7))
* better PropTypes for PlaygroundAsync ([3b60e3e](https://github.com/vue-styleguidist/vue-styleguidist/commit/3b60e3e))


### Features

* add copyCodeButton option ([90767af](https://github.com/vue-styleguidist/vue-styleguidist/commit/90767af))





## [3.17.2](https://github.com/vue-styleguidist/vue-styleguidist/compare/v3.17.1...v3.17.2) (2019-07-26)


### Bug Fixes

* make codeSplit comptible with jsxInExamples ([83c0bf6](https://github.com/vue-styleguidist/vue-styleguidist/commit/83c0bf6))





## [3.17.1](https://github.com/vue-styleguidist/vue-styleguidist/compare/v3.17.0...v3.17.1) (2019-07-26)


### Bug Fixes

* precompile examples when codeSplit ([d75f3f4](https://github.com/vue-styleguidist/vue-styleguidist/commit/d75f3f4))
* remove the propTypes error in codeSplit ([ea53a14](https://github.com/vue-styleguidist/vue-styleguidist/commit/ea53a14))


### Features

* avoid skipping comps documented inline ([6ee0dff](https://github.com/vue-styleguidist/vue-styleguidist/commit/6ee0dff))





# [3.17.0](https://github.com/vue-styleguidist/vue-styleguidist/compare/v3.16.3...v3.17.0) (2019-07-23)


### Bug Fixes

* make sure code split works with prism ([51e7660](https://github.com/vue-styleguidist/vue-styleguidist/commit/51e7660))
* **docgen:** allow document scopedSlots in render ([31a7e07](https://github.com/vue-styleguidist/vue-styleguidist/commit/31a7e07)), closes [#174](https://github.com/vue-styleguidist/vue-styleguidist/issues/174)
* **plugin:** custom webpack config ([2cf491c](https://github.com/vue-styleguidist/vue-styleguidist/commit/2cf491c))


### Features

* add codeSplit option for compiler ([286e2ee](https://github.com/vue-styleguidist/vue-styleguidist/commit/286e2ee))
* when codeSplit lazy load codemirror editor ([6f83989](https://github.com/vue-styleguidist/vue-styleguidist/commit/6f83989))





## [3.16.3](https://github.com/vue-styleguidist/vue-styleguidist/compare/v3.16.2...v3.16.3) (2019-07-19)


### Bug Fixes

*  evaluation was failing ([467949f](https://github.com/vue-styleguidist/vue-styleguidist/commit/467949f))
* accept multiple style parts ([9a6b031](https://github.com/vue-styleguidist/vue-styleguidist/commit/9a6b031))
* slot scoped parsing ([9685ba2](https://github.com/vue-styleguidist/vue-styleguidist/commit/9685ba2))
* use style normalize sfc component ([fcae13c](https://github.com/vue-styleguidist/vue-styleguidist/commit/fcae13c))


### Performance Improvements

* create new simpler parser ([d8acf85](https://github.com/vue-styleguidist/vue-styleguidist/commit/d8acf85))
* use the new parser ([385b018](https://github.com/vue-styleguidist/vue-styleguidist/commit/385b018))





## [3.16.2](https://github.com/vue-styleguidist/vue-styleguidist/compare/v3.16.1...v3.16.2) (2019-07-17)


### Bug Fixes

* **compiler:** make the jsx spread work vue style ([27dd670](https://github.com/vue-styleguidist/vue-styleguidist/commit/27dd670))
* make regexp more precise ([29ba8b5](https://github.com/vue-styleguidist/vue-styleguidist/commit/29ba8b5))
* use the spread in styleguidist ([fd464a8](https://github.com/vue-styleguidist/vue-styleguidist/commit/fd464a8))


### Performance Improvements

* avoid loading pragma without jsx ([5b5012b](https://github.com/vue-styleguidist/vue-styleguidist/commit/5b5012b))





## [3.16.1](https://github.com/vue-styleguidist/vue-styleguidist/compare/v3.16.0...v3.16.1) (2019-07-16)


### Bug Fixes

* **compiler:** add normal attributes in attrs ([be6de16](https://github.com/vue-styleguidist/vue-styleguidist/commit/be6de16))
* allow for new Vue in jsx ([45c62c9](https://github.com/vue-styleguidist/vue-styleguidist/commit/45c62c9))





# [3.16.0](https://github.com/vue-styleguidist/vue-styleguidist/compare/v3.15.4...v3.16.0) (2019-07-15)


### Bug Fixes

* **docgen:** allow for v-model in functional components ([8884e62](https://github.com/vue-styleguidist/vue-styleguidist/commit/8884e62)), closes [#493](https://github.com/vue-styleguidist/vue-styleguidist/issues/493)
* bump clipboard-copy version ([b3c86d9](https://github.com/vue-styleguidist/vue-styleguidist/commit/b3c86d9)), closes [#500](https://github.com/vue-styleguidist/vue-styleguidist/issues/500)
* rename createElement ([429dd96](https://github.com/vue-styleguidist/vue-styleguidist/commit/429dd96))


### Features

* add Higher order funciton to Compile pragmas ([5783eb4](https://github.com/vue-styleguidist/vue-styleguidist/commit/5783eb4))
* allow compiler to render/compile JSX ([5084a39](https://github.com/vue-styleguidist/vue-styleguidist/commit/5084a39))
* use styleguidePublicPath in server ([bd5e3ec](https://github.com/vue-styleguidist/vue-styleguidist/commit/bd5e3ec))
* use the JSX capabilities of compiler ([a6db6cb](https://github.com/vue-styleguidist/vue-styleguidist/commit/a6db6cb))





## [3.15.4](https://github.com/vue-styleguidist/vue-styleguidist/compare/v3.15.3...v3.15.4) (2019-07-07)


### Bug Fixes

* allow importing non component files ([5aa59a6](https://github.com/vue-styleguidist/vue-styleguidist/commit/5aa59a6)), closes [#436](https://github.com/vue-styleguidist/vue-styleguidist/issues/436)
* transform error into warning when NOENT ([296e1cd](https://github.com/vue-styleguidist/vue-styleguidist/commit/296e1cd))
* **docgen:** avoid parse files that are'nt potential components ([4b1e43b](https://github.com/vue-styleguidist/vue-styleguidist/commit/4b1e43b)), closes [#436](https://github.com/vue-styleguidist/vue-styleguidist/issues/436)
* **docgen:** resolve es6 modules properly ([1b4eb0a](https://github.com/vue-styleguidist/vue-styleguidist/commit/1b4eb0a)), closes [#478](https://github.com/vue-styleguidist/vue-styleguidist/issues/478)





## [3.15.3](https://github.com/vue-styleguidist/vue-styleguidist/compare/v3.15.2...v3.15.3) (2019-07-02)


### Bug Fixes

* **codemirror:** allow for mulitple words in cm themes ([6168883](https://github.com/vue-styleguidist/vue-styleguidist/commit/6168883)), closes [#480](https://github.com/vue-styleguidist/vue-styleguidist/issues/480)
* **docgen:** make aliases only path parts instead of letters ([b83e235](https://github.com/vue-styleguidist/vue-styleguidist/commit/b83e235)), closes [#478](https://github.com/vue-styleguidist/vue-styleguidist/issues/478)





## [3.15.2](https://github.com/vue-styleguidist/vue-styleguidist/compare/v3.15.1...v3.15.2) (2019-07-02)


### Bug Fixes

* add simple bindings detection ([31a3fca](https://github.com/vue-styleguidist/vue-styleguidist/commit/31a3fca))
* make (Vue as VueConstructor<Vue>) resolved ([b7ed624](https://github.com/vue-styleguidist/vue-styleguidist/commit/b7ed624))
* render default value empty string ([f41869d](https://github.com/vue-styleguidist/vue-styleguidist/commit/f41869d))
* **docgen:** adapt method handler to default params ([4f67f4e](https://github.com/vue-styleguidist/vue-styleguidist/commit/4f67f4e)), closes [#476](https://github.com/vue-styleguidist/vue-styleguidist/issues/476)
* **docgen:** make v-bind have a separate treatment ([cee2a9b](https://github.com/vue-styleguidist/vue-styleguidist/commit/cee2a9b)), closes [#469](https://github.com/vue-styleguidist/vue-styleguidist/issues/469)





## [3.15.1](https://github.com/vue-styleguidist/vue-styleguidist/compare/v3.15.0...v3.15.1) (2019-06-27)


### Bug Fixes

* make sure imported variables are declared ([bc50ab1](https://github.com/vue-styleguidist/vue-styleguidist/commit/bc50ab1))
* **compiler:** make sure files with the same name wont conflict ([98a1b76](https://github.com/vue-styleguidist/vue-styleguidist/commit/98a1b76)), closes [#471](https://github.com/vue-styleguidist/vue-styleguidist/issues/471)





# [3.15.0](https://github.com/vue-styleguidist/vue-styleguidist/compare/v3.14.5...v3.15.0) (2019-06-19)


### Bug Fixes

* **docgen:** fix template parsing expressions ([56a2e05](https://github.com/vue-styleguidist/vue-styleguidist/commit/56a2e05))


### Features

* **docgen:** add external proptypes parsing for docgen ([eaa4748](https://github.com/vue-styleguidist/vue-styleguidist/commit/eaa4748)), closes [#465](https://github.com/vue-styleguidist/vue-styleguidist/issues/465)
* **docgen:** support ts prop types ([c57c243](https://github.com/vue-styleguidist/vue-styleguidist/commit/c57c243)), closes [#413](https://github.com/vue-styleguidist/vue-styleguidist/issues/413)





## [3.14.5](https://github.com/vue-styleguidist/vue-styleguidist/compare/v3.14.4...v3.14.5) (2019-06-14)


### Bug Fixes

* **docgen:** fixed multiple use of same event needing desc ([329f66a](https://github.com/vue-styleguidist/vue-styleguidist/commit/329f66a)), closes [#459](https://github.com/vue-styleguidist/vue-styleguidist/issues/459)





## [3.14.4](https://github.com/vue-styleguidist/vue-styleguidist/compare/v3.14.3...v3.14.4) (2019-06-14)


### Bug Fixes

* update dependencies to re-enable HMR ([860e3bc](https://github.com/vue-styleguidist/vue-styleguidist/commit/860e3bc))
* **compiler:** re-enable compilation in vue SFC ([5bb99c3](https://github.com/vue-styleguidist/vue-styleguidist/commit/5bb99c3)), closes [#456](https://github.com/vue-styleguidist/vue-styleguidist/issues/456)
* **docgen:** get slot and scoped slot description in render without JSX ([33086cf](https://github.com/vue-styleguidist/vue-styleguidist/commit/33086cf))





## [3.14.3](https://github.com/vue-styleguidist/vue-styleguidist/compare/v3.14.2...v3.14.3) (2019-06-10)


### Bug Fixes

* reorder aliases to allow Styleguide overrides ([9195772](https://github.com/vue-styleguidist/vue-styleguidist/commit/9195772))





## [3.14.2](https://github.com/vue-styleguidist/vue-styleguidist/compare/v3.14.1...v3.14.2) (2019-06-06)


### Bug Fixes

* **docgen:** make sure v-slot templates are understood too ([e9ab6d5](https://github.com/vue-styleguidist/vue-styleguidist/commit/e9ab6d5))





## [3.14.1](https://github.com/vue-styleguidist/vue-styleguidist/compare/v3.14.0...v3.14.1) (2019-06-05)


### Bug Fixes

* **docgen:** template was used to use slots - sfc was detected ([642d875](https://github.com/vue-styleguidist/vue-styleguidist/commit/642d875)), closes [#448](https://github.com/vue-styleguidist/vue-styleguidist/issues/448)





# [3.14.0](https://github.com/vue-styleguidist/vue-styleguidist/compare/v3.13.10...v3.14.0) (2019-06-05)


### Bug Fixes

* bring back last version of acorn ([1f7ee42](https://github.com/vue-styleguidist/vue-styleguidist/commit/1f7ee42))


### Features

* add minimize options ([93ad5d3](https://github.com/vue-styleguidist/vue-styleguidist/commit/93ad5d3))





## [3.13.10](https://github.com/vue-styleguidist/vue-styleguidist/compare/v3.13.9...v3.13.10) (2019-06-04)


### Bug Fixes

* detect pure template no script as sfc ([e2a0a48](https://github.com/vue-styleguidist/vue-styleguidist/commit/e2a0a48))
* downgrade acorn ([40b60cb](https://github.com/vue-styleguidist/vue-styleguidist/commit/40b60cb))
* re-use the react hmr plugin ([2dfc5ad](https://github.com/vue-styleguidist/vue-styleguidist/commit/2dfc5ad))





## [3.13.9](https://github.com/vue-styleguidist/vue-styleguidist/compare/v3.13.8...v3.13.9) (2019-05-29)


### Bug Fixes

* **preview:** fix style scope mismatch ([830abf8](https://github.com/vue-styleguidist/vue-styleguidist/commit/830abf8)), closes [#437](https://github.com/vue-styleguidist/vue-styleguidist/issues/437)
* **preview:** gracefully fail when Vue breaks ([1152600](https://github.com/vue-styleguidist/vue-styleguidist/commit/1152600)), closes [#435](https://github.com/vue-styleguidist/vue-styleguidist/issues/435)





## [3.13.8](https://github.com/vue-styleguidist/vue-styleguidist/compare/v3.13.7...v3.13.8) (2019-05-29)


### Bug Fixes

* remove useless ignores ([043e4cc](https://github.com/vue-styleguidist/vue-styleguidist/commit/043e4cc))
* **editor:** make sure when url changes editor is repainted ([2dcbaac](https://github.com/vue-styleguidist/vue-styleguidist/commit/2dcbaac)), closes [#404](https://github.com/vue-styleguidist/vue-styleguidist/issues/404)





## [3.13.7](https://github.com/vue-styleguidist/vue-styleguidist/compare/v3.13.6...v3.13.7) (2019-05-24)


### Bug Fixes

* make hidden components work again ([4898fee](https://github.com/vue-styleguidist/vue-styleguidist/commit/4898fee))





## [3.13.6](https://github.com/vue-styleguidist/vue-styleguidist/compare/v3.13.5...v3.13.6) (2019-05-23)


### Bug Fixes

* **core:** example loader needs to require only on the script ([0c045df](https://github.com/vue-styleguidist/vue-styleguidist/commit/0c045df)), closes [#421](https://github.com/vue-styleguidist/vue-styleguidist/issues/421)





## [3.13.5](https://github.com/vue-styleguidist/vue-styleguidist/compare/v3.13.4...v3.13.5) (2019-05-22)


### Bug Fixes

* Additionally try absolute require.resolve in resolvePathFrom ([d1be583](https://github.com/vue-styleguidist/vue-styleguidist/commit/d1be583))
* Look through all roots. ([3641e4c](https://github.com/vue-styleguidist/vue-styleguidist/commit/3641e4c))
* **core:** remove self require in readme ([b6408af](https://github.com/vue-styleguidist/vue-styleguidist/commit/b6408af)), closes [#407](https://github.com/vue-styleguidist/vue-styleguidist/issues/407)





## [3.13.4](https://github.com/vue-styleguidist/vue-styleguidist/compare/v3.13.3...v3.13.4) (2019-05-15)


### Bug Fixes

* **docgen:** fix node_modules mixins parsing ([a4eed84](https://github.com/vue-styleguidist/vue-styleguidist/commit/a4eed84)), closes [#416](https://github.com/vue-styleguidist/vue-styleguidist/issues/416)
* make sure node_module resolved path ignored ([7a1092a](https://github.com/vue-styleguidist/vue-styleguidist/commit/7a1092a))





## [3.13.3](https://github.com/vue-styleguidist/vue-styleguidist/compare/v3.13.2...v3.13.3) (2019-05-14)


### Bug Fixes

* register all cmpnts ins/f only first section ([4ae5390](https://github.com/vue-styleguidist/vue-styleguidist/commit/4ae5390)), closes [#405](https://github.com/vue-styleguidist/vue-styleguidist/issues/405)





## [3.13.2](https://github.com/vue-styleguidist/vue-styleguidist/compare/v3.13.1...v3.13.2) (2019-05-13)


### Bug Fixes

* **core:** fix Preview.js with pure md files ([d52feea](https://github.com/vue-styleguidist/vue-styleguidist/commit/d52feea)), closes [#411](https://github.com/vue-styleguidist/vue-styleguidist/issues/411)





## [3.13.1](https://github.com/vue-styleguidist/vue-styleguidist/compare/v3.13.0...v3.13.1) (2019-04-29)


### Bug Fixes

* cleanComponentName peace with babel 7 ([bd8a085](https://github.com/vue-styleguidist/vue-styleguidist/commit/bd8a085))
* transform import was not working properly ([a6df22b](https://github.com/vue-styleguidist/vue-styleguidist/commit/a6df22b))





# [3.13.0](https://github.com/vue-styleguidist/vue-styleguidist/compare/v3.12.0...v3.13.0) (2019-04-28)


### Features

* allow components to be registered only locally ([#398](https://github.com/vue-styleguidist/vue-styleguidist/issues/398)) ([1dd2f1d](https://github.com/vue-styleguidist/vue-styleguidist/commit/1dd2f1d)), closes [#2](https://github.com/vue-styleguidist/vue-styleguidist/issues/2)





# [3.12.0](https://github.com/vue-styleguidist/vue-styleguidist/compare/v3.11.7...v3.12.0) (2019-04-25)


### Bug Fixes

* **docgen:** allow for not parsing jsx ([8b669f3](https://github.com/vue-styleguidist/vue-styleguidist/commit/8b669f3))
* **docgen:** give better error message lines ([9b04cc4](https://github.com/vue-styleguidist/vue-styleguidist/commit/9b04cc4))


### Features

* **docgen:** add jsx option to docgen ([0ce2a9e](https://github.com/vue-styleguidist/vue-styleguidist/commit/0ce2a9e))
* **main:** add jsxInComponents option ([27b4257](https://github.com/vue-styleguidist/vue-styleguidist/commit/27b4257))
* **plugin:** reference jsxInComponents in vueui ([a9646ef](https://github.com/vue-styleguidist/vue-styleguidist/commit/a9646ef))





## [3.11.7](https://github.com/vue-styleguidist/vue-styleguidist/compare/v3.11.6...v3.11.7) (2019-04-23)


### Bug Fixes

* keep dashes in component names ([3ec75ed](https://github.com/vue-styleguidist/vue-styleguidist/commit/3ec75ed)), closes [#391](https://github.com/vue-styleguidist/vue-styleguidist/issues/391)
* make sure we detect all variables ([118f1a8](https://github.com/vue-styleguidist/vue-styleguidist/commit/118f1a8))
* parse es6 imports with vsg format ([8f5ff19](https://github.com/vue-styleguidist/vue-styleguidist/commit/8f5ff19))
* remove getVars blocking imports ([1066123](https://github.com/vue-styleguidist/vue-styleguidist/commit/1066123))





## [3.11.6](https://github.com/vue-styleguidist/vue-styleguidist/compare/v3.11.5...v3.11.6) (2019-04-23)


### Bug Fixes

* ignored errors ([#177](https://github.com/vue-styleguidist/vue-styleguidist/issues/177)) ([#316](https://github.com/vue-styleguidist/vue-styleguidist/issues/316)) ([298f462](https://github.com/vue-styleguidist/vue-styleguidist/commit/298f462))
* make [@arg](https://github.com/arg) and [@argument](https://github.com/argument) accepted ([1b0ddca](https://github.com/vue-styleguidist/vue-styleguidist/commit/1b0ddca))
* **docgen:** update method for unpassing tests ([4f5c6cd](https://github.com/vue-styleguidist/vue-styleguidist/commit/4f5c6cd))





## [3.11.5](https://github.com/vue-styleguidist/vue-styleguidist/compare/v3.11.4...v3.11.5) (2019-04-20)

**Note:** Version bump only for package vue-styleguidist





## [3.11.4](https://github.com/vue-styleguidist/vue-styleguidist/compare/v3.11.3...v3.11.4) (2019-04-03)


### Bug Fixes

* add vue-class-component management ([#371](https://github.com/vue-styleguidist/vue-styleguidist/issues/371)) ([d1aced1](https://github.com/vue-styleguidist/vue-styleguidist/commit/d1aced1))





## [3.11.3](https://github.com/vue-styleguidist/vue-styleguidist/compare/v3.11.2...v3.11.3) (2019-04-01)


### Bug Fixes

* **docgen:** protect uresolved events ([09d970f](https://github.com/vue-styleguidist/vue-styleguidist/commit/09d970f)), closes [#363](https://github.com/vue-styleguidist/vue-styleguidist/issues/363)
* **options:** allow two words in displayName ([7b72603](https://github.com/vue-styleguidist/vue-styleguidist/commit/7b72603))
* **plugin:** add the whole package to eslintignore ([3b13ccf](https://github.com/vue-styleguidist/vue-styleguidist/commit/3b13ccf))
* **plugin:** issue with babel ([afbf21a](https://github.com/vue-styleguidist/vue-styleguidist/commit/afbf21a))
* **safety:** update css-loader ([0b074b8](https://github.com/vue-styleguidist/vue-styleguidist/commit/0b074b8))





## [3.11.2](https://github.com/vue-styleguidist/vue-styleguidist/compare/v3.11.1...v3.11.2) (2019-03-28)

**Note:** Version bump only for package vue-styleguidist





## [3.11.1](https://github.com/vue-styleguidist/vue-styleguidist/compare/v3.11.0...v3.11.1) (2019-03-28)


### Bug Fixes

* **docgen:** make displayName tag work ([#358](https://github.com/vue-styleguidist/vue-styleguidist/issues/358)) ([c3e12ce](https://github.com/vue-styleguidist/vue-styleguidist/commit/c3e12ce)), closes [#357](https://github.com/vue-styleguidist/vue-styleguidist/issues/357)





# [3.11.0](https://github.com/vue-styleguidist/vue-styleguidist/compare/v3.10.2...v3.11.0) (2019-03-26)


### Features

* **core:** update react styleguidist to 9.0.4 ([#344](https://github.com/vue-styleguidist/vue-styleguidist/issues/344)) ([1ec6e64](https://github.com/vue-styleguidist/vue-styleguidist/commit/1ec6e64))





## [3.10.2](https://github.com/vue-styleguidist/vue-styleguidist/compare/v3.10.1...v3.10.2) (2019-03-22)


### Bug Fixes

* **plugin/ui:** mountPointId link was wrong ([#348](https://github.com/vue-styleguidist/vue-styleguidist/issues/348)) ([5d79ebb](https://github.com/vue-styleguidist/vue-styleguidist/commit/5d79ebb))


### Performance Improvements

* **esprima:** get rid of esprima heavy loader ([#347](https://github.com/vue-styleguidist/vue-styleguidist/issues/347)) ([552ba14](https://github.com/vue-styleguidist/vue-styleguidist/commit/552ba14))
