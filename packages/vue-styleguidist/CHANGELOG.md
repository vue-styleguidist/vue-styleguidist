# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [3.19.2](https://github.com/vue-styleguidist/vue-styleguidist/compare/v3.19.1...v3.19.2) (2019-08-05)


### Bug Fixes

* avoid dependency to webpack ([63ee996](https://github.com/vue-styleguidist/vue-styleguidist/commit/63ee996))





## [3.19.1](https://github.com/vue-styleguidist/vue-styleguidist/compare/v3.19.0...v3.19.1) (2019-08-04)


### Bug Fixes

* <docs src=> should not look at script tag ([2cef0d4](https://github.com/vue-styleguidist/vue-styleguidist/commit/2cef0d4))
* avoid hmr loop in plugin usage ([c6e4adf](https://github.com/vue-styleguidist/vue-styleguidist/commit/c6e4adf))





# [3.19.0](https://github.com/vue-styleguidist/vue-styleguidist/compare/v3.18.1...v3.19.0) (2019-08-02)


### Bug Fixes

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





# [3.17.0](https://github.com/vue-styleguidist/vue-styleguidist/compare/v3.16.3...v3.17.0) (2019-07-23)


### Bug Fixes

* make sure code split works with prism ([51e7660](https://github.com/vue-styleguidist/vue-styleguidist/commit/51e7660))


### Features

* add codeSplit option for compiler ([286e2ee](https://github.com/vue-styleguidist/vue-styleguidist/commit/286e2ee))
* when codeSplit lazy load codemirror editor ([6f83989](https://github.com/vue-styleguidist/vue-styleguidist/commit/6f83989))





## [3.16.3](https://github.com/vue-styleguidist/vue-styleguidist/compare/v3.16.2...v3.16.3) (2019-07-19)


### Bug Fixes

*  evaluation was failing ([467949f](https://github.com/vue-styleguidist/vue-styleguidist/commit/467949f))





## [3.16.2](https://github.com/vue-styleguidist/vue-styleguidist/compare/v3.16.1...v3.16.2) (2019-07-17)


### Bug Fixes

* use the spread in styleguidist ([fd464a8](https://github.com/vue-styleguidist/vue-styleguidist/commit/fd464a8))


### Performance Improvements

* avoid loading pragma without jsx ([5b5012b](https://github.com/vue-styleguidist/vue-styleguidist/commit/5b5012b))





## [3.16.1](https://github.com/vue-styleguidist/vue-styleguidist/compare/v3.16.0...v3.16.1) (2019-07-16)

**Note:** Version bump only for package vue-styleguidist





# [3.16.0](https://github.com/vue-styleguidist/vue-styleguidist/compare/v3.15.4...v3.16.0) (2019-07-15)


### Bug Fixes

* bump clipboard-copy version ([b3c86d9](https://github.com/vue-styleguidist/vue-styleguidist/commit/b3c86d9)), closes [#500](https://github.com/vue-styleguidist/vue-styleguidist/issues/500)
* rename createElement ([429dd96](https://github.com/vue-styleguidist/vue-styleguidist/commit/429dd96))


### Features

* use styleguidePublicPath in server ([bd5e3ec](https://github.com/vue-styleguidist/vue-styleguidist/commit/bd5e3ec))
* use the JSX capabilities of compiler ([a6db6cb](https://github.com/vue-styleguidist/vue-styleguidist/commit/a6db6cb))





## [3.15.4](https://github.com/vue-styleguidist/vue-styleguidist/compare/v3.15.3...v3.15.4) (2019-07-07)

**Note:** Version bump only for package vue-styleguidist





## [3.15.3](https://github.com/vue-styleguidist/vue-styleguidist/compare/v3.15.2...v3.15.3) (2019-07-02)


### Bug Fixes

* **codemirror:** allow for mulitple words in cm themes ([6168883](https://github.com/vue-styleguidist/vue-styleguidist/commit/6168883)), closes [#480](https://github.com/vue-styleguidist/vue-styleguidist/issues/480)





## [3.15.2](https://github.com/vue-styleguidist/vue-styleguidist/compare/v3.15.1...v3.15.2) (2019-07-02)


### Bug Fixes

* render default value empty string ([f41869d](https://github.com/vue-styleguidist/vue-styleguidist/commit/f41869d))





## [3.15.1](https://github.com/vue-styleguidist/vue-styleguidist/compare/v3.15.0...v3.15.1) (2019-06-27)

**Note:** Version bump only for package vue-styleguidist





# [3.15.0](https://github.com/vue-styleguidist/vue-styleguidist/compare/v3.14.5...v3.15.0) (2019-06-19)

**Note:** Version bump only for package vue-styleguidist





## [3.14.5](https://github.com/vue-styleguidist/vue-styleguidist/compare/v3.14.4...v3.14.5) (2019-06-14)

**Note:** Version bump only for package vue-styleguidist





## [3.14.4](https://github.com/vue-styleguidist/vue-styleguidist/compare/v3.14.3...v3.14.4) (2019-06-14)


### Bug Fixes

* update dependencies to re-enable HMR ([860e3bc](https://github.com/vue-styleguidist/vue-styleguidist/commit/860e3bc))





## [3.14.3](https://github.com/vue-styleguidist/vue-styleguidist/compare/v3.14.2...v3.14.3) (2019-06-10)


### Bug Fixes

* reorder aliases to allow Styleguide overrides ([9195772](https://github.com/vue-styleguidist/vue-styleguidist/commit/9195772))





## [3.14.2](https://github.com/vue-styleguidist/vue-styleguidist/compare/v3.14.1...v3.14.2) (2019-06-06)

**Note:** Version bump only for package vue-styleguidist





## [3.14.1](https://github.com/vue-styleguidist/vue-styleguidist/compare/v3.14.0...v3.14.1) (2019-06-05)

**Note:** Version bump only for package vue-styleguidist





# [3.14.0](https://github.com/vue-styleguidist/vue-styleguidist/compare/v3.13.10...v3.14.0) (2019-06-05)


### Features

* add minimize options ([93ad5d3](https://github.com/vue-styleguidist/vue-styleguidist/commit/93ad5d3))





## [3.13.10](https://github.com/vue-styleguidist/vue-styleguidist/compare/v3.13.9...v3.13.10) (2019-06-04)


### Bug Fixes

* re-use the react hmr plugin ([2dfc5ad](https://github.com/vue-styleguidist/vue-styleguidist/commit/2dfc5ad))





## [3.13.9](https://github.com/vue-styleguidist/vue-styleguidist/compare/v3.13.8...v3.13.9) (2019-05-29)


### Bug Fixes

* **preview:** fix style scope mismatch ([830abf8](https://github.com/vue-styleguidist/vue-styleguidist/commit/830abf8)), closes [#437](https://github.com/vue-styleguidist/vue-styleguidist/issues/437)
* **preview:** gracefully fail when Vue breaks ([1152600](https://github.com/vue-styleguidist/vue-styleguidist/commit/1152600)), closes [#435](https://github.com/vue-styleguidist/vue-styleguidist/issues/435)





## [3.13.8](https://github.com/vue-styleguidist/vue-styleguidist/compare/v3.13.7...v3.13.8) (2019-05-29)


### Bug Fixes

* **editor:** make sure when url changes editor is repainted ([2dcbaac](https://github.com/vue-styleguidist/vue-styleguidist/commit/2dcbaac)), closes [#404](https://github.com/vue-styleguidist/vue-styleguidist/issues/404)





## [3.13.7](https://github.com/vue-styleguidist/vue-styleguidist/compare/v3.13.6...v3.13.7) (2019-05-24)


### Bug Fixes

* make hidden components work again ([4898fee](https://github.com/vue-styleguidist/vue-styleguidist/commit/4898fee))





## [3.13.6](https://github.com/vue-styleguidist/vue-styleguidist/compare/v3.13.5...v3.13.6) (2019-05-23)


### Bug Fixes

* **core:** example loader needs to require only on the script ([0c045df](https://github.com/vue-styleguidist/vue-styleguidist/commit/0c045df)), closes [#421](https://github.com/vue-styleguidist/vue-styleguidist/issues/421)





## [3.13.5](https://github.com/vue-styleguidist/vue-styleguidist/compare/v3.13.4...v3.13.5) (2019-05-22)


### Bug Fixes

* **core:** remove self require in readme ([b6408af](https://github.com/vue-styleguidist/vue-styleguidist/commit/b6408af)), closes [#407](https://github.com/vue-styleguidist/vue-styleguidist/issues/407)





## [3.13.4](https://github.com/vue-styleguidist/vue-styleguidist/compare/v3.13.3...v3.13.4) (2019-05-15)

**Note:** Version bump only for package vue-styleguidist





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


### Features

* **main:** add jsxInComponents option ([27b4257](https://github.com/vue-styleguidist/vue-styleguidist/commit/27b4257))





## [3.11.7](https://github.com/vue-styleguidist/vue-styleguidist/compare/v3.11.6...v3.11.7) (2019-04-23)


### Bug Fixes

* keep dashes in component names ([3ec75ed](https://github.com/vue-styleguidist/vue-styleguidist/commit/3ec75ed)), closes [#391](https://github.com/vue-styleguidist/vue-styleguidist/issues/391)
* make sure we detect all variables ([118f1a8](https://github.com/vue-styleguidist/vue-styleguidist/commit/118f1a8))
* parse es6 imports with vsg format ([8f5ff19](https://github.com/vue-styleguidist/vue-styleguidist/commit/8f5ff19))
* remove getVars blocking imports ([1066123](https://github.com/vue-styleguidist/vue-styleguidist/commit/1066123))





## [3.11.6](https://github.com/vue-styleguidist/vue-styleguidist/compare/v3.11.5...v3.11.6) (2019-04-23)


### Bug Fixes

* ignored errors ([#177](https://github.com/vue-styleguidist/vue-styleguidist/issues/177)) ([#316](https://github.com/vue-styleguidist/vue-styleguidist/issues/316)) ([298f462](https://github.com/vue-styleguidist/vue-styleguidist/commit/298f462))





## [3.11.5](https://github.com/vue-styleguidist/vue-styleguidist/compare/v3.11.4...v3.11.5) (2019-04-20)

**Note:** Version bump only for package vue-styleguidist





## [3.11.4](https://github.com/vue-styleguidist/vue-styleguidist/compare/v3.11.3...v3.11.4) (2019-04-03)

**Note:** Version bump only for package vue-styleguidist





## [3.11.3](https://github.com/vue-styleguidist/vue-styleguidist/compare/v3.11.2...v3.11.3) (2019-04-01)


### Bug Fixes

* **options:** allow two words in displayName ([7b72603](https://github.com/vue-styleguidist/vue-styleguidist/commit/7b72603))
* **plugin:** issue with babel ([afbf21a](https://github.com/vue-styleguidist/vue-styleguidist/commit/afbf21a))
* **safety:** update css-loader ([0b074b8](https://github.com/vue-styleguidist/vue-styleguidist/commit/0b074b8))





## [3.11.2](https://github.com/vue-styleguidist/vue-styleguidist/compare/v3.11.1...v3.11.2) (2019-03-28)

**Note:** Version bump only for package vue-styleguidist





## [3.11.1](https://github.com/vue-styleguidist/vue-styleguidist/compare/v3.11.0...v3.11.1) (2019-03-28)

**Note:** Version bump only for package vue-styleguidist





# [3.11.0](https://github.com/vue-styleguidist/vue-styleguidist/compare/v3.10.2...v3.11.0) (2019-03-26)


### Features

* **core:** update react styleguidist to 9.0.4 ([#344](https://github.com/vue-styleguidist/vue-styleguidist/issues/344)) ([1ec6e64](https://github.com/vue-styleguidist/vue-styleguidist/commit/1ec6e64))





## [3.10.2](https://github.com/vue-styleguidist/vue-styleguidist/compare/v3.10.1...v3.10.2) (2019-03-22)


### Performance Improvements

* **esprima:** get rid of esprima heavy loader ([#347](https://github.com/vue-styleguidist/vue-styleguidist/issues/347)) ([552ba14](https://github.com/vue-styleguidist/vue-styleguidist/commit/552ba14))
