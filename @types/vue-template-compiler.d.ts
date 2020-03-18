/**
 * augment the original types with the needed comments
 */
import 'vue-template-compiler'

declare module 'vue-template-compiler' {
	interface CompilerOptions {
		comments?: boolean
		optimize?: boolean
	}
}
