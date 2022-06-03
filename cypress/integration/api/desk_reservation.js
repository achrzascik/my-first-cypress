describe('Desk reservation', () => {
    it('Verify if admin is able to create desk reservation for employer', () => {
        const mydata = {
            DeskId: Cypress.env('deskId'),
            ReservationStart: null,
            ReservationEnd: null,
            EmployeeId: Cypress.env('employeeId2'),
            ScheduledWeekdays: [1,2,3],
        }
        cy.request({
            method: 'POST',
            url: "api/Room/ReserveDesk",
            headers: {
                'X-ZUMO-AUTH': Cypress.env('X-ZUMO-AUTH'),
                'X-MS-TOKEN-AAD-ACCESS-TOKEN': Cypress.env('X-MS-TOKEN-AAD-ACCESS-TOKEN'),
            },
            body: mydata,
        }).then(response => {
            const data = response.body;
            Cypress.env('reservationDeskId', data)
            expect(response.status).to.equal(200);
            expect(data.length).to.equal(36);
        })
    })
    it('Verify if there is new reservation on list', () => {
        cy.getEmployeesDesks()
            .then(response => {
                const data = response.body;
                expect(response.status).to.equal(200);
                const reservations = data.rooms[0].desksInRoom.flatMap(x => x.reservations.map(x => x.id));
                const employee = data.employees.find(x => x.id == Cypress.env('employeeId2'));
                const employeeDesks = employee.roomDeskDtos.map(x => x.deskId);
                expect(reservations).contain(Cypress.env('reservationDeskId'));
                expect(employee).exist; 
                expect(employeeDesks).contain(Cypress.env('deskId'));
            })
    })
    it('Verify if admin is able to remove desk reservation for employer', () => {
        const mydata = {
            DeskId: Cypress.env('deskId'),
            EmployeeId: Cypress.env('employeeId2'),
        }
        cy.request({
            method: 'POST',
            url: "api/Room/ReleaseDeskEmployee",
            headers: {
                'X-ZUMO-AUTH': Cypress.env('X-ZUMO-AUTH'),
                'X-MS-TOKEN-AAD-ACCESS-TOKEN': Cypress.env('X-MS-TOKEN-AAD-ACCESS-TOKEN'),
            },
            body: mydata,
        }).then(response => {
            expect(response.status).to.equal(200);
        })
    })
    it('Verify if there is no reservation on list', () => {
        cy.getEmployeesDesks()
            .then(response => {
                const data = response.body;
                const employee = data.employees.find(x => x.id == Cypress.env('employeeId2'));
                let reservations, employeeDesks = [];
                expect(response.status).to.equal(200);
                if(data.rooms.length>0){
                    reservations = data.rooms[0].desksInRoom.flatMap(x => x.reservations.map(x => x.id));
                    expect(reservations).not.contain(Cypress.env('reservationDeskId'));
                }else{
                    expect(reservations).empty;
                }
                if(employee.roomDeskDtos.length>0){
                    employeeDesks = employee.roomDeskDtos.map(x => x.deskId);
                    expect(employee).exist; 
                    expect(employeeDesks).not.contain(Cypress.env('deskId'));
                }else{
                    expect(employeeDesks).empty;
                }
            })
        })
        it('Verify if admin is able to reservation more then one desk for employer', () => {
            const mydata = {
                DeskId: Cypress.env('deskId'),
                ReservationStart: null,
                ReservationEnd: null,
                EmployeeId: Cypress.env('employeeId2'),
                ScheduledWeekdays: [1,2,3],
            }
            cy.request({
                method: 'POST',
                url: "api/Room/ReserveDesk",
                headers: {
                    'X-ZUMO-AUTH': Cypress.env('X-ZUMO-AUTH'),
                    'X-MS-TOKEN-AAD-ACCESS-TOKEN': Cypress.env('X-MS-TOKEN-AAD-ACCESS-TOKEN'),
                },
                body: mydata,
            }).then(response => {
                const data = response.body;
                expect(response.status).to.equal(200);
                expect(data.length).to.equal(36);
            })
            const mydata2 = {
                DeskId: Cypress.env('deskId2'),
                ReservationStart: null,
                ReservationEnd: null,
                EmployeeId: Cypress.env('employeeId2'),
                ScheduledWeekdays: [4,5],
            }
            cy.request({
                method: 'POST',
                url: "api/Room/ReserveDesk",
                headers: {
                    'X-ZUMO-AUTH': Cypress.env('X-ZUMO-AUTH'),
                    'X-MS-TOKEN-AAD-ACCESS-TOKEN': Cypress.env('X-MS-TOKEN-AAD-ACCESS-TOKEN'),
                },
                body: mydata2,
            }).then(response => {
                const data = response.body;
                expect(response.status).to.equal(200);
                expect(data.length).to.equal(36);
            })
        })
        it('Verify if admin is able to remove all desk reservation for employer', () => {
            const mydata = [Cypress.env('employeeId2')];

            cy.request({
                method: 'POST',
                url: "/api/Room/ReleaseEmployeesDesks",
                headers: {
                    'X-ZUMO-AUTH': Cypress.env('X-ZUMO-AUTH'),
                    'X-MS-TOKEN-AAD-ACCESS-TOKEN': Cypress.env('X-MS-TOKEN-AAD-ACCESS-TOKEN'),
                },
                body: mydata,
            }).then(response => {
                expect(response.status).to.equal(200);
            })
        })
        it('Verify if there is no reservation on list after using ReleaseEmployeesDesks', () => {
            cy.getEmployeesDesks()
                .then(response => {
                    const data = response.body;
                    const employee = data.employees.find(x => x.id == Cypress.env('employeeId2'));
                    expect(response.status).to.equal(200);
                    expect(employee.roomDeskDtos.length).equal(0);
                })
            })
})
