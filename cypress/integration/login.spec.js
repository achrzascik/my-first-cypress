/*
 * @LastEditors: achrzascik
 * @DateCreated: 9.05.2022
 * @LastEditTime: 12.05.2022
 * @Description: basic UI login
 **/

describe('Login to designmodo app', () => {
    beforeEach(() => {
        cy.visit( `${Cypress.env('baseURL')}/my-account/sign-in/`)
        cy.get('[data-dialog-id=dm-accept-cookies] [data-dialog-action=close]').click()
      })
      it('Check labels and buttons', () => {
          cy.get('.label-title').contains("Your Email").should('be.visible')
          cy.get('.label-title').contains("Password").should('be.visible')
          cy.get('.button').contains('Create Account').should('be.visible')
          cy.get('.button').contains('Login').should('be.visible')
      })
      it('should not login to app if username is incorrect and password is correct', () => {
          cy.login('username@a.aa', Cypress.env('designmodoPassword'))
          cy.url().should('equal', `${Cypress.env('baseURL')}/my-account/sign-in/`)
          cy.contains("Incorrect username or password").should('be.visible')
      })
      it('should not login to app if username is correct and password is incorrect', () => {
          cy.login(Cypress.env('designmodoUsername'), 'password')
          cy.url().should('equal', `${Cypress.env('baseURL')}/my-account/sign-in/`)
          cy.contains("Incorrect username or password").should('be.visible')
      })
      it('should not login to app if username and password are incorrect', () => {
          cy.login('username@a.aa', 'password')
          cy.url().should('equal', `${Cypress.env('baseURL')}/my-account/sign-in/`)
          cy.contains("Incorrect username or password").should('be.visible')
      })
    it('should login to app if username and password are correct', () => {
        cy.login(Cypress.env('designmodoUsername'), Cypress.env('designmodoPassword'))
        cy.url().should('equal', `${Cypress.env('baseURL')}/my-account/`)
    })
})