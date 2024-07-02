it('should visit the page without js error', () => {
	cy.visit('/')
	cy.get('h1').should('exist')
})
