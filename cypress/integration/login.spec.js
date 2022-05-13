/*
 * @LastEditors: achrzascik
 * @DateCreated: 9.05.2022
 * @LastEditTime: 12.05.2022
 * @Description: basic UI login
 **/

describe('Login to designmodo app', () => {
    beforeEach(() => {
        cy.visit(Cypress.env('baseURL')+'/my-account/sign-in/')
        cy.get('[data-dialog-id=dm-accept-cookies] [data-dialog-action=close]').click()
      })
    it('Check labels and buttons', () => {
        cy.get('.label-title').contains("Your Email").should('be.visible')
        cy.get('.label-title').contains("Password").should('be.visible')
        cy.get('.button').contains('Create Account').should('be.visible')
        cy.get('.button').contains('Login').should('be.visible')
    })
    it('should login to app if username and password are correct', () => {
        cy.get('#username').type(Cypress.env('username'))
        cy.get('#password').type(Cypress.env('password'))
        cy.get('.checkbox').contains('Remember me').click()
        cy.get('.checkbox').contains('I agree to storage of my data according to').click()
        cy.get('.button').contains('Login').click()
        cy.url().should('equal', Cypress.env('baseURL')+'/my-account/')
    })
    it('should not login to app if username is incorrect and password is correct', () => {
        cy.get('#username').type('username@a.aa')
        cy.get('#password').type(Cypress.env('password'))
        cy.get('.checkbox').contains('Remember me').click()
        cy.get('.checkbox').contains('I agree to storage of my data according to').click()
        cy.get('.button').contains('Login').click()
        cy.url().should('equal', Cypress.env('baseURL')+'/my-account/sign-in/')
        cy.contains("Incorrect username or password").should('be.visible')
    })
    it('should not login to app if username is correct and password is incorrect', () => {
        cy.get('#username').type(Cypress.env('username'))
        cy.get('#password').type('password')
        cy.get('.checkbox').contains('Remember me').click()
        cy.get('.checkbox').contains('I agree to storage of my data according to').click()
        cy.get('.button').contains('Login').click()
        cy.url().should('equal', Cypress.env('baseURL')+'/my-account/sign-in/')
        cy.contains("Incorrect username or password").should('be.visible')
    })
    it('should not login to app if username and password are incorrect', () => {
        cy.get('#username').type('username@a.aa')
        cy.get('#password').type('password')
        cy.get('.checkbox').contains('Remember me').click()
        cy.get('.checkbox').contains('I agree to storage of my data according to').click()
        cy.get('.button').contains('Login').click()
        cy.url().should('equal', Cypress.env('baseURL')+'/my-account/sign-in/')
        cy.contains("Incorrect username or password").should('be.visible')
    })
})