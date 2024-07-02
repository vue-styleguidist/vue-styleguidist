it('should visit the page without js error', () => {
	cy.visit('/')
	cy.get('body').should('exist')
})
