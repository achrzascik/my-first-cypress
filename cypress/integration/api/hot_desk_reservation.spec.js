describe('Hot desk', () => {
    before(() => {
        cy.getReservationForEmployee()
            .then(response => {
                if (response.body.length > 0) {
                    for (let i = 0; i < response.body.length; i++) {
                        Cypress.env('reservationHotDeskId', response.body[i].id);
                        cy.deleteReservation(Cypress.env('reservationHotDeskId'))
                    }
                }
            })
    })
    it('Verify if admin is able to create Hot desk reservation for employer', () => {
        const mydata = {
            reservingEmployee: Cypress.env('employeeId'),
            reservationStart: Cypress.env('startDate'),
            reservationEnd: Cypress.env('endDate'),
            deskId: Cypress.env('hotDeskId')
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
            const data = response.body;
            expect(response.status).to.equal(200);
            Cypress.env('reservationHotDeskId', data)
            expect(data.length).to.equal(36);
        })
    })
    it('Verify if admin is able to check reservations for employee', () => {
        cy.getReservationForEmployee()
            .then(response => {
                expect(response.status).to.equal(200);
                const reservation = response.body.find(x => {
                    return x.id == Cypress.env('reservationHotDeskId');
                })
                expect(reservation).to.exist;
                expect(reservation.id).to.equal(Cypress.env('reservationHotDeskId'));
                expect(reservation.desk.id).to.equal(Cypress.env('deskId').toLowerCase());
                expect(reservation.employee.id).to.equal(Cypress.env('employeeId').toLowerCase());
            })
    })
    it('Verify if admin is able to check reservations for desk', () => {
        cy.getReservationForDesk()
            .then(response => {
                expect(response.status).to.equal(200);
                const reservation = response.body.find(x => {
                    return x.id == Cypress.env('reservationHotDeskId');
                })
                expect(reservation).to.exist;
                expect(reservation.id).to.equal(Cypress.env('reservationHotDeskId'));
                expect(reservation.desk.id).to.equal(Cypress.env('deskId').toLowerCase());
                expect(reservation.employee.id).to.equal(Cypress.env('employeeId').toLowerCase());
            })
    })
    it('Verify if admin is able to check reservations with date of reservation', () => {
        cy.request({
            method: 'GET',
            form: true,
            url: "/api/HotDesk?startDate="+  Cypress.env('startDate') + "&endDate=" + Cypress.env('endDate'),
            headers: {
                'X-ZUMO-AUTH': Cypress.env('X-ZUMO-AUTH'),
                'X-MS-TOKEN-AAD-ACCESS-TOKEN': Cypress.env('X-MS-TOKEN-AAD-ACCESS-TOKEN'),
                body: null
            }
        }).then(response => {
            expect(response.status).to.equal(200);
        })
    })
    it('Verify if admin is able to delete Hot desk reservation for employer', () => {
        cy.deleteReservation(Cypress.env('reservationHotDeskId'))
            .then(response => {
                console.log(response)
                expect(response.status).to.equal(200);
            })
    })
    it('Verify if list of reservation for employee does not include deleted entry', () => {
        cy.getReservationForEmployee()
            .then(response => {
                expect(response.status).to.equal(200);
                const reservation = response.body.find(x => {
                    return x.id == Cypress.env('reservationHotDeskId');
                })
                expect(reservation).to.not.exist;
            })
    })
    it('Verify if list of reservation for desk does not include deleted entry', () => {
        cy.getReservationForDesk()
            .then(response => {
                expect(response.status).to.equal(200);
                const reservation = response.body.find(x => {
                    return x.id == Cypress.env('reservationHotDeskId');
                })
                expect(reservation).to.not.exist;
            })
    })
})