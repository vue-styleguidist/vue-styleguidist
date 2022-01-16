import classDisplayNameHandler from './classDisplayNameHandler'
import classMethodHandler from './classMethodHandler'
import classPropHandler from './classPropHandler'
import classEventHandler from './classEventHandler'
import componentHandler from './componentHandler'
import displayNameHandler from './displayNameHandler'
import eventHandler from './eventHandler'
import extendsHandler from './extendsHandler'
import methodHandler from './methodHandler'
import mixinsHandler from './mixinsHandler'
import propHandler from './propHandler'
import slotHandler from './slotHandler'
import slotHandlerFunctional from './slotHandlerFunctional'
import slotHandlerLitteral from './slotHandlerLitteral'
import { Handler } from '../parse-script'
import setupEventHandler from './setupEventHandler'
import setupPropHandler from './setupPropHandler'
import setupExposedHandler from './setupExposedHandler'

export {
	classDisplayNameHandler,
	classMethodHandler,
	classPropHandler,
	classEventHandler,
	componentHandler,
	displayNameHandler,
	eventHandler,
	extendsHandler,
	methodHandler,
	mixinsHandler,
	propHandler,
	slotHandler,
	slotHandlerFunctional,
	slotHandlerLitteral
}

const defaultHandlers: Handler[] = [
	displayNameHandler,
	componentHandler,
	methodHandler,
	propHandler,
	eventHandler,
	slotHandler,
	slotHandlerFunctional,
	slotHandlerLitteral,
	classDisplayNameHandler,
	classMethodHandler,
	classPropHandler,
	classEventHandler
]

export const setupHandlers: Handler[] = [setupPropHandler, setupEventHandler, setupExposedHandler]

export const preHandlers: Handler[] = [
	// have to be first if they can be overridden
	extendsHandler,
	// have to be second as they can be overridden too
	mixinsHandler
]

export default defaultHandlers
