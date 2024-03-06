# Change Log

## 4.76.0

### Minor Changes

- [#1646](https://github.com/vue-styleguidist/vue-styleguidist/pull/1646) [`454bfe75`](https://github.com/vue-styleguidist/vue-styleguidist/commit/454bfe7573057de806b783ba61d3b30def91078e) Thanks [@elevatebart](https://github.com/elevatebart)! - allow resolving an imported module in a type module package

## 4.75.1

### Patch Changes

- [#1624](https://github.com/vue-styleguidist/vue-styleguidist/pull/1624) [`bc4ff434`](https://github.com/vue-styleguidist/vue-styleguidist/commit/bc4ff434c4fa15df4ca7bc3dc982b86738b23ff9) Thanks [@azhirov](https://github.com/azhirov)! - Include setupSlotHandler in the final build

## 4.75.0

### Minor Changes

- [#1616](https://github.com/vue-styleguidist/vue-styleguidist/pull/1616) [`6b9638c2`](https://github.com/vue-styleguidist/vue-styleguidist/commit/6b9638c2a4bc5c5f06e3eea1243be2019841b21b) Thanks [@pscheede](https://github.com/pscheede)! - Add support for new defineEmits Syntax in Vue 3.3

### Patch Changes

- [#1604](https://github.com/vue-styleguidist/vue-styleguidist/pull/1604) [`b90bc397`](https://github.com/vue-styleguidist/vue-styleguidist/commit/b90bc3970b0e5faf688c1410d5f6294efd9cb512) Thanks [@ryoji-yamauchi-blc](https://github.com/ryoji-yamauchi-blc)! - Avoid parsing error when the type is reference type

## 4.74.2

### Patch Changes

- [#1609](https://github.com/vue-styleguidist/vue-styleguidist/pull/1609) [`3a36d6ef`](https://github.com/vue-styleguidist/vue-styleguidist/commit/3a36d6ef2a6c8de3ae1460cfedad58ac936647d9) Thanks [@elevatebart](https://github.com/elevatebart)! - add peerDependency for yarn 3 compatibility 😒

  See #1608

## 4.74.1

### Patch Changes

- [#1592](https://github.com/vue-styleguidist/vue-styleguidist/pull/1592) [`4dff37d5`](https://github.com/vue-styleguidist/vue-styleguidist/commit/4dff37d57f181807dfeadd38855bd6475f019a13) Thanks [@elevatebart](https://github.com/elevatebart)! - allow to traverse `import * as Interfaces from './test'` since `import { PropTypes } from './test'` already works

- [#1603](https://github.com/vue-styleguidist/vue-styleguidist/pull/1603) [`edbfc729`](https://github.com/vue-styleguidist/vue-styleguidist/commit/edbfc7292bf18b39214adf335c599d8c51165b1e) Thanks [@elevatebart](https://github.com/elevatebart)! - feat: extract slot and property documentation from defineslots

- [`8a24675d`](https://github.com/vue-styleguidist/vue-styleguidist/commit/8a24675db2fecb5efdb7efa52aea1e1962408ffd) Thanks [@elevatebart](https://github.com/elevatebart)! - avoid failure & crash on compositie props

## 4.74.0

### Minor Changes

- [#1586](https://github.com/vue-styleguidist/vue-styleguidist/pull/1586) [`1ecc082a`](https://github.com/vue-styleguidist/vue-styleguidist/commit/1ecc082a069193afeb7bae4493641cd81aa93432) Thanks [@sawmurai](https://github.com/sawmurai)! - Add initial support for external types in defineProps and defineEmits

## 4.73.1

### Patch Changes

- [#1580](https://github.com/vue-styleguidist/vue-styleguidist/pull/1580) [`67ba3b0b`](https://github.com/vue-styleguidist/vue-styleguidist/commit/67ba3b0b31be3b322a4417dba5de633d21c12e13) Thanks [@elevatebart](https://github.com/elevatebart)! - handle type as unknown as PropType<MyPropType>

## 4.73.0

### Minor Changes

- [#1576](https://github.com/vue-styleguidist/vue-styleguidist/pull/1576) [`3f1d9216`](https://github.com/vue-styleguidist/vue-styleguidist/commit/3f1d92161ae409cbcd9f3f7794110cfa3e8f115a) Thanks [@elevatebart](https://github.com/elevatebart)! - parse the defineOptions object for values

## 4.72.5

### Patch Changes

- [#1573](https://github.com/vue-styleguidist/vue-styleguidist/pull/1573) [`d4c2deca`](https://github.com/vue-styleguidist/vue-styleguidist/commit/d4c2decae791b7311ea1c0988aa3935501ea4024) Thanks [@thibaudszy](https://github.com/thibaudszy)! - improve performance of the path resolution

## 4.72.3

### Patch Changes

- [`b05be722`](https://github.com/vue-styleguidist/vue-styleguidist/commit/b05be7220d57c643a3f9d2552bbbb1aae6a52166) Thanks [@elevatebart](https://github.com/elevatebart)! - export-all should not skip all extensions

## 4.72.2

### Patch Changes

- [#1558](https://github.com/vue-styleguidist/vue-styleguidist/pull/1558) [`14bdb1dd`](https://github.com/vue-styleguidist/vue-styleguidist/commit/14bdb1dd44f750a0032ca91484df4f9f084c07e3) Thanks [@elevatebart](https://github.com/elevatebart)! - fix valid extends

## 4.71.0

### Minor Changes

- [#1550](https://github.com/vue-styleguidist/vue-styleguidist/pull/1550) [`979c7fdc`](https://github.com/vue-styleguidist/vue-styleguidist/commit/979c7fdc8af8c163d640491b955c6bf9a66e0450) Thanks [@elevatebart](https://github.com/elevatebart)! - allow documentation of implicit slot bindings

## 4.70.0

### Minor Changes

- [#1547](https://github.com/vue-styleguidist/vue-styleguidist/pull/1547) [`8d22c833`](https://github.com/vue-styleguidist/vue-styleguidist/commit/8d22c833de229b29d9c1df97004ba09d96b71eb1) Thanks [@elevatebart](https://github.com/elevatebart)! - feat: expose some utils functions

## 4.69.3

### Patch Changes

- [#1546](https://github.com/vue-styleguidist/vue-styleguidist/pull/1546) [`51123822`](https://github.com/vue-styleguidist/vue-styleguidist/commit/511238220bc71e8b5ebb631d6b761d958f6b8147) Thanks [@elevatebart](https://github.com/elevatebart)! - fix: protect invalid pattern

## 4.69.0

### Minor Changes

- [#1538](https://github.com/vue-styleguidist/vue-styleguidist/pull/1538) [`d86476bd`](https://github.com/vue-styleguidist/vue-styleguidist/commit/d86476bdd1fa60917ee0dcbad254fc5a92e369c5) Thanks [@sawmurai](https://github.com/sawmurai)! - Add TypeScript generic type parameters to event payloads

### Patch Changes

- Updated dependencies [[`d86476bd`](https://github.com/vue-styleguidist/vue-styleguidist/commit/d86476bdd1fa60917ee0dcbad254fc5a92e369c5)]:
  - vue-inbrowser-compiler-independent-utils@4.69.0

## 4.67.0

### Minor Changes

- [#1536](https://github.com/vue-styleguidist/vue-styleguidist/pull/1536) [`68cd825a`](https://github.com/vue-styleguidist/vue-styleguidist/commit/68cd825a22230abfb065e20ae81a3da40d5bb363) Thanks [@elevatebart](https://github.com/elevatebart)! - feat: export an esm version of the api

### Patch Changes

- [#1536](https://github.com/vue-styleguidist/vue-styleguidist/pull/1536) [`68cd825a`](https://github.com/vue-styleguidist/vue-styleguidist/commit/68cd825a22230abfb065e20ae81a3da40d5bb363) Thanks [@elevatebart](https://github.com/elevatebart)! - vue-docgen-api to parse type TSInstantiationExpression

- [#1537](https://github.com/vue-styleguidist/vue-styleguidist/pull/1537) [`7a7d5c41`](https://github.com/vue-styleguidist/vue-styleguidist/commit/7a7d5c41debddab37a1a4854753706435e1444ff) Thanks [@elevatebart](https://github.com/elevatebart)! - fix: update recast and ast-types to accept latest syntax

## 4.64.1

### Patch Changes

- [#1512](https://github.com/vue-styleguidist/vue-styleguidist/pull/1512) [`7310095c`](https://github.com/vue-styleguidist/vue-styleguidist/commit/7310095c0de2ad67571d017fdf05891dea78b1d6) Thanks [@elevatebart](https://github.com/elevatebart)! - fix: mixin-error-with-default

- [#1513](https://github.com/vue-styleguidist/vue-styleguidist/pull/1513) [`1b178cad`](https://github.com/vue-styleguidist/vue-styleguidist/commit/1b178cad6a4d2f3e55bc8221f3a344c0031be908) Thanks [@elevatebart](https://github.com/elevatebart)! - fix preprocessing of script setup

- Updated dependencies [[`1b178cad`](https://github.com/vue-styleguidist/vue-styleguidist/commit/1b178cad6a4d2f3e55bc8221f3a344c0031be908)]:
  - vue-inbrowser-compiler-independent-utils@4.64.1

## 4.64.0

### Minor Changes

- [#1511](https://github.com/vue-styleguidist/vue-styleguidist/pull/1511) [`fa34e5cf`](https://github.com/vue-styleguidist/vue-styleguidist/commit/fa34e5cf541aa7078c9605bbea61348f26e27e01) Thanks [@elevatebart](https://github.com/elevatebart)! - feat: track dependencies of components in vue-docgen-cli

### Patch Changes

- [#1510](https://github.com/vue-styleguidist/vue-styleguidist/pull/1510) [`e8902a1a`](https://github.com/vue-styleguidist/vue-styleguidist/commit/e8902a1afdbffd1b815ebdc1f931b46d8037577e) Thanks [@elevatebart](https://github.com/elevatebart)! - Update LRU cache dependency to version 8.x

- Updated dependencies [[`fa34e5cf`](https://github.com/vue-styleguidist/vue-styleguidist/commit/fa34e5cf541aa7078c9605bbea61348f26e27e01)]:
  - vue-inbrowser-compiler-independent-utils@4.64.0

## 4.60.0

### Patch Changes

- [`049306d1`](https://github.com/vue-styleguidist/vue-styleguidist/commit/049306d14c6300c815f6849de0ce3b6e8b453dd1) Thanks [@elevatebart](https://github.com/elevatebart)! - fix(vue-docgen-api): Catch error for model if not literal object

## 4.56.4

### Patch Changes

- [#1461](https://github.com/vue-styleguidist/vue-styleguidist/pull/1461) [`cd7cc3f4`](https://github.com/vue-styleguidist/vue-styleguidist/commit/cd7cc3f45deaeeeeef108ecb372af8decd50eca7) Thanks [@chakAs3](https://github.com/chakAs3)! - fix(docgen-api) fix issue when Props passed as Reference to Local Type

## 4.56.2

### Patch Changes

- [#1449](https://github.com/vue-styleguidist/vue-styleguidist/pull/1449) [`f2cf6fcc`](https://github.com/vue-styleguidist/vue-styleguidist/commit/f2cf6fcc02e655e5c399a1e62451cde45c0f6b5d) Thanks [@elevatebart](https://github.com/elevatebart)! - 1447 lack of support for defineexpose in script setup synthax

- [#1448](https://github.com/vue-styleguidist/vue-styleguidist/pull/1448) [`fbd5fe71`](https://github.com/vue-styleguidist/vue-styleguidist/commit/fbd5fe7199e65184468d9a517bb9d2ee7337ecd4) Thanks [@elevatebart](https://github.com/elevatebart)! - fix: defineEmits can use quote string as key

- Updated dependencies [[`f2cf6fcc`](https://github.com/vue-styleguidist/vue-styleguidist/commit/f2cf6fcc02e655e5c399a1e62451cde45c0f6b5d)]:
  - vue-inbrowser-compiler-independent-utils@4.56.2

## 4.56.0

### Minor Changes

- [#1430](https://github.com/vue-styleguidist/vue-styleguidist/pull/1430) [`65e0cfd6`](https://github.com/vue-styleguidist/vue-styleguidist/commit/65e0cfd662acf0b3c3f81ae073e7a92c5220ac88) Thanks [@sawmurai](https://github.com/sawmurai)! - feat(docgen): support import assertions

## 4.54.2

### Patch Changes

- [#1408](https://github.com/vue-styleguidist/vue-styleguidist/pull/1408) [`f016a0f9`](https://github.com/vue-styleguidist/vue-styleguidist/commit/f016a0f9f880902434299c9c101db169ae6232db) Thanks [@sawmurai](https://github.com/sawmurai)! - fix: Dynamic slot name fix #1285

## 4.52.0

### Minor Changes

- [#1374](https://github.com/vue-styleguidist/vue-styleguidist/pull/1374) [`c38b94a3`](https://github.com/vue-styleguidist/vue-styleguidist/commit/c38b94a3ce7c0ce72e7f2f842b54ee9f1758fdea) Thanks [@elevatebart](https://github.com/elevatebart)! - Split utils package to avoid dependency for docgen

### Patch Changes

- Updated dependencies [[`c38b94a3`](https://github.com/vue-styleguidist/vue-styleguidist/commit/c38b94a3ce7c0ce72e7f2f842b54ee9f1758fdea)]:
  - vue-inbrowser-compiler-independent-utils@4.52.0

## 4.50.0

### Patch Changes

- [`6308307b`](https://github.com/vue-styleguidist/vue-styleguidist/commit/6308307bc91cc215090dd9e33a3faf0af26427dc) Thanks [@elevatebart](https://github.com/elevatebart)! - - fix `defineExposed` into `defineExpose`
  - add the exposed member to the documentation
- Updated dependencies [[`6308307b`](https://github.com/vue-styleguidist/vue-styleguidist/commit/6308307bc91cc215090dd9e33a3faf0af26427dc)]:
  - vue-inbrowser-compiler-utils@4.50.0

## 4.47.1

### Patch Changes

- [#1362](https://github.com/vue-styleguidist/vue-styleguidist/pull/1362) [`368df13f`](https://github.com/vue-styleguidist/vue-styleguidist/commit/368df13f8f6fcf727a69226a4311ea1a2a1d98c6) Thanks [@chenjuneking](https://github.com/chenjuneking)! - - fix `defineExposed` into `defineExpose`
  - add the exposed member to the documentation
- Updated dependencies [[`bbc09354`](https://github.com/vue-styleguidist/vue-styleguidist/commit/bbc09354ee9d23a368a449260d923dc7c034650c)]:
  - vue-inbrowser-compiler-utils@4.47.0

## 4.47.0

### Minor Changes

- [#1328](https://github.com/vue-styleguidist/vue-styleguidist/pull/1328) [`c2a1c793`](https://github.com/vue-styleguidist/vue-styleguidist/commit/c2a1c793548658436c4bce4458508e31ffd8f9cc) Thanks [@elevatebart](https://github.com/elevatebart)! - Allow multiple fire tags on the same method

## 4.46.1

### Patch Changes

- [`e8c154eb`](https://github.com/vue-styleguidist/vue-styleguidist/commit/e8c154eb947dbd9c83a20a1357aad27758cf12cf) Thanks [@elevatebart](https://github.com/elevatebart)! - fix #1326 allow scriptHandler and addScriptHandler to be specified at the same time

## 4.46.0

### Minor Changes

- [#1318](https://github.com/vue-styleguidist/vue-styleguidist/pull/1318) [`9b1ec66f`](https://github.com/vue-styleguidist/vue-styleguidist/commit/9b1ec66f10ce1d3475b13efd1df2d1a3f831cb54) Thanks [@elevatebart](https://github.com/elevatebart)! - `@example` tags can now understand multiline examples

  Every tag can now contain multiple lines except for the following:

  - `@slot`
  - `@ignore`
  - `@private`
  - `@public`

  If one of those tags is placed at the beginning of the TSDocs block, the next lines are still picked up as the description.

All notable changes to this project will be documented in this file. See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [4.45.0](https://github.com/vue-styleguidist/vue-styleguidist/compare/v4.44.29...v4.45.0) (2022-04-29)

### Features

- allow use of multiline examples and types ([a95a306](https://github.com/vue-styleguidist/vue-styleguidist/commit/a95a306a67fbf2bbdf0e7f6bddba143192ffcfa1)), closes [#1166](https://github.com/vue-styleguidist/vue-styleguidist/issues/1166)

## [4.44.23](https://github.com/vue-styleguidist/vue-styleguidist/compare/v4.44.22...v4.44.23) (2022-03-25)

### Bug Fixes

- last babel cheks for const initialization ([8587549](https://github.com/vue-styleguidist/vue-styleguidist/commit/85875493a550f0f9f6f61262d91ba1013b88e796)), closes [#1299](https://github.com/vue-styleguidist/vue-styleguidist/issues/1299)

## [4.44.22](https://github.com/vue-styleguidist/vue-styleguidist/compare/v4.44.21...v4.44.22) (2022-03-18)

**Note:** Version bump only for package vue-docgen-api

## [4.44.21](https://github.com/vue-styleguidist/vue-styleguidist/compare/v4.44.20...v4.44.21) (2022-03-18)

**Note:** Version bump only for package vue-docgen-api

## [4.44.20](https://github.com/vue-styleguidist/vue-styleguidist/compare/v4.44.19...v4.44.20) (2022-03-18)

**Note:** Version bump only for package vue-docgen-api

## [4.44.18](https://github.com/vue-styleguidist/vue-styleguidist/compare/v4.44.17...v4.44.18) (2022-03-10)

### Bug Fixes

- 🐛 Allow imported TS in JS SFCs ([ccc06ce](https://github.com/vue-styleguidist/vue-styleguidist/commit/ccc06ce6e256ab351f048f3e71182c84038a4e35))
- Indentation ([da0d6d9](https://github.com/vue-styleguidist/vue-styleguidist/commit/da0d6d91667b9fc56f39ea060891ed4b1ccbd04a))

## [4.44.17](https://github.com/vue-styleguidist/vue-styleguidist/compare/v4.44.16...v4.44.17) (2022-02-28)

**Note:** Version bump only for package vue-docgen-api

## [4.44.16](https://github.com/vue-styleguidist/vue-styleguidist/compare/v4.44.15...v4.44.16) (2022-02-22)

### Bug Fixes

- display richer complex types in setup ([2254598](https://github.com/vue-styleguidist/vue-styleguidist/commit/22545980067bbc3db69d80420edb0657864ed61e))

## 4.44.2 (2022-01-18)

## 4.44.15 (2022-01-31)

**Note:** Version bump only for package vue-docgen-api

## 4.44.14 (2022-01-31)

**Note:** Version bump only for package vue-docgen-api

## 4.44.13 (2022-01-31)

**Note:** Version bump only for package vue-docgen-api

## 4.44.12 (2022-01-31)

**Note:** Version bump only for package vue-docgen-api

## 4.44.11 (2022-01-31)

**Note:** Version bump only for package vue-docgen-api

## 4.44.10 (2022-01-31)

**Note:** Version bump only for package vue-docgen-api

## 4.44.9 (2022-01-31)

**Note:** Version bump only for package vue-docgen-api

## 4.44.8 (2022-01-31)

**Note:** Version bump only for package vue-docgen-api

## 4.44.7 (2022-01-31)

**Note:** Version bump only for package vue-docgen-api

## 4.44.6 (2022-01-31)

**Note:** Version bump only for package vue-docgen-api

## 4.44.5 (2022-01-31)

**Note:** Version bump only for package vue-docgen-api

## 4.44.4 (2022-01-31)

**Note:** Version bump only for package vue-docgen-api

## [4.44.3](https://github.com/vue-styleguidist/vue-styleguidist/compare/v4.44.2...v4.44.3) (2022-01-31)

### Bug Fixes

- display richer complex types in setup ([2254598](https://github.com/vue-styleguidist/vue-styleguidist/commit/22545980067bbc3db69d80420edb0657864ed61e))

## [4.44.2](https://github.com/vue-styleguidist/vue-styleguidist/compare/v4.44.1...v4.44.2) (2022-01-18)

### Bug Fixes

- **docgen:** parse TypeScript types / setup syntax ([2346b64](https://github.com/vue-styleguidist/vue-styleguidist/commit/2346b64a8c53423ebe853e1f48cab3bb2aae4956))

## [4.44.1](https://github.com/vue-styleguidist/vue-styleguidist/compare/v4.44.0...v4.44.1) (2022-01-18)

### Bug Fixes

- **docgen:** parse withDefaults() for defaults ([3ac0759](https://github.com/vue-styleguidist/vue-styleguidist/commit/3ac0759ef095d5645bb4fe633b1e9dd4acdfbbfc))

# [4.44.0](https://github.com/vue-styleguidist/vue-styleguidist/compare/v4.43.3...v4.44.0) (2022-01-17)

### Bug Fixes

- **docgen:** typings for tests ([bf59f31](https://github.com/vue-styleguidist/vue-styleguidist/commit/bf59f319f26ed04132a2e1dba55352298cc1a504))

### Features

- **docgen:** add setup syntax api support ([127f288](https://github.com/vue-styleguidist/vue-styleguidist/commit/127f288bc2ed26f71629918d2494120c198d73bc))
- **docgen:** allow template comments in js ([f2811f7](https://github.com/vue-styleguidist/vue-styleguidist/commit/f2811f7ec196506e0056e0ecaf2124b73acb3ae4))

## [4.43.3](https://github.com/vue-styleguidist/vue-styleguidist/compare/v4.43.2...v4.43.3) (2022-01-13)

### Bug Fixes

- **docgen:** allow simple PropType ([486c1a4](https://github.com/vue-styleguidist/vue-styleguidist/commit/486c1a45f86ec23098fe2af30be6aca10dcda738)), closes [#1254](https://github.com/vue-styleguidist/vue-styleguidist/issues/1254)

## [4.43.2](https://github.com/vue-styleguidist/vue-styleguidist/compare/v4.43.1...v4.43.2) (2022-01-03)

**Note:** Version bump only for package vue-docgen-api

## [4.43.1](https://github.com/vue-styleguidist/vue-styleguidist/compare/v4.43.0...v4.43.1) (2021-12-23)

### Bug Fixes

- **docgen:** parse bindings with a dash in jsdoc ([b7b0d30](https://github.com/vue-styleguidist/vue-styleguidist/commit/b7b0d30fa8803505873f176ffda6b63ba473c417)), closes [#1229](https://github.com/vue-styleguidist/vue-styleguidist/issues/1229)
- have both script & setup in a SFC ignores ([3593171](https://github.com/vue-styleguidist/vue-styleguidist/commit/3593171a2ead792d7e40bb39922e8eb05d6e6192))

# [4.43.0](https://github.com/vue-styleguidist/vue-styleguidist/compare/v4.42.0...v4.43.0) (2021-11-21)

### Bug Fixes

- **docgen:** resolve exported displayname ([d414c4a](https://github.com/vue-styleguidist/vue-styleguidist/commit/d414c4a137f012160fdcdb585f46908bb942dd8a)), closes [#1220](https://github.com/vue-styleguidist/vue-styleguidist/issues/1220)

# [4.42.0](https://github.com/vue-styleguidist/vue-styleguidist/compare/v4.41.3...v4.42.0) (2021-11-18)

**Note:** Version bump only for package vue-docgen-api

## [4.41.2](https://github.com/vue-styleguidist/vue-styleguidist/compare/v4.41.1...v4.41.2) (2021-09-09)

**Note:** Version bump only for package vue-docgen-api

## [4.41.1](https://github.com/vue-styleguidist/vue-styleguidist/compare/v4.41.0...v4.41.1) (2021-08-17)

**Note:** Version bump only for package vue-docgen-api

# [4.41.0](https://github.com/vue-styleguidist/vue-styleguidist/compare/v4.40.0...v4.41.0) (2021-08-13)

### Bug Fixes

- **deps:** update all ([78807c3](https://github.com/vue-styleguidist/vue-styleguidist/commit/78807c34893be6746b4f18e0d3d1d706a4e816af))
- **docgen:** fix strict alias type to support arrays ([47c6f7b](https://github.com/vue-styleguidist/vue-styleguidist/commit/47c6f7b022aa919324e3b21ac760d155eb47cfc1))

### Features

- **docgen:** add support for arrays in aliases ([df76397](https://github.com/vue-styleguidist/vue-styleguidist/commit/df763973b03d7d8977f25d6eafae1a6faa0507b4))

# [4.40.0](https://github.com/vue-styleguidist/vue-styleguidist/compare/v4.39.0...v4.40.0) (2021-06-07)

### Features

- allow to use the single type as Prop argument ([8e2a12d](https://github.com/vue-styleguidist/vue-styleguidist/commit/8e2a12d37a36a067b578833e76834b44c4a7029e)), closes [#1034](https://github.com/vue-styleguidist/vue-styleguidist/issues/1034)

# [4.39.0](https://github.com/vue-styleguidist/vue-styleguidist/compare/v4.38.3...v4.39.0) (2021-05-24)

### Features

- allow extension of component in a local file ([1663977](https://github.com/vue-styleguidist/vue-styleguidist/commit/166397793959e268d1ac7050c9aa49255de2c0a3))
- resolve local global variable for mixins ([58305f3](https://github.com/vue-styleguidist/vue-styleguidist/commit/58305f3df5722dee20a06da534f02d481283f505))

## [4.38.3](https://github.com/vue-styleguidist/vue-styleguidist/compare/v4.38.2...v4.38.3) (2021-05-24)

### Bug Fixes

- **docgen:** multiple class component in same file ([cb0e986](https://github.com/vue-styleguidist/vue-styleguidist/commit/cb0e986ac2f43fa6e6b1f651ddee908e0f4f4aaa)), closes [#1130](https://github.com/vue-styleguidist/vue-styleguidist/issues/1130)

## [4.38.2](https://github.com/vue-styleguidist/vue-styleguidist/compare/v4.38.1...v4.38.2) (2021-05-11)

### Bug Fixes

- allow for @Emit to be parsed ([b1c7285](https://github.com/vue-styleguidist/vue-styleguidist/commit/b1c7285943de709a5aa4c518c7570bf185324aa9))

## [4.38.1](https://github.com/vue-styleguidist/vue-styleguidist/compare/v4.38.0...v4.38.1) (2021-04-13)

### Bug Fixes

- allow function expression validators ([7ece101](https://github.com/vue-styleguidist/vue-styleguidist/commit/7ece101eabcfdfe4003b18587a21e05825d316eb)), closes [#1083](https://github.com/vue-styleguidist/vue-styleguidist/issues/1083)

# [4.38.0](https://github.com/vue-styleguidist/vue-styleguidist/compare/v4.37.2...v4.38.0) (2021-04-10)

### Features

- **docgen:** allow typescript as in exports ([0514a86](https://github.com/vue-styleguidist/vue-styleguidist/commit/0514a86ead9cc4ddb9b17b5a0857c8185d70af7a)), closes [#1066](https://github.com/vue-styleguidist/vue-styleguidist/issues/1066)

# [4.37.0](https://github.com/vue-styleguidist/vue-styleguidist/compare/v4.36.1...v4.37.0) (2021-04-05)

### Features

- **docgen:** add support for Identifier when parsing validators ([#1076](https://github.com/vue-styleguidist/vue-styleguidist/issues/1076)) ([5f0d089](https://github.com/vue-styleguidist/vue-styleguidist/commit/5f0d089bd4159f5098148df67db5339e473da6d9))

## [4.36.1](https://github.com/vue-styleguidist/vue-styleguidist/compare/v4.36.0...v4.36.1) (2021-03-20)

### Bug Fixes

- load export const name = Vue.extends all good ([2e760c9](https://github.com/vue-styleguidist/vue-styleguidist/commit/2e760c9691a9b7c927341afd4407dfa2b11f055c)), closes [#1069](https://github.com/vue-styleguidist/vue-styleguidist/issues/1069)

# [4.36.0](https://github.com/vue-styleguidist/vue-styleguidist/compare/v4.35.0...v4.36.0) (2021-03-18)

### Bug Fixes

- updrade react-stypeguidist ([4823bd2](https://github.com/vue-styleguidist/vue-styleguidist/commit/4823bd2be1d1f2fa1e39d7142da7cb15ab16b43c))
- **docgen:** ensure pug renders template using html doctype ([2f3512b](https://github.com/vue-styleguidist/vue-styleguidist/commit/2f3512b7951889c8fa72856655725b62bd4e81fb))
- **docgen:** html doctype as a default rather than a force ([01c921f](https://github.com/vue-styleguidist/vue-styleguidist/commit/01c921f8054607b9e0d99c0f87a4820fe8dedc2d))

### Features

- **docgen:** allow slots to be defined by composition API render functions ([63f2f35](https://github.com/vue-styleguidist/vue-styleguidist/commit/63f2f352435f95fc55e3598c877c33383909e933))

# [4.35.0](https://github.com/vue-styleguidist/vue-styleguidist/compare/v4.34.4...v4.35.0) (2021-01-26)

### Bug Fixes

- **docgen:** use the pathResolver from utils ([3b77a82](https://github.com/vue-styleguidist/vue-styleguidist/commit/3b77a8240fe16451d660b57584d4178b018fc6c7))
- resolve [#1042](https://github.com/vue-styleguidist/vue-styleguidist/issues/1042) add basic support for aliases in external src ([6d8b5c5](https://github.com/vue-styleguidist/vue-styleguidist/commit/6d8b5c554f0cc98a3d9920292c4ace46a4cf24d8))

## [4.34.2](https://github.com/vue-styleguidist/vue-styleguidist/compare/v4.34.1...v4.34.2) (2020-12-05)

### Bug Fixes

- **docgen:** SFC with lang='tsx' support ([bd21931](https://github.com/vue-styleguidist/vue-styleguidist/commit/bd2193199988b786aae79a2e35aa552c1e5f8f54))

## [4.34.1](https://github.com/vue-styleguidist/vue-styleguidist/compare/v4.34.0...v4.34.1) (2020-11-27)

### Bug Fixes

- **docgen:** Vue.extends without comments ([bf42ccc](https://github.com/vue-styleguidist/vue-styleguidist/commit/bf42ccc05c8790a074d979af9f78bc50f898dccd)), closes [#1027](https://github.com/vue-styleguidist/vue-styleguidist/issues/1027)

# [4.34.0](https://github.com/vue-styleguidist/vue-styleguidist/compare/v4.33.10...v4.34.0) (2020-11-25)

### Bug Fixes

- **docgen:** allow TypeScript to export a constant ([353601e](https://github.com/vue-styleguidist/vue-styleguidist/commit/353601ea21da33b237c52bf0ba376d6c3f32d9aa)), closes [#997](https://github.com/vue-styleguidist/vue-styleguidist/issues/997)

## [4.33.9](https://github.com/vue-styleguidist/vue-styleguidist/compare/v4.33.8...v4.33.9) (2020-11-16)

**Note:** Version bump only for package vue-docgen-api

## [4.33.7](https://github.com/vue-styleguidist/vue-styleguidist/compare/v4.33.6...v4.33.7) (2020-11-15)

### Bug Fixes

- **docgen:** allow Mixins from vue-p-decorator ([314686a](https://github.com/vue-styleguidist/vue-styleguidist/commit/314686a1f91dec4ef246b809d217d8ee0dc5466a))

## [4.33.6](https://github.com/vue-styleguidist/vue-styleguidist/compare/v4.33.5...v4.33.6) (2020-11-05)

**Note:** Version bump only for package vue-docgen-api

## [4.33.4](https://github.com/vue-styleguidist/vue-styleguidist/compare/v4.33.3...v4.33.4) (2020-10-22)

**Note:** Version bump only for package vue-docgen-api

## [4.33.2](https://github.com/vue-styleguidist/vue-styleguidist/compare/v4.33.1...v4.33.2) (2020-10-19)

**Note:** Version bump only for package vue-docgen-api

## [4.33.1](https://github.com/vue-styleguidist/vue-styleguidist/compare/v4.33.0...v4.33.1) (2020-10-14)

### Bug Fixes

- **docgen:** allow `as const` in default ([d3f070d](https://github.com/vue-styleguidist/vue-styleguidist/commit/d3f070dd08677a6614498ff8de8c91ea287c75bf))

# [4.33.0](https://github.com/vue-styleguidist/vue-styleguidist/compare/v4.32.4...v4.33.0) (2020-10-12)

### Features

- **docgen:** parse emits option from vue 3 ([0469224](https://github.com/vue-styleguidist/vue-styleguidist/commit/0469224f92355dfa867a528f8123d7ef181a387c)), closes [#965](https://github.com/vue-styleguidist/vue-styleguidist/issues/965)

## [4.32.4](https://github.com/vue-styleguidist/vue-styleguidist/compare/v4.32.3...v4.32.4) (2020-09-24)

### Bug Fixes

- **docgen:** allow base indent in pug templates ([0950074](https://github.com/vue-styleguidist/vue-styleguidist/commit/09500746aa648b03a59550f7e591aa5243727612)), closes [#979](https://github.com/vue-styleguidist/vue-styleguidist/issues/979)

## [4.32.1](https://github.com/vue-styleguidist/vue-styleguidist/compare/v4.32.0...v4.32.1) (2020-09-08)

**Note:** Version bump only for package vue-docgen-api

# [4.32.0](https://github.com/vue-styleguidist/vue-styleguidist/compare/v4.31.2...v4.32.0) (2020-09-08)

### Bug Fixes

- parsing of validator with a function ref ([17472c3](https://github.com/vue-styleguidist/vue-styleguidist/commit/17472c3a26a2b43da26de6169388b35f8338195f)), closes [#954](https://github.com/vue-styleguidist/vue-styleguidist/issues/954)

## [4.31.2](https://github.com/vue-styleguidist/vue-styleguidist/compare/v4.31.1...v4.31.2) (2020-08-23)

**Note:** Version bump only for package vue-docgen-api

## [4.31.1](https://github.com/vue-styleguidist/vue-styleguidist/compare/v4.31.0...v4.31.1) (2020-08-20)

### Bug Fixes

- **docgen:** keep comments in the template in prod ([b9e4a89](https://github.com/vue-styleguidist/vue-styleguidist/commit/b9e4a89817a91731a40671760f7c7dc482090a25)), closes [#942](https://github.com/vue-styleguidist/vue-styleguidist/issues/942)

# [4.31.0](https://github.com/vue-styleguidist/vue-styleguidist/compare/v4.30.0...v4.31.0) (2020-08-15)

### Features

- **docgen:** allow destructured children in func ([1f9d9b6](https://github.com/vue-styleguidist/vue-styleguidist/commit/1f9d9b6df6f81cbe56aa31b3fa3fd50ff9dd858c))
- **docgen:** undetecteable slots definition ([be867bd](https://github.com/vue-styleguidist/vue-styleguidist/commit/be867bda8270a47a197c0f04f47d1a35425feace))

# [4.30.0](https://github.com/vue-styleguidist/vue-styleguidist/compare/v4.29.1...v4.30.0) (2020-08-08)

### Bug Fixes

- slot handler with vue 3 ([cec6a54](https://github.com/vue-styleguidist/vue-styleguidist/commit/cec6a54a7ee79415d75d0542bb8bd9704dfa5454))

### Features

- **docgen:** make props detector work [WIP](<[886d222](https://github.com/vue-styleguidist/vue-styleguidist/commit/886d2223c960ef329fddcb076821b5d4dc9aeb81)>)
- figure out the move to vue 3 [WIP](<[30ab312](https://github.com/vue-styleguidist/vue-styleguidist/commit/30ab31228345e6d43062740f7c9af0222457472f)>)

## [4.29.1](https://github.com/vue-styleguidist/vue-styleguidist/compare/v4.29.0...v4.29.1) (2020-07-30)

**Note:** Version bump only for package vue-docgen-api

## [4.28.1](https://github.com/vue-styleguidist/vue-styleguidist/compare/v4.28.0...v4.28.1) (2020-07-27)

### Bug Fixes

- delegated component exports ([046f96b](https://github.com/vue-styleguidist/vue-styleguidist/commit/046f96bc1e9d6d4f9514b74c2666710cf09019a5))

# [4.28.0](https://github.com/vue-styleguidist/vue-styleguidist/compare/v4.27.1...v4.28.0) (2020-07-21)

### Bug Fixes

- **docgen:** priority to documented values ([696bd87](https://github.com/vue-styleguidist/vue-styleguidist/commit/696bd873a914a4d5057f3dda27f3f9f7eaffa0a2))

### Features

- **docgen:** detect values in validator ([8d681a6](https://github.com/vue-styleguidist/vue-styleguidist/commit/8d681a66576990f2acdc265cea7f4ffa4659b14e))

## [4.23.1](https://github.com/vue-styleguidist/vue-styleguidist/compare/v4.23.0...v4.23.1) (2020-05-15)

# [4.23.0](https://github.com/vue-styleguidist/vue-styleguidist/compare/v4.22.3...v4.23.0) (2020-05-15)

### Features

- **docgen:** allow to have more than 1 values tag ([3e84005](https://github.com/vue-styleguidist/vue-styleguidist/commit/3e840058615aea163e5ca5e8f3ab1ec9324ffd4a))

## [4.22.3](https://github.com/vue-styleguidist/vue-styleguidist/compare/v4.22.2...v4.22.3) (2020-05-12)

### Bug Fixes

- **docgen:** fix default parsing for [@type](https://github.com/type) props ([1fc4b03](https://github.com/vue-styleguidist/vue-styleguidist/commit/1fc4b03eb408f535f7bb8e85bb8037800aee2eb1)), closes [#866](https://github.com/vue-styleguidist/vue-styleguidist/issues/866)

## [4.22.2](https://github.com/vue-styleguidist/vue-styleguidist/compare/v4.22.1...v4.22.2) (2020-05-12)

### Bug Fixes

- **docgen:** error when parsing default prop ([1fe3dfe](https://github.com/vue-styleguidist/vue-styleguidist/commit/1fe3dfeeaccdf2c1d5d6b2033b0b1ac8db510103))

## [4.22.1](https://github.com/vue-styleguidist/vue-styleguidist/compare/v4.22.0...v4.22.1) (2020-05-12)

### Bug Fixes

- **docgen:** object Methods should return regular functions ([79a7fa2](https://github.com/vue-styleguidist/vue-styleguidist/commit/79a7fa2271d93dc71c6651e262ea25a244ee656a))
- avoid error when multiple return in a default ([3e4c53d](https://github.com/vue-styleguidist/vue-styleguidist/commit/3e4c53d8836c40d826c26de768e4b41e8d3b4205))
- **docgen:** correctly extract default values ([349ad81](https://github.com/vue-styleguidist/vue-styleguidist/commit/349ad812894120e1c4816df55a427a8724b99b8c))

# [4.21.0](https://github.com/vue-styleguidist/vue-styleguidist/compare/v4.20.0...v4.21.0) (2020-05-09)

### Features

- **docgen:** allow to force events definitions ([#854](https://github.com/vue-styleguidist/vue-styleguidist/issues/854)) ([7a2105c](https://github.com/vue-styleguidist/vue-styleguidist/commit/7a2105c84aa9b08d1b380ea56b698aaedad1e9e8))

# [4.20.0](https://github.com/vue-styleguidist/vue-styleguidist/compare/v4.19.5...v4.20.0) (2020-05-06)

### Features

- **docgen:** make values work for class type ([c003176](https://github.com/vue-styleguidist/vue-styleguidist/commit/c003176186616975afa72083efb22a1e4f45eb8a))
- **docgen:** record [@type](https://github.com/type) values ([452ccb5](https://github.com/vue-styleguidist/vue-styleguidist/commit/452ccb5c3a708a047183a1684201c17487cf10ec))
- **docgen:** resolve values in as types ([7648a4e](https://github.com/vue-styleguidist/vue-styleguidist/commit/7648a4e199314af25cc25183f1fd2f506da447fa))

## [4.19.2](https://github.com/vue-styleguidist/vue-styleguidist/compare/v4.19.1...v4.19.2) (2020-04-29)

### Bug Fixes

- **docgen:** allow functional render slots ([2b36e38](https://github.com/vue-styleguidist/vue-styleguidist/commit/2b36e38042fb4836eb8afb68df3ebf74cac3b8e3)), closes [#837](https://github.com/vue-styleguidist/vue-styleguidist/issues/837)
- **docgen:** scoped slots bindings can spread ([d0a939c](https://github.com/vue-styleguidist/vue-styleguidist/commit/d0a939c4edb9fdd2986a5695e9894c462be01e36)), closes [#833](https://github.com/vue-styleguidist/vue-styleguidist/issues/833)

## [4.19.1](https://github.com/vue-styleguidist/vue-styleguidist/compare/v4.19.0...v4.19.1) (2020-04-28)

# [4.19.0](https://github.com/vue-styleguidist/vue-styleguidist/compare/v4.18.0...v4.19.0) (2020-04-24)

### Bug Fixes

- tag titles are no longer filtered out ([2a91b3e](https://github.com/vue-styleguidist/vue-styleguidist/commit/2a91b3e8c9aa2d1e1596cdf7998ed1af4cddf780))
- **docgen:** accept named typescript exports ([b256b17](https://github.com/vue-styleguidist/vue-styleguidist/commit/b256b174347766d31ab55fab948849037f32d930)), closes [#813](https://github.com/vue-styleguidist/vue-styleguidist/issues/813)

### Features

- **docgen:** deal with index as filename ([61d28f5](https://github.com/vue-styleguidist/vue-styleguidist/commit/61d28f5ba60b36a8d8af55c4366497b369d940e5))

# [4.18.0](https://github.com/vue-styleguidist/vue-styleguidist/compare/v4.17.0...v4.18.0) (2020-04-17)

### Bug Fixes

- **docgen:** fix ts array, intersection type print ([4ca38bf](https://github.com/vue-styleguidist/vue-styleguidist/commit/4ca38bf6a6e5fd39e87276332461c24ddb01cc5a))

### Features

- **docgen:** accept pug options for the template ([c318521](https://github.com/vue-styleguidist/vue-styleguidist/commit/c318521b29e0389d38c5eb8a1fed0c69969f8747))
- **docgen:** extract type values properly ([6ffd571](https://github.com/vue-styleguidist/vue-styleguidist/commit/6ffd571fe1d51048a413eb0908d873da916d3dda))

# [4.16.0](https://github.com/vue-styleguidist/vue-styleguidist/compare/v4.15.2...v4.16.0) (2020-04-09)

### Features

- Document composite components ([#815](https://github.com/vue-styleguidist/vue-styleguidist/issues/815)) ([a6a3d11](https://github.com/vue-styleguidist/vue-styleguidist/commit/a6a3d11c320a3501ea1e63acdf3108d191cc6390)), closes [#809](https://github.com/vue-styleguidist/vue-styleguidist/issues/809)

## [4.15.1](https://github.com/vue-styleguidist/vue-styleguidist/compare/v4.15.0...v4.15.1) (2020-03-30)

### Bug Fixes

- **docgen:** allow single slots to not documented ([34381d1](https://github.com/vue-styleguidist/vue-styleguidist/commit/34381d162f914f2ad94f382acb09227365ec4fc0))

# [4.15.0](https://github.com/vue-styleguidist/vue-styleguidist/compare/v4.14.0...v4.15.0) (2020-03-29)

### Bug Fixes

- **docgen:** remove TSUnionType ([2f32e5f](https://github.com/vue-styleguidist/vue-styleguidist/commit/2f32e5f4b6972610a7406d98601b7faa2ac7d354)), closes [#796](https://github.com/vue-styleguidist/vue-styleguidist/issues/796)

### Features

- **docgen:** parse the throws tag ([2f70045](https://github.com/vue-styleguidist/vue-styleguidist/commit/2f7004551ea71a2a469053ccb348f3bea21ac867))

# [4.14.0](https://github.com/vue-styleguidist/vue-styleguidist/compare/v4.13.1...v4.14.0) (2020-03-18)

### Features

- expose typescript types for theming ([3110fb5](https://github.com/vue-styleguidist/vue-styleguidist/commit/3110fb5b8342b3c89a70e9ecaf710a4c3a77bee5))

## [4.13.1](https://github.com/vue-styleguidist/vue-styleguidist/compare/v4.13.0...v4.13.1) (2020-03-03)

### Bug Fixes

- **docgen:** export iev var names ([c02268b](https://github.com/vue-styleguidist/vue-styleguidist/commit/c02268b31fd34f8e1cabd4f149f2e8dd30ff0ee3))
- **docgen:** handlers expressions with multiline ([8e7c66c](https://github.com/vue-styleguidist/vue-styleguidist/commit/8e7c66c62388746579ddda3753aa743b41a88c43)), closes [#772](https://github.com/vue-styleguidist/vue-styleguidist/issues/772)
- multiple exports in parse export default ([7bb82dd](https://github.com/vue-styleguidist/vue-styleguidist/commit/7bb82ddb3e8173dccc344117a4a2e50b42360639))
- sort docs when all promises are resolved ([dbaa82e](https://github.com/vue-styleguidist/vue-styleguidist/commit/dbaa82e3a08113dd0182647ea2fa3a7b2b6bfdd4))

# [4.12.0](https://github.com/vue-styleguidist/vue-styleguidist/compare/v4.11.0...v4.12.0) (2020-02-25)

### Bug Fixes

- **docgen:** take mixin order into account ([626337e](https://github.com/vue-styleguidist/vue-styleguidist/commit/626337ebc2bce975b16815971f73f3a6f7b7a9b8)), closes [#761](https://github.com/vue-styleguidist/vue-styleguidist/issues/761)

### Features

- **docgen:** methods returned by other methods ([95e648c](https://github.com/vue-styleguidist/vue-styleguidist/commit/95e648c784773b57603e0f8ebca652a5f3a76b5d)), closes [#765](https://github.com/vue-styleguidist/vue-styleguidist/issues/765)
- detect when example file loaded twice ([e4b1a48](https://github.com/vue-styleguidist/vue-styleguidist/commit/e4b1a4808f0b175bb0a23088e139595da58b14c4))

# [4.11.0](https://github.com/vue-styleguidist/vue-styleguidist/compare/v4.10.1...v4.11.0) (2020-02-22)

### Bug Fixes

- only show required props on default examples ([0f6bc11](https://github.com/vue-styleguidist/vue-styleguidist/commit/0f6bc1188cff5d4781bebb1ddef48d6b0f9482b2))

### Features

- give default examples a variable geometry ([535e347](https://github.com/vue-styleguidist/vue-styleguidist/commit/535e347e3970b5c48a40ac538892cffe85a89977))

# [4.9.0](https://github.com/vue-styleguidist/vue-styleguidist/compare/v4.8.1...v4.9.0) (2020-02-16)

## [4.27.1](https://github.com/vue-styleguidist/vue-styleguidist/compare/v4.27.0...v4.27.1) (2020-07-19)

### Bug Fixes

- **docgen:** allow export - as - from "-" ([f7ac47c](https://github.com/vue-styleguidist/vue-styleguidist/commit/f7ac47cf89667e389670c11f44f3edc7e1cdfd0f)), closes [#911](https://github.com/vue-styleguidist/vue-styleguidist/issues/911)

# [4.27.0](https://github.com/vue-styleguidist/vue-styleguidist/compare/v4.26.3...v4.27.0) (2020-07-17)

### Features

- **docgen:** resolve dynamic mixins ([0dbe049](https://github.com/vue-styleguidist/vue-styleguidist/commit/0dbe0493e786b49903d0cef0255df531713186fa))

# [4.26.0](https://github.com/vue-styleguidist/vue-styleguidist/compare/v4.25.0...v4.26.0) (2020-06-29)

**Note:** Version bump only for package vue-docgen-api

# [4.25.0](https://github.com/vue-styleguidist/vue-styleguidist/compare/v4.24.3...v4.25.0) (2020-06-19)

### Features

- **docgen:** allow other forms of validation ([dd2400c](https://github.com/vue-styleguidist/vue-styleguidist/commit/dd2400cbaecad10209625c2046674d037e387d93))

# [4.24.0](https://github.com/vue-styleguidist/vue-styleguidist/compare/v4.23.3...v4.24.0) (2020-05-28)

### Bug Fixes

- **docgen:** priority to documented values ([696bd87](https://github.com/vue-styleguidist/vue-styleguidist/commit/696bd873a914a4d5057f3dda27f3f9f7eaffa0a2))

### Features

- **docgen:** detect values in validator ([8d681a6](https://github.com/vue-styleguidist/vue-styleguidist/commit/8d681a66576990f2acdc265cea7f4ffa4659b14e))

## [4.23.1](https://github.com/vue-styleguidist/vue-styleguidist/compare/v4.23.0...v4.23.1) (2020-05-15)

**Note:** Version bump only for package vue-docgen-api

# [4.23.0](https://github.com/vue-styleguidist/vue-styleguidist/compare/v4.22.3...v4.23.0) (2020-05-15)

### Features

- **docgen:** allow to have more than 1 values tag ([3e84005](https://github.com/vue-styleguidist/vue-styleguidist/commit/3e840058615aea163e5ca5e8f3ab1ec9324ffd4a))

## [4.22.3](https://github.com/vue-styleguidist/vue-styleguidist/compare/v4.22.2...v4.22.3) (2020-05-12)

### Bug Fixes

- **docgen:** fix default parsing for [@type](https://github.com/type) props ([1fc4b03](https://github.com/vue-styleguidist/vue-styleguidist/commit/1fc4b03eb408f535f7bb8e85bb8037800aee2eb1)), closes [#866](https://github.com/vue-styleguidist/vue-styleguidist/issues/866)

## [4.22.2](https://github.com/vue-styleguidist/vue-styleguidist/compare/v4.22.1...v4.22.2) (2020-05-12)

### Bug Fixes

- **docgen:** error when parsing default prop ([1fe3dfe](https://github.com/vue-styleguidist/vue-styleguidist/commit/1fe3dfeeaccdf2c1d5d6b2033b0b1ac8db510103))

## [4.22.1](https://github.com/vue-styleguidist/vue-styleguidist/compare/v4.22.0...v4.22.1) (2020-05-12)

### Bug Fixes

- **docgen:** correctly extract default values ([349ad81](https://github.com/vue-styleguidist/vue-styleguidist/commit/349ad812894120e1c4816df55a427a8724b99b8c))
- avoid error when multiple return in a default ([3e4c53d](https://github.com/vue-styleguidist/vue-styleguidist/commit/3e4c53d8836c40d826c26de768e4b41e8d3b4205))
- **docgen:** object Methods should return regular functions ([79a7fa2](https://github.com/vue-styleguidist/vue-styleguidist/commit/79a7fa2271d93dc71c6651e262ea25a244ee656a))

# [4.21.0](https://github.com/vue-styleguidist/vue-styleguidist/compare/v4.20.0...v4.21.0) (2020-05-09)

### Features

- **docgen:** allow to force events definitions ([#854](https://github.com/vue-styleguidist/vue-styleguidist/issues/854)) ([7a2105c](https://github.com/vue-styleguidist/vue-styleguidist/commit/7a2105c84aa9b08d1b380ea56b698aaedad1e9e8))

# [4.20.0](https://github.com/vue-styleguidist/vue-styleguidist/compare/v4.19.5...v4.20.0) (2020-05-06)

### Features

- **docgen:** make values work for class type ([c003176](https://github.com/vue-styleguidist/vue-styleguidist/commit/c003176186616975afa72083efb22a1e4f45eb8a))
- **docgen:** record [@type](https://github.com/type) values ([452ccb5](https://github.com/vue-styleguidist/vue-styleguidist/commit/452ccb5c3a708a047183a1684201c17487cf10ec))
- **docgen:** resolve values in as types ([7648a4e](https://github.com/vue-styleguidist/vue-styleguidist/commit/7648a4e199314af25cc25183f1fd2f506da447fa))

## [4.19.2](https://github.com/vue-styleguidist/vue-styleguidist/compare/v4.19.1...v4.19.2) (2020-04-29)

### Bug Fixes

- **docgen:** allow functional render slots ([2b36e38](https://github.com/vue-styleguidist/vue-styleguidist/commit/2b36e38042fb4836eb8afb68df3ebf74cac3b8e3)), closes [#837](https://github.com/vue-styleguidist/vue-styleguidist/issues/837)
- **docgen:** scoped slots bindings can spread ([d0a939c](https://github.com/vue-styleguidist/vue-styleguidist/commit/d0a939c4edb9fdd2986a5695e9894c462be01e36)), closes [#833](https://github.com/vue-styleguidist/vue-styleguidist/issues/833)

## [4.19.1](https://github.com/vue-styleguidist/vue-styleguidist/compare/v4.19.0...v4.19.1) (2020-04-28)

**Note:** Version bump only for package vue-docgen-api

# [4.19.0](https://github.com/vue-styleguidist/vue-styleguidist/compare/v4.18.0...v4.19.0) (2020-04-24)

### Bug Fixes

- **docgen:** accept named typescript exports ([b256b17](https://github.com/vue-styleguidist/vue-styleguidist/commit/b256b174347766d31ab55fab948849037f32d930)), closes [#813](https://github.com/vue-styleguidist/vue-styleguidist/issues/813)
- tag titles are no longer filtered out ([2a91b3e](https://github.com/vue-styleguidist/vue-styleguidist/commit/2a91b3e8c9aa2d1e1596cdf7998ed1af4cddf780))

### Features

- **docgen:** deal with index as filename ([61d28f5](https://github.com/vue-styleguidist/vue-styleguidist/commit/61d28f5ba60b36a8d8af55c4366497b369d940e5))

# [4.18.0](https://github.com/vue-styleguidist/vue-styleguidist/compare/v4.17.0...v4.18.0) (2020-04-17)

### Bug Fixes

- **docgen:** fix ts array, intersection type print ([4ca38bf](https://github.com/vue-styleguidist/vue-styleguidist/commit/4ca38bf6a6e5fd39e87276332461c24ddb01cc5a))

### Features

- **docgen:** extract type values properly ([6ffd571](https://github.com/vue-styleguidist/vue-styleguidist/commit/6ffd571fe1d51048a413eb0908d873da916d3dda))

# [4.16.0](https://github.com/vue-styleguidist/vue-styleguidist/compare/v4.15.2...v4.16.0) (2020-04-09)

### Features

- Document composite components ([#815](https://github.com/vue-styleguidist/vue-styleguidist/issues/815)) ([a6a3d11](https://github.com/vue-styleguidist/vue-styleguidist/commit/a6a3d11c320a3501ea1e63acdf3108d191cc6390)), closes [#809](https://github.com/vue-styleguidist/vue-styleguidist/issues/809)

## [4.15.1](https://github.com/vue-styleguidist/vue-styleguidist/compare/v4.15.0...v4.15.1) (2020-03-30)

### Bug Fixes

- **docgen:** allow single slots to not documented ([34381d1](https://github.com/vue-styleguidist/vue-styleguidist/commit/34381d162f914f2ad94f382acb09227365ec4fc0))

# [4.15.0](https://github.com/vue-styleguidist/vue-styleguidist/compare/v4.14.0...v4.15.0) (2020-03-29)

### Bug Fixes

- **docgen:** remove TSUnionType ([2f32e5f](https://github.com/vue-styleguidist/vue-styleguidist/commit/2f32e5f4b6972610a7406d98601b7faa2ac7d354)), closes [#796](https://github.com/vue-styleguidist/vue-styleguidist/issues/796)

### Features

- **docgen:** parse the throws tag ([2f70045](https://github.com/vue-styleguidist/vue-styleguidist/commit/2f7004551ea71a2a469053ccb348f3bea21ac867))

# [4.14.0](https://github.com/vue-styleguidist/vue-styleguidist/compare/v4.13.1...v4.14.0) (2020-03-18)

### Features

- expose typescript types for theming ([3110fb5](https://github.com/vue-styleguidist/vue-styleguidist/commit/3110fb5b8342b3c89a70e9ecaf710a4c3a77bee5))

## [4.13.1](https://github.com/vue-styleguidist/vue-styleguidist/compare/v4.13.0...v4.13.1) (2020-03-03)

### Bug Fixes

- multiple exports in parse export default ([7bb82dd](https://github.com/vue-styleguidist/vue-styleguidist/commit/7bb82ddb3e8173dccc344117a4a2e50b42360639))
- sort docs when all promises are resolved ([dbaa82e](https://github.com/vue-styleguidist/vue-styleguidist/commit/dbaa82e3a08113dd0182647ea2fa3a7b2b6bfdd4))
- **docgen:** export iev var names ([c02268b](https://github.com/vue-styleguidist/vue-styleguidist/commit/c02268b31fd34f8e1cabd4f149f2e8dd30ff0ee3))
- **docgen:** handlers expressions with multiline ([8e7c66c](https://github.com/vue-styleguidist/vue-styleguidist/commit/8e7c66c62388746579ddda3753aa743b41a88c43)), closes [#772](https://github.com/vue-styleguidist/vue-styleguidist/issues/772)

# [4.12.0](https://github.com/vue-styleguidist/vue-styleguidist/compare/v4.11.0...v4.12.0) (2020-02-25)

### Bug Fixes

- **docgen:** take mixin order into account ([626337e](https://github.com/vue-styleguidist/vue-styleguidist/commit/626337ebc2bce975b16815971f73f3a6f7b7a9b8)), closes [#761](https://github.com/vue-styleguidist/vue-styleguidist/issues/761)

### Features

- detect when example file loaded twice ([e4b1a48](https://github.com/vue-styleguidist/vue-styleguidist/commit/e4b1a4808f0b175bb0a23088e139595da58b14c4))
- **docgen:** methods returned by other methods ([95e648c](https://github.com/vue-styleguidist/vue-styleguidist/commit/95e648c784773b57603e0f8ebca652a5f3a76b5d)), closes [#765](https://github.com/vue-styleguidist/vue-styleguidist/issues/765)

# [4.11.0](https://github.com/vue-styleguidist/vue-styleguidist/compare/v4.10.1...v4.11.0) (2020-02-22)

### Bug Fixes

- only show required props on default examples ([0f6bc11](https://github.com/vue-styleguidist/vue-styleguidist/commit/0f6bc1188cff5d4781bebb1ddef48d6b0f9482b2))

### Features

- give default examples a variable geometry ([535e347](https://github.com/vue-styleguidist/vue-styleguidist/commit/535e347e3970b5c48a40ac538892cffe85a89977))

# [4.9.0](https://github.com/vue-styleguidist/vue-styleguidist/compare/v4.8.1...v4.9.0) (2020-02-16)

### Bug Fixes

- stop rendering bad event properties ([26fccd9](https://github.com/vue-styleguidist/vue-styleguidist/commit/26fccd9a78aba06f0a8403a8ff3123b8a8851aba))

### Features

- origin column on props event methods & slots ([8b0650f](https://github.com/vue-styleguidist/vue-styleguidist/commit/8b0650f08d3c4cde0970fd87aabb439cd1e06ef0))

## [4.8.1](https://github.com/vue-styleguidist/vue-styleguidist/compare/v4.8.0...v4.8.1) (2020-02-13)

### Bug Fixes

- protect slots in if statements ([1d3d29e](https://github.com/vue-styleguidist/vue-styleguidist/commit/1d3d29e25ee31d6e2ffdc616247d29dadec6700f)), closes [#753](https://github.com/vue-styleguidist/vue-styleguidist/issues/753)

# [4.8.0](https://github.com/vue-styleguidist/vue-styleguidist/compare/v4.7.7...v4.8.0) (2020-02-12)

### Bug Fixes

- **docgen:** protect empty comments before slots ([6484a10](https://github.com/vue-styleguidist/vue-styleguidist/commit/6484a106b2964c5f1858171ad4ad40642a4f98b9)), closes [#749](https://github.com/vue-styleguidist/vue-styleguidist/issues/749)

### Features

- add tags to slots ([dcbddf8](https://github.com/vue-styleguidist/vue-styleguidist/commit/dcbddf82631d53422d5666ca1eb1971d828b4f04))

## [4.7.7](https://github.com/vue-styleguidist/vue-styleguidist/compare/v4.7.6...v4.7.7) (2020-02-10)

### Bug Fixes

- import of named mixins failing ([185fb22](https://github.com/vue-styleguidist/vue-styleguidist/commit/185fb229d5404ed5e26e319b499cf13b1e3a5a8a))
- **docgen:** use webpack modules when resolving paths ([6b5b87f](https://github.com/vue-styleguidist/vue-styleguidist/commit/6b5b87f65e219ce5798ac0ea044271a25d6ad086)), closes [#743](https://github.com/vue-styleguidist/vue-styleguidist/issues/743)

## [4.7.6](https://github.com/vue-styleguidist/vue-styleguidist/compare/v4.7.5...v4.7.6) (2020-01-23)

### Bug Fixes

- **docgen:** handle empty handler ([f811ed3](https://github.com/vue-styleguidist/vue-styleguidist/commit/f811ed3d6d16be36eb10071dd15381d8008e54fd)), closes [#738](https://github.com/vue-styleguidist/vue-styleguidist/issues/738)

## [4.7.5](https://github.com/vue-styleguidist/vue-styleguidist/compare/v4.7.4...v4.7.5) (2020-01-23)

### Bug Fixes

- **docgen:** filter components more clearly ([09b15e9](https://github.com/vue-styleguidist/vue-styleguidist/commit/09b15e9824dd7687ceb8bd94455c4ed5870b3214)), closes [#735](https://github.com/vue-styleguidist/vue-styleguidist/issues/735)

## [4.7.4](https://github.com/vue-styleguidist/vue-styleguidist/compare/v4.7.3...v4.7.4) (2020-01-22)

### Bug Fixes

- **docgen:** allow multi line root comment ([c6eacf7](https://github.com/vue-styleguidist/vue-styleguidist/commit/c6eacf72ffd60a21ca45248951076464264f5ea4))
- **docgen:** docs only vue components ([fcc28f6](https://github.com/vue-styleguidist/vue-styleguidist/commit/fcc28f6f330736b565bd3343422a2cc8792f8200)), closes [#731](https://github.com/vue-styleguidist/vue-styleguidist/issues/731)
- **docgen:** make events parsed in template ([e361bef](https://github.com/vue-styleguidist/vue-styleguidist/commit/e361bef34cdc78baf08f12cf69eb17069af49527))

# [4.7.0](https://github.com/vue-styleguidist/vue-styleguidist/compare/v4.6.1...v4.7.0) (2020-01-20)

### Features

- detect events in template ([327b54e](https://github.com/vue-styleguidist/vue-styleguidist/commit/327b54e5aa690aac039387cf6bb133d94c1774d9))
- parse \$emit in templates ([21d5eca](https://github.com/vue-styleguidist/vue-styleguidist/commit/21d5ecafea66a1cdc1eb58387fd19bb9cb394437)), closes [#725](https://github.com/vue-styleguidist/vue-styleguidist/issues/725)

# [4.6.0](https://github.com/vue-styleguidist/vue-styleguidist/compare/v4.5.2...v4.6.0) (2020-01-19)

### Bug Fixes

- parse should export default cmp if available ([753dea4](https://github.com/vue-styleguidist/vue-styleguidist/commit/753dea4c26a3918488b08b32bfe8b7dbea109f60))

### Features

- allow iev as valid component ([21c4874](https://github.com/vue-styleguidist/vue-styleguidist/commit/21c48740823c3fd790abd689985f0558afbb374b)), closes [#713](https://github.com/vue-styleguidist/vue-styleguidist/issues/713)

## [4.5.2](https://github.com/vue-styleguidist/vue-styleguidist/compare/v4.5.1...v4.5.2) (2020-01-17)

### Bug Fixes

- multiple exports in vue files ([56fcdd8](https://github.com/vue-styleguidist/vue-styleguidist/commit/56fcdd8f0642347f16e88dd04b2d4c7ec8aef9c6)), closes [#717](https://github.com/vue-styleguidist/vue-styleguidist/issues/717)

# [4.5.0](https://github.com/vue-styleguidist/vue-styleguidist/compare/v4.4.3...v4.5.0) (2020-01-15)

**Note:** Version bump only for package vue-docgen-api

## [4.4.3](https://github.com/vue-styleguidist/vue-styleguidist/compare/v4.4.2...v4.4.3) (2020-01-11)

**Note:** Version bump only for package vue-docgen-api

## [4.4.2](https://github.com/vue-styleguidist/vue-styleguidist/compare/v4.4.1...v4.4.2) (2020-01-10)

### Bug Fixes

- resolve immediately exported vars recursively ([7b27480](https://github.com/vue-styleguidist/vue-styleguidist/commit/7b27480b2954f9d9f9307d3ac717709cae3c3194))
- **docgen:** origin never cleared ([0dc4251](https://github.com/vue-styleguidist/vue-styleguidist/commit/0dc42513e83a46323ffb4227e4a0b5d485ca06cd))

### Performance Improvements

- avoid looking at node_modules in IEV ([55e29e3](https://github.com/vue-styleguidist/vue-styleguidist/commit/55e29e397b67bc19ebd535064d5a62fc67e690df))
- use await for reading file async ([cf254c0](https://github.com/vue-styleguidist/vue-styleguidist/commit/cf254c0c93e2a29bc78189bbd215e65cc7804e67))

# [4.4.0](https://github.com/vue-styleguidist/vue-styleguidist/compare/v4.3.0...v4.4.0) (2020-01-09)

### Bug Fixes

- resolve conflicts ([ff45137](https://github.com/vue-styleguidist/vue-styleguidist/commit/ff45137696424526575aec9aaf118b482ff6db80))
- update error management in docgen loader ([f23f267](https://github.com/vue-styleguidist/vue-styleguidist/commit/f23f267c630f9ee92742d000a4c1cfb8fe698635))

### Features

- **docgen:** add vuetify exported component ([932e2ec](https://github.com/vue-styleguidist/vue-styleguidist/commit/932e2ec6e51402db365b6de15f36762bf999184e))

# [4.3.0](https://github.com/vue-styleguidist/vue-styleguidist/compare/v4.2.3...v4.3.0) (2020-01-08)

### Features

- **docgen:** resolve pass through components ([07d183f](https://github.com/vue-styleguidist/vue-styleguidist/commit/07d183faad4bb2125bb389dcc065865d2d105dcb))

## [4.2.2](https://github.com/vue-styleguidist/vue-styleguidist/compare/v4.2.1...v4.2.2) (2019-12-18)

### Performance Improvements

- **docgen:** make sure optional prop are optional ([3695ed6](https://github.com/vue-styleguidist/vue-styleguidist/commit/3695ed6632612de3ad68794a6fd3a62dd4e46533))

# [4.2.0](https://github.com/vue-styleguidist/vue-styleguidist/compare/v4.1.2...v4.2.0) (2019-12-10)

### Features

- detect model property ([1c28167](https://github.com/vue-styleguidist/vue-styleguidist/commit/1c28167)), closes [#654](https://github.com/vue-styleguidist/vue-styleguidist/issues/654)
- **docgen:** allow to customize validExtends ([eb966c5](https://github.com/vue-styleguidist/vue-styleguidist/commit/eb966c5))

## [4.1.2](https://github.com/vue-styleguidist/vue-styleguidist/compare/v4.1.1...v4.1.2) (2019-12-08)

**Note:** Version bump only for package vue-docgen-api

## [4.1.1](https://github.com/vue-styleguidist/vue-styleguidist/compare/v4.1.0...v4.1.1) (2019-12-05)

**Note:** Version bump only for package vue-docgen-api

# [4.1.0](https://github.com/vue-styleguidist/vue-styleguidist/compare/v4.0.8...v4.1.0) (2019-12-04)

### Bug Fixes

- **docgen:** support [@values](https://github.com/values) on classPropHandler ([4b7f8b6](https://github.com/vue-styleguidist/vue-styleguidist/commit/4b7f8b6))

### Features

- **docgen:** multi-components in a file ([3790837](https://github.com/vue-styleguidist/vue-styleguidist/commit/3790837))

## [4.0.7](https://github.com/vue-styleguidist/vue-styleguidist/compare/v4.0.6...v4.0.7) (2019-12-01)

### Bug Fixes

- **docgen:** avoid incorrect of getting nested '}' param type ([5df05e0](https://github.com/vue-styleguidist/vue-styleguidist/commit/5df05e0))

## [4.0.5](https://github.com/vue-styleguidist/vue-styleguidist/compare/v4.0.4...v4.0.5) (2019-11-20)

### Bug Fixes

- **docgen:** ensure custom handlers are actually run ([7a0ac62](https://github.com/vue-styleguidist/vue-styleguidist/commit/7a0ac62))

## [4.0.4](https://github.com/vue-styleguidist/vue-styleguidist/compare/v4.0.3...v4.0.4) (2019-11-19)

### Bug Fixes

- **docgen:** fixed description extraction on non-SFC components ([85626fc](https://github.com/vue-styleguidist/vue-styleguidist/commit/85626fc))

## [4.0.1](https://github.com/vue-styleguidist/vue-styleguidist/compare/v4.0.0...v4.0.1) (2019-11-15)

**Note:** Version bump only for package vue-docgen-api

# [4.0.0-beta.20](https://github.com/vue-styleguidist/vue-styleguidist/compare/v4.0.0-beta.19...v4.0.0-beta.20) (2019-11-15)

**Note:** Version bump only for package vue-docgen-api

# [4.0.0-beta.17](https://github.com/vue-styleguidist/vue-styleguidist/compare/v4.0.0-beta.16...v4.0.0-beta.17) (2019-11-14)

### Features

- **docgen:** refactor bindings ([b501f82](https://github.com/vue-styleguidist/vue-styleguidist/commit/b501f82))
- use bindings comments in styleguidist ([4fb6551](https://github.com/vue-styleguidist/vue-styleguidist/commit/4fb6551))

# [4.0.0-beta.15](https://github.com/vue-styleguidist/vue-styleguidist/compare/v4.0.0-beta.14...v4.0.0-beta.15) (2019-11-13)

### Bug Fixes

- **docgen:** avoid setting exportName to deps ([230e1e3](https://github.com/vue-styleguidist/vue-styleguidist/commit/230e1e3))

### Features

- use [@values](https://github.com/values) tag in props ([cb2fc74](https://github.com/vue-styleguidist/vue-styleguidist/commit/cb2fc74)), closes [#345](https://github.com/vue-styleguidist/vue-styleguidist/issues/345)
- **docgen:** accept more tags for event params ([cc55f58](https://github.com/vue-styleguidist/vue-styleguidist/commit/cc55f58))
- **docgen:** add exportName to CompoentDoc ([9466105](https://github.com/vue-styleguidist/vue-styleguidist/commit/9466105))

# [4.0.0-beta.12](https://github.com/vue-styleguidist/vue-styleguidist/compare/v4.0.0-beta.11...v4.0.0-beta.12) (2019-11-06)

### Features

- **cli:** expose docgen-cli config interfaces ([25f0744](https://github.com/vue-styleguidist/vue-styleguidist/commit/25f0744))

# [4.0.0-beta.10](https://github.com/vue-styleguidist/vue-styleguidist/compare/v4.0.0-beta.9...v4.0.0-beta.10) (2019-10-30)

**Note:** Version bump only for package vue-docgen-api

# [4.0.0-beta.8](https://github.com/vue-styleguidist/vue-styleguidist/compare/v4.0.0-beta.7...v4.0.0-beta.8) (2019-10-28)

### Bug Fixes

- **docgen:** avoid outputing empty array ([51d42bf](https://github.com/vue-styleguidist/vue-styleguidist/commit/51d42bf))

### Features

- emit types for vue-styleguidist ([f0af958](https://github.com/vue-styleguidist/vue-styleguidist/commit/f0af958))

# [4.0.0-beta.7](https://github.com/vue-styleguidist/vue-styleguidist/compare/v4.0.0-beta.6...v4.0.0-beta.7) (2019-10-25)

**Note:** Version bump only for package vue-docgen-api

# [4.0.0-beta.6](https://github.com/vue-styleguidist/vue-styleguidist/compare/v4.0.0-beta.5...v4.0.0-beta.6) (2019-10-24)

**Note:** Version bump only for package vue-docgen-api

# [4.0.0-beta.5](https://github.com/vue-styleguidist/vue-styleguidist/compare/v4.0.0-beta.4...v4.0.0-beta.5) (2019-10-24)

**Note:** Version bump only for package vue-docgen-api

# [4.0.0-beta.3](https://github.com/vue-styleguidist/vue-styleguidist/compare/v3.25.1-beta.1...v4.0.0-beta.3) (2019-10-24)

**Note:** Version bump only for package vue-docgen-api

# [4.0.0-beta.1](https://github.com/vue-styleguidist/vue-styleguidist/compare/v3.25.1-beta.1...v4.0.0-beta.1) (2019-10-23)

**Note:** Version bump only for package vue-docgen-api

## [3.25.1-beta.1](https://github.com/vue-styleguidist/vue-styleguidist/compare/v3.25.1-beta.0...v3.25.1-beta.1) (2019-10-23)

### Bug Fixes

- **docgen:** make docgen output arrays only ([d456c6c](https://github.com/vue-styleguidist/vue-styleguidist/commit/d456c6c))

### Code Refactoring

- **docgen:** make function docgen.parse async ([e17680b](https://github.com/vue-styleguidist/vue-styleguidist/commit/e17680b))
- **docgen:** make required always a boolean ([03bc88e](https://github.com/vue-styleguidist/vue-styleguidist/commit/03bc88e))

### BREAKING CHANGES

- **docgen:** props, events, methods and slots are now all arrays

Co-authored-by: Sébastien D. <demsking@gmail.com>

- **docgen:** required for props is never a string anymore
- **docgen:** docgen becomes async, so do all of the handlers

## [3.25.1-beta.0](https://github.com/vue-styleguidist/vue-styleguidist/compare/v3.25.0...v3.25.1-beta.0) (2019-10-23)

# [3.26.0](https://github.com/vue-styleguidist/vue-styleguidist/compare/v3.25.0...v3.26.0) (2019-10-25)

### Bug Fixes

- **docgen:** allow for multiple times the same tag ([68a0204](https://github.com/vue-styleguidist/vue-styleguidist/commit/68a0204))

# [3.25.0](https://github.com/vue-styleguidist/vue-styleguidist/compare/v3.24.2...v3.25.0) (2019-10-15)

### Features

- **docgen:** add origin to documentation object ([31e2fe2](https://github.com/vue-styleguidist/vue-styleguidist/commit/31e2fe2)), closes [#594](https://github.com/vue-styleguidist/vue-styleguidist/issues/594)
- **docgen:** allow wrap export in if ([5744801](https://github.com/vue-styleguidist/vue-styleguidist/commit/5744801))

## [3.24.2](https://github.com/vue-styleguidist/vue-styleguidist/compare/v3.24.1...v3.24.2) (2019-09-26)

### Bug Fixes

- **docgen:** detetct scopedSlots in render() ([5e7015d](https://github.com/vue-styleguidist/vue-styleguidist/commit/5e7015d)), closes [#586](https://github.com/vue-styleguidist/vue-styleguidist/issues/586)

## [3.24.1](https://github.com/vue-styleguidist/vue-styleguidist/compare/v3.24.0...v3.24.1) (2019-09-26)

### Bug Fixes

- **docgen:** allow default to be a method ([40ec2ae](https://github.com/vue-styleguidist/vue-styleguidist/commit/40ec2ae))

## [3.23.1](https://github.com/vue-styleguidist/vue-styleguidist/compare/v3.23.0...v3.23.1) (2019-09-20)

### Bug Fixes

- **docgen:** allow default to be a string key ([1fa756f](https://github.com/vue-styleguidist/vue-styleguidist/commit/1fa756f)), closes [#581](https://github.com/vue-styleguidist/vue-styleguidist/issues/581)
- extend quoting to methods and props ([10e2b3e](https://github.com/vue-styleguidist/vue-styleguidist/commit/10e2b3e))

## [3.22.3](https://github.com/vue-styleguidist/vue-styleguidist/compare/v3.22.2...v3.22.3) (2019-09-12)

### Bug Fixes

- look at statements for description ([71969bf](https://github.com/vue-styleguidist/vue-styleguidist/commit/71969bf))

# [3.22.0](https://github.com/vue-styleguidist/vue-styleguidist/compare/v3.21.0...v3.22.0) (2019-08-19)

### Features

- **docgen:** class event [@emit](https://github.com/emit) ([4483168](https://github.com/vue-styleguidist/vue-styleguidist/commit/4483168)), closes [#305](https://github.com/vue-styleguidist/vue-styleguidist/issues/305)

# [3.20.0](https://github.com/vue-styleguidist/vue-styleguidist/compare/v3.19.5...v3.20.0) (2019-08-10)

### Features

- **docgen:** expose docs block in dogen-api ([4565559](https://github.com/vue-styleguidist/vue-styleguidist/commit/4565559))

## [3.19.5](https://github.com/vue-styleguidist/vue-styleguidist/compare/v3.19.4...v3.19.5) (2019-08-07)

**Note:** Version bump only for package vue-docgen-api

## [3.19.3](https://github.com/vue-styleguidist/vue-styleguidist/compare/v3.19.2...v3.19.3) (2019-08-06)

**Note:** Version bump only for package vue-docgen-api

# [3.17.0](https://github.com/vue-styleguidist/vue-styleguidist/compare/v3.16.3...v3.17.0) (2019-07-23)

### Bug Fixes

- **docgen:** allow document scopedSlots in render ([31a7e07](https://github.com/vue-styleguidist/vue-styleguidist/commit/31a7e07)), closes [#174](https://github.com/vue-styleguidist/vue-styleguidist/issues/174)

## [3.16.3](https://github.com/vue-styleguidist/vue-styleguidist/compare/v3.16.2...v3.16.3) (2019-07-19)

### Bug Fixes

- slot scoped parsing ([9685ba2](https://github.com/vue-styleguidist/vue-styleguidist/commit/9685ba2))

# [3.16.0](https://github.com/vue-styleguidist/vue-styleguidist/compare/v3.15.4...v3.16.0) (2019-07-15)

### Bug Fixes

- **docgen:** allow for v-model in functional components ([8884e62](https://github.com/vue-styleguidist/vue-styleguidist/commit/8884e62)), closes [#493](https://github.com/vue-styleguidist/vue-styleguidist/issues/493)

## [3.15.4](https://github.com/vue-styleguidist/vue-styleguidist/compare/v3.15.3...v3.15.4) (2019-07-07)

### Bug Fixes

- allow importing non component files ([5aa59a6](https://github.com/vue-styleguidist/vue-styleguidist/commit/5aa59a6)), closes [#436](https://github.com/vue-styleguidist/vue-styleguidist/issues/436)
- transform error into warning when NOENT ([296e1cd](https://github.com/vue-styleguidist/vue-styleguidist/commit/296e1cd))
- **docgen:** avoid parse files that are'nt potential components ([4b1e43b](https://github.com/vue-styleguidist/vue-styleguidist/commit/4b1e43b)), closes [#436](https://github.com/vue-styleguidist/vue-styleguidist/issues/436)
- **docgen:** resolve es6 modules properly ([1b4eb0a](https://github.com/vue-styleguidist/vue-styleguidist/commit/1b4eb0a)), closes [#478](https://github.com/vue-styleguidist/vue-styleguidist/issues/478)

## [3.15.3](https://github.com/vue-styleguidist/vue-styleguidist/compare/v3.15.2...v3.15.3) (2019-07-02)

### Bug Fixes

- **docgen:** make aliases only path parts instead of letters ([b83e235](https://github.com/vue-styleguidist/vue-styleguidist/commit/b83e235)), closes [#478](https://github.com/vue-styleguidist/vue-styleguidist/issues/478)

## [3.15.2](https://github.com/vue-styleguidist/vue-styleguidist/compare/v3.15.1...v3.15.2) (2019-07-02)

### Bug Fixes

- add simple bindings detection ([31a3fca](https://github.com/vue-styleguidist/vue-styleguidist/commit/31a3fca))
- make (Vue as VueConstructor<Vue>) resolved ([b7ed624](https://github.com/vue-styleguidist/vue-styleguidist/commit/b7ed624))
- **docgen:** adapt method handler to default params ([4f67f4e](https://github.com/vue-styleguidist/vue-styleguidist/commit/4f67f4e)), closes [#476](https://github.com/vue-styleguidist/vue-styleguidist/issues/476)
- **docgen:** make v-bind have a separate treatment ([cee2a9b](https://github.com/vue-styleguidist/vue-styleguidist/commit/cee2a9b)), closes [#469](https://github.com/vue-styleguidist/vue-styleguidist/issues/469)

# [3.15.0](https://github.com/vue-styleguidist/vue-styleguidist/compare/v3.14.5...v3.15.0) (2019-06-19)

### Bug Fixes

- **docgen:** fix template parsing expressions ([56a2e05](https://github.com/vue-styleguidist/vue-styleguidist/commit/56a2e05))

### Features

- **docgen:** add external proptypes parsing for docgen ([eaa4748](https://github.com/vue-styleguidist/vue-styleguidist/commit/eaa4748)), closes [#465](https://github.com/vue-styleguidist/vue-styleguidist/issues/465)
- **docgen:** support ts prop types ([c57c243](https://github.com/vue-styleguidist/vue-styleguidist/commit/c57c243)), closes [#413](https://github.com/vue-styleguidist/vue-styleguidist/issues/413)

## [3.14.5](https://github.com/vue-styleguidist/vue-styleguidist/compare/v3.14.4...v3.14.5) (2019-06-14)

### Bug Fixes

- **docgen:** fixed multiple use of same event needing desc ([329f66a](https://github.com/vue-styleguidist/vue-styleguidist/commit/329f66a)), closes [#459](https://github.com/vue-styleguidist/vue-styleguidist/issues/459)

## [3.14.4](https://github.com/vue-styleguidist/vue-styleguidist/compare/v3.14.3...v3.14.4) (2019-06-14)

### Bug Fixes

- update dependencies to re-enable HMR ([860e3bc](https://github.com/vue-styleguidist/vue-styleguidist/commit/860e3bc))
- **docgen:** get slot and scoped slot description in render without JSX ([33086cf](https://github.com/vue-styleguidist/vue-styleguidist/commit/33086cf))

## [3.13.8](https://github.com/vue-styleguidist/vue-styleguidist/compare/v3.13.7...v3.13.8) (2019-05-29)

**Note:** Version bump only for package vue-docgen-api

## [3.13.5](https://github.com/vue-styleguidist/vue-styleguidist/compare/v3.13.4...v3.13.5) (2019-05-22)

### Bug Fixes

- Additionally try absolute require.resolve in resolvePathFrom ([d1be583](https://github.com/vue-styleguidist/vue-styleguidist/commit/d1be583))
- Look through all roots. ([3641e4c](https://github.com/vue-styleguidist/vue-styleguidist/commit/3641e4c))

## [3.13.4](https://github.com/vue-styleguidist/vue-styleguidist/compare/v3.13.3...v3.13.4) (2019-05-15)

### Bug Fixes

- **docgen:** fix node_modules mixins parsing ([a4eed84](https://github.com/vue-styleguidist/vue-styleguidist/commit/a4eed84)), closes [#416](https://github.com/vue-styleguidist/vue-styleguidist/issues/416)
- make sure node_module resolved path ignored ([7a1092a](https://github.com/vue-styleguidist/vue-styleguidist/commit/7a1092a))

# [3.12.0](https://github.com/vue-styleguidist/vue-styleguidist/compare/v3.11.7...v3.12.0) (2019-04-25)

### Bug Fixes

- **docgen:** allow for not parsing jsx ([8b669f3](https://github.com/vue-styleguidist/vue-styleguidist/commit/8b669f3))
- **docgen:** give better error message lines ([9b04cc4](https://github.com/vue-styleguidist/vue-styleguidist/commit/9b04cc4))

### Features

- **docgen:** add jsx option to docgen ([0ce2a9e](https://github.com/vue-styleguidist/vue-styleguidist/commit/0ce2a9e))

## [3.11.6](https://github.com/vue-styleguidist/vue-styleguidist/compare/v3.11.5...v3.11.6) (2019-04-23)

### Bug Fixes

- make [@arg](https://github.com/arg) and [@argument](https://github.com/argument) accepted ([1b0ddca](https://github.com/vue-styleguidist/vue-styleguidist/commit/1b0ddca))
- **docgen:** update method for unpassing tests ([4f5c6cd](https://github.com/vue-styleguidist/vue-styleguidist/commit/4f5c6cd))

## [3.11.4](https://github.com/vue-styleguidist/vue-styleguidist/compare/v3.11.3...v3.11.4) (2019-04-03)

### Bug Fixes

- add vue-class-component management ([#371](https://github.com/vue-styleguidist/vue-styleguidist/issues/371)) ([d1aced1](https://github.com/vue-styleguidist/vue-styleguidist/commit/d1aced1))

## [3.11.3](https://github.com/vue-styleguidist/vue-styleguidist/compare/v3.11.2...v3.11.3) (2019-04-01)

### Bug Fixes

- **docgen:** protect uresolved events ([09d970f](https://github.com/vue-styleguidist/vue-styleguidist/commit/09d970f)), closes [#363](https://github.com/vue-styleguidist/vue-styleguidist/issues/363)

## [3.11.2](https://github.com/vue-styleguidist/vue-styleguidist/compare/v3.11.1...v3.11.2) (2019-03-28)

**Note:** Version bump only for package vue-docgen-api

## [3.11.1](https://github.com/vue-styleguidist/vue-styleguidist/compare/v3.11.0...v3.11.1) (2019-03-28)

### Bug Fixes

- **docgen:** make displayName tag work ([#358](https://github.com/vue-styleguidist/vue-styleguidist/issues/358)) ([c3e12ce](https://github.com/vue-styleguidist/vue-styleguidist/commit/c3e12ce)), closes [#357](https://github.com/vue-styleguidist/vue-styleguidist/issues/357)

# [3.11.0](https://github.com/vue-styleguidist/vue-styleguidist/compare/v3.10.2...v3.11.0) (2019-03-26)

**Note:** Version bump only for package vue-docgen-api
