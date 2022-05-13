describe('TAM tests', () => {
    it('Login to TAM app', () => {
        cy.visit('https://teamsallocationmanager.z16.web.core.windows.net/')
        //cy.url().should('include', 'https://login.microsoftonline.com/')
        //cy.contains('Zaloguj').should('be.visible')
        //cy.get('[id^=i0116]').type('achrzascik@future-processing.com')
    })
})