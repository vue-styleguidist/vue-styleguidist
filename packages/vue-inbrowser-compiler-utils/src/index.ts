export {
	Vue2,
	isVue3,
	compileScript,
	createApp,
	h,
	compileTemplate,
  App
} from 'vue-inbrowser-compiler-demi'
export {
  cleanName,
  addScopedStyle,
  parseComponent,
  isCodeVueSfc,
  getDefaultExample,
  EvaluableComponent,
} from 'vue-inbrowser-compiler-independent-utils'
export { default as adaptCreateElement, concatenate } from './adaptCreateElement'
export * from './compileTemplateForEval'
