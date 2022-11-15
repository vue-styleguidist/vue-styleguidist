export {
	Vue2,
	isVue3,
	compileScript,
	createApp,
	h,
  parseComponent,
	compileTemplate,
  App
} from 'vue-inbrowser-compiler-demi'
export {
  cleanName,
  addScopedStyle,
  getDefaultExample,
  EvaluableComponent,
  transformOneImport,
} from 'vue-inbrowser-compiler-independent-utils'
export { default as adaptCreateElement, concatenate } from './adaptCreateElement'
export { default as isCodeVueSfc } from './isCodeVueSfc'
export * from './compileTemplateForEval'
