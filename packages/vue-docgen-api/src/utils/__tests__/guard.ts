import {
	isCommentNode,
	isBaseElementNode,
	isDirectiveNode,
	isAttributeNode,
	isExpressionNode,
	isCompoundExpressionNode,
	isInterpolationNode
} from '../guards'

describe('guards', () => {
	it('should return false when null', () => {
		expect(isCommentNode({})).toBeFalsy()
		expect(isBaseElementNode()).toBeFalsy()
		expect(isDirectiveNode()).toBeFalsy()
		expect(isAttributeNode()).toBeFalsy()
		expect(isExpressionNode()).toBeFalsy()
		expect(isCompoundExpressionNode()).toBeFalsy()
		expect(isInterpolationNode()).toBeFalsy()
	})
})
