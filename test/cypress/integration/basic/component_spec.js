/* eslint-disable jest/expect-expect */
describe('Single component', () => {
	before(() => {
		// Open simple button component in isolation
		cy.visit('/#!/Best Button/1')
	})

	describe('props, methods, events & slots section', () => {
		beforeEach(() => {
			cy.get('button').contains('Props, methods, events & slots').as('propsBtn')

			cy.get('@propsBtn').closest('[class^=rsg--tabs]').as('container')
		})

		it('is present', () => {
			cy.get('@propsBtn').should('exist')
		})

		it('does not show table initially', () => {
			cy.get('@container').find('table').should('not.exist')
		})

		it('shows the table on button click', () => {
			cy.get('@propsBtn').click()
			cy.get('@container').find('table').should('contain', 'Prop name')
		})
	})

	describe('preview section', () => {
		beforeEach(() => {
			cy.get('[class^=rsg--preview]')
				.as('preview')
				.closest('[class^=rsg--root]')
				.as('container')
				.find('button')
				.contains('View Code')
				.as('viewCodeBtn')
		})

		it('renders component preview', () => {
			cy.get('@preview').find('button', { timeout: 10000 }).contains('Push Me').should('exist')
		})

		it('has view code button', () => {
			cy.get('@viewCodeBtn').should('exist')
		})

		it('does not show code initially', () => {
			cy.get('@container').find('textarea').should('not.exist')
		})

		it('shows code on click', () => {
			cy.get('@viewCodeBtn').click()
			cy.get('@container').find('textarea').should('exist')
		})

		it('changes the render after code change', () => {
			const codeToSkip = '</BestButton>'
			cy.get('@container')
				.find('textarea')
				.type(`${'{leftarrow}'.repeat(codeToSkip.length)} Harder`, {
					force: true
				})

			// Wait for CodeMirror to update
			cy.wait(1000)

			cy.get('@preview').find('button').contains('Push Me Harder').should('exist')
		})
	})
})
