/* eslint-disable jest/expect-expect */
describe('Preview render', () => {
	before(() => {
		// Open simple button component in isolation
		cy.visit('/')
	})

	describe('preview updates', () => {
		it('changes the render after code change', () => {
			const codeToSkip = '</app-button>'
			cy.get('@container')
				.find('textarea')
				.type(`${'{leftarrow}'.repeat(codeToSkip.length)} Harder`, {
					force: true
				})

			// Wait for CodeMirror to update
			cy.wait(1000)

			cy.get('@preview').find('button').should('contain', 'Push Me Harder')
		})
	})
})
