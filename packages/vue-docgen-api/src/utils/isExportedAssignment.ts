import * as bt from '@babel/types'
import { NodePath } from 'ast-types'

/**
 * true if the left part of the expression of the NodePath is of form `exports.foo = ...;` or
 * `modules.exports = ...;`.
 */
export default function isExportedAssignment(path: NodePath): boolean {
  if (bt.isExpressionStatement(path.node)) {
    path = path.get('expression')
  }

  if (!bt.isAssignmentExpression(path.node)) {
    return false
  }
  const pathLeft = path.get('left')
  const isSimpleExports = bt.isIdentifier(pathLeft.node) && pathLeft.node.name === 'exports'

  // check if we are looking at obj.member = value`
  let isModuleExports = false
  if (!isSimpleExports && !bt.isMemberExpression(pathLeft.node)) {
    return false
  } else if (bt.isMemberExpression(pathLeft.node)) {
    const leftObject = pathLeft.get('object')
    const leftProp = pathLeft.get('property')
    isModuleExports =
      !Array.isArray(leftProp) &&
      bt.isIdentifier(leftProp.node) &&
      bt.isIdentifier(leftObject.node) &&
      // if exports.xx =
      (leftObject.node.name === 'exports' ||
        // if module.exports =
        (leftObject.node.name === 'module' && leftProp.node.name === 'exports'))
  }

  return isSimpleExports || isModuleExports
}
