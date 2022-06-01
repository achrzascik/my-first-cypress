let externalCompanyEmployees = [];
let externalCompanyEmployeesAfterAdding = [];
let externalCompanyEmployeesAfterDeleting = [];

describe('External employee', () => {
    it('Verify if there is possibility to check all employee for chosen company', () => {
        cy.getExternalCompaniesEmployees()
        .then(response => {
            expect(response.status).to.equal(200);
            //Cypress.env('externalCompanyEmployees', response.body.employees.map(x => x.id));
            externalCompanyEmployees = response.body.employees.map(x => x.id)
            
        })
    })
    it('Verify if there is possibility to add new employee for chosen company', () => {
        cy.request({
            method: 'POST',
            url: "/api/Project/" + (Cypress.env('companyId')) + "/AddEmployees?employeeCount=1",
            headers: {
                'X-ZUMO-AUTH': Cypress.env('X-ZUMO-AUTH'),
                'X-MS-TOKEN-AAD-ACCESS-TOKEN': Cypress.env('X-MS-TOKEN-AAD-ACCESS-TOKEN'),
                body: null
            },
        }).then(response => {
            expect(response.status).to.equal(200);
        })
    })
    it('Verify if there is there is one more employees after adding one', () => {
        cy.getExternalCompaniesEmployees()
        .then(response => {
            expect(response.status).to.equal(200);
            externalCompanyEmployeesAfterAdding =response.body.employees.map(x => x.id);
            expect(externalCompanyEmployeesAfterAdding.length).to.equal(externalCompanyEmployees.length + 1);
            Cypress.env('newEmployeeId', externalCompanyEmployeesAfterAdding.filter(x => !externalCompanyEmployees.includes(x)));
            console.log(Cypress.env('newEmployeeId'));
        })
     })
     it('Verify if admin is able to delete employee from external company', () => {
        cy.request({
            method: 'DELETE',
            url: "/api/Employee/" + (Cypress.env('newEmployeeId')),
            headers: {
                'X-ZUMO-AUTH': Cypress.env('X-ZUMO-AUTH'),
                'X-MS-TOKEN-AAD-ACCESS-TOKEN': Cypress.env('X-MS-TOKEN-AAD-ACCESS-TOKEN'),
                body: null
            },
        }).then(response => {
            expect(response.status).to.equal(200);
        })
    })
    it('Verify if list of employeesdoes not include deleted entry', () => {
        cy.getExternalCompaniesEmployees()
            .then(response => {
                expect(response.status).to.equal(200);
                externalCompanyEmployeesAfterDeleting = response.body.employees.map(x => x.id)
                const employee = externalCompanyEmployeesAfterDeleting.find(x => {
                    return x == Cypress.env('newEmployeeId');
                })
                expect(employee).to.not.exist;
            })
    })
})