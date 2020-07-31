const IMG = '<img />'
const BTN = '<button />'

describe('Preview render', () => {
	const texts = [
		'Push Me',
		'Click Me',
		'Push Me',
		'Next Dog Name',
		'Count: 42',
		'transparent!',
		'Reset',
		'option 1',
		'Fire example event!',
		'Push Me',
		'In the docs block',
		'Fire example event!',
		'Open',
		'1',
		'Open Modal',
		IMG,
		IMG,
		'Default Example Usage',
		'',
		'world',
		'Medor',
		BTN,
		BTN,
		'Second item'
	]

	before(() => {
		// Open simple button component in isolation
		cy.visit('/')
	})

	describe('check text', () => {
		texts.forEach((text, i) => {
			it(`item ${i + 1} : ${text}`, () => {
				if (text.length && text !== BTN && text !== IMG) {
					cy.get('[class^="rsg--preview-"]').eq(i).should('contain', text)
				}
			})
		})
	})

	describe('other items', () => {
		it('image items', () => {
			texts.forEach((t, i) => {
				if (t === IMG) {
					cy.get('[class^="rsg--preview-"]').eq(i).find('img').should('exist')
				}
			})
		})

		it('random buttons', () => {
			texts.forEach((t, i) => {
				if (t === BTN) {
					cy.get('[class^="rsg--preview-"]').eq(i).find('button').should('exist')
				}
			})
		})
	})

	describe('extra classes', () => {
		it('should add extra class to "I’m transparent!"', () => {
			cy.get('button')
				.contains('I’m transparent!')
				.parents('[class^="rsg--preview-"]')
				.should('have.class', 'checks')
		})
	})
})
