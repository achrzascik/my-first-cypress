// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
Cypress.Commands.add('login', (username, password) => { 
    cy.get('#username').clear().type(username)
    cy.get('#password').clear().type(password)
    cy.get('.checkbox').contains('Remember me').click()
    cy.get('.checkbox').contains('I agree to storage of my data according to').click()
    cy.get('.button').contains('Login').click()
 })

Cypress.Commands.add('getReservationForEmployee', () => {
    return cy.request({
        method: 'GET',
        form: true,
        url: "/api/HotDesk/GetActiveReservationsForEmployee/" + Cypress.env('employeeId'),
        headers: {
            'X-ZUMO-AUTH': Cypress.env('X-ZUMO-AUTH'),
            'X-MS-TOKEN-AAD-ACCESS-TOKEN': Cypress.env('X-MS-TOKEN-AAD-ACCESS-TOKEN'),
            body: null
        }
    })
})

Cypress.Commands.add('getReservationForDesk', () => {
    return cy.request({
        method: 'GET',
        form: true,
        url: "/api/HotDesk/GetActiveReservationsForDesk/" + Cypress.env('deskId'),
        headers: {
            'X-ZUMO-AUTH': Cypress.env('X-ZUMO-AUTH'),
            'X-MS-TOKEN-AAD-ACCESS-TOKEN': Cypress.env('X-MS-TOKEN-AAD-ACCESS-TOKEN'),
            body: null
        }
    })
})

Cypress.Commands.add('deleteReservation',(reservationHotDeskId) =>{
    return cy.request({
        method: 'DELETE',
        url: "api/HotDesk/" + reservationHotDeskId,
        headers: {
            'X-ZUMO-AUTH': Cypress.env('X-ZUMO-AUTH'),
            'X-MS-TOKEN-AAD-ACCESS-TOKEN': Cypress.env('X-MS-TOKEN-AAD-ACCESS-TOKEN'),
        }
    })
})


Cypress.Commands.add('getExternalCompaniesEmployees', () => {
    return cy.request({
        method: 'GET',
        form: true,
        url: "/api/Project/" + (Cypress.env('companyId')),
        headers: {
            'X-ZUMO-AUTH': Cypress.env('X-ZUMO-AUTH'),
            'X-MS-TOKEN-AAD-ACCESS-TOKEN': Cypress.env('X-MS-TOKEN-AAD-ACCESS-TOKEN'),
            body: null
        },
    })
})


//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
