describe('Preview render', () => {
	beforeEach(() => {
		// Open simple button component in isolation
		cy.visit('/')
	})

	describe('preview updates', () => {
		it('changes the render after code change', () => {
			const codeToSkip = '</app-button>'
      // Here the textarea is not completely visible, so we need to force 
      // the typing to avoid cypress crashing.
			// eslint-disable-next-line cypress/no-force
			cy.get('@container')
				.find('textarea')
				.type(`${'{leftarrow}'.repeat(codeToSkip.length)} Harder`, {
					force: true
				})

			cy.get('@preview').contains('button', 'Push Me Harder').should('exist')
		})
	})
})
