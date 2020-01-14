describe('Preview render', () => {
	before(() => {
		// Open simple button component in isolation
		cy.visit('/')
	})

	describe('check text', () => {
		const texts = [
			'Push Me',
			'Click Me',
			'Push Me',
			'Next Dog Name',
			'Count: 42',
			'transparent!',
			'Reset',
			'Push Me',
			'In the docs block',
			'Fire example event!',
			'Open',
			'1',
			'Open Modal',
			'',
			'',
			'Default Example Usage',
			'',
			'world',
			'Medor',
			'',
			'',
			'Second item'
		]

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

	describe('other items', () => {
		it('image items', () => {
			cy.get('[class^="rsg--preview-"]')
				.eq(13)
				.find('img')
				.should('exist')

			cy.get('[class^="rsg--preview-"]')
				.eq(14)
				.find('img')
				.should('exist')
		})

		it('random buttons', () => {
			cy.get('[class^="rsg--preview-"]')
				.eq(15)
				.find('button')
				.should('exist')

			cy.get('[class^="rsg--preview-"]')
				.eq(19)
				.find('button')
				.should('exist')
		})
	})
})
