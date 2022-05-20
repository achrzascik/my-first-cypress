describe('API tests', () => {
    before(() => {
        //Get - sprawdzenie czy istnieje rezerwacja, jeśli tak - usunięcie jej
    })
    it('Admin should be able to invoke getUserLogged Data', () => {
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
    it('Admin should be able to create Hot desk reservation for employer', () => {
        const mydata = {
            reservingEmployee: Cypress.env('employeeId'),
            reservationStart: "2022-05-28T15:00:00",
            reservationEnd: "2022-05-29T15:00:00",
            deskId: Cypress.env('deskId')
        }
        cy.request({
            method: 'POST',
            url: "api/HotDesk",
            headers: {
                'X-ZUMO-AUTH': Cypress.env('X-ZUMO-AUTH'),
                'X-MS-TOKEN-AAD-ACCESS-TOKEN': Cypress.env('X-MS-TOKEN-AAD-ACCESS-TOKEN'),
            },
            body: mydata,
        }).then(response => {
            console.log(response)
            expect(response.status).to.equal(200);
            Cypress.env('reservationHotDeskId', response.body)
            expect(response.body.length).to.equal(36);
        })
    })
    it('Admin should be able to check reservations', () => {
        cy.request({
            method: 'GET',
            form: true,
            url: "/api/HotDesk/GetActiveReservationsForEmployee/" + Cypress.env('employeeId'),
            headers: {
                'X-ZUMO-AUTH': Cypress.env('X-ZUMO-AUTH'),
                'X-MS-TOKEN-AAD-ACCESS-TOKEN': Cypress.env('X-MS-TOKEN-AAD-ACCESS-TOKEN'),
                body: null
            },
        }).then(response => {
            console.log(response)
            expect(response.status).to.equal(200);
            expect(response.body[0].id).to.equal(Cypress.env('reservationHotDeskId'));
            expect(response.body[0].desk.id).to.equal(Cypress.env('deskId').toLowerCase());
            expect(response.body[0].employee.id).to.equal(Cypress.env('employeeId').toLowerCase());
        })
    })
    it('Admin should be able to delete Hot desk reservation for employer', () => {
        cy.request({
            method: 'DELETE',
            url: "api/HotDesk/" + Cypress.env('reservationHotDeskId'),
            headers: {
                'X-ZUMO-AUTH': Cypress.env('X-ZUMO-AUTH'),
                'X-MS-TOKEN-AAD-ACCESS-TOKEN': Cypress.env('X-MS-TOKEN-AAD-ACCESS-TOKEN'),
            },
        }).then(response => {
            console.log(response)
            expect(response.status).to.equal(200);
        })      
    })
    it('List of reservation should be empty after delete reservations', () => {
        cy.request({
            method: 'GET',
            form: true,
            url: "/api/HotDesk/GetActiveReservationsForEmployee/" + Cypress.env('employeeId'),
            headers: {
                'X-ZUMO-AUTH': Cypress.env('X-ZUMO-AUTH'),
                'X-MS-TOKEN-AAD-ACCESS-TOKEN': Cypress.env('X-MS-TOKEN-AAD-ACCESS-TOKEN'),
                body: null
            },
        }).then(response => {
            console.log(response)
            expect(response.status).to.equal(200);
            expect(response.body.length).to.equal(0);
        })
    })
})