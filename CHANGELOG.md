# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

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
