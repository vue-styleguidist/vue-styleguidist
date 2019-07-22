describe('make sure that top level not executed', () => {
	before(() => {
		// Open simple button component in isolation
		cy.visit('/')
	})

	it('invalid class', () => {
		cy.get('[class^="invalid_class"]').should('exist')
	})
})
