describe('Preview render', () => {
	before(() => {
		// Open simple button component in isolation
		cy.visit('/')
	})

	describe('preview redered', () => {
		const texts = ['Next Dog Name', 'Next Dog Name', 'test', 'test', 'text']
		texts.forEach((text, i) => {
			it(`item ${i + 1} : ${text}`, () => {
				if (text.length) {
					cy.get('[class^="rsg--preview-"]')
						.eq(i)
						.should('contain', text)
				}
			})
		})
	})
})
