describe('Login', () => {
    it('Verify if admin is able to invoke getUserLogged Data', () => {
        cy.request({
            method: 'GET',
            form: true,
            url: "api/User/GetLoggedUserData",
            headers: {
                'X-ZUMO-AUTH': Cypress.env('X-ZUMO-AUTH'),
                'X-MS-TOKEN-AAD-ACCESS-TOKEN': Cypress.env('X-MS-TOKEN-AAD-ACCESS-TOKEN'),
                body: null
            },
            qs: { loggedUserEmail: `${Cypress.env('username')}` }
        }).then(response => {
            console.log(response)
            expect(response.status).to.equal(200);
            expect(response.body.email).to.equal(Cypress.env('username'));
            expect(response.body.id).to.equal('15e6dd4c-5730-48d3-a91f-989147951b4e');
            expect(response.body.roles[0]).to.equal('Admin');
            expect(response.body.workspaceType).to.equal(2);
        })
    })
})