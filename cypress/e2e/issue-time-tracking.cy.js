describe('Issue comments creating, editing and deleting', () => {
    beforeEach(() => {
        cy.visit('/');
        cy.url().should('eq', `${Cypress.env('baseUrl')}project/board`).then((url) => {
            cy.visit(url + '/board');
            cy.contains('This is an issue of type: Task.').click();
        });

    });
//Create issue
cy.get('.ql-editor').type(createTestIssueDescription);
cy.get('input[name="title"]').type(createTestIssueTitle);
cy.get('button[type="submit"]').click();
cy.get('[data-testid="modal:issue-create"]').should('not.exist');
cy.reload();
cy.get('[data-testid="board-list:backlog').should('be.visible');
cy.get('[data-testid="list-issue"]')
  .first()
  .contains(createTestIssueTitle)
  .click();
cy.get('[data-testid="modal:issue-details"]').should('be.visible');
});

const getIssueDetailsModal = () =>
cy.get('[data-testid="modal:issue-details"]');
const getInputNumber = () => cy.get('input[placeholder="Number"]');
const getIssueDetailsModalClose = () => cy.get('[data-testid="icon:close"]');
const getStopwatchIconForTimetracking = () =>
cy.get('[data-testid="icon:stopwatch"]');
const getModalTimetracking = () => cy.get('[data-testid="modal:tracking"]');
const createTestIssueDescription = 'For issue time-tracking';
const createTestIssueTitle = 'Create issue for time-tracking';

it('Should validate successful time-tracking estimations (add, edit, delete)', () => {
const time = 10;
const editedTime = 20;
const timeWithEstimated = time + 'h estimated';
const editedTimeWithEstimated = editedTime + 'h estimated';

//Add estimation
getIssueDetailsModal().within(() => {
cy.contains('No time logged').should('be.visible');
getInputNumber()
.should('exist')
.should('not.have.value')
.click()
.type(time);
cy.contains(timeWithEstimated).should('be.visible');
getIssueDetailsModalClose().click();
getIssueDetailsModal().should('not.exist');
});
cy.contains(createTestIssueTitle).click();
getIssueDetailsModal().within(() => {
getInputNumber().should('have.value', time);
cy.contains(timeWithEstimated).should('be.visible');
//Edit estimation
getInputNumber().click().clear().type(editedTime);
cy.contains(editedTimeWithEstimated).should('be.visible');
getIssueDetailsModalClose().click();
});
cy.contains(createTestIssueTitle).click();
getIssueDetailsModal().within(() => {
getInputNumber().should('have.value', editedTime);
cy.contains(editedTimeWithEstimated).should('be.visible');
//Delete estimation
getInputNumber().click().clear().should('not.have.value');
cy.contains(editedTimeWithEstimated).should('not.exist');
getIssueDetailsModalClose().click();
});
cy.contains(createTestIssueTitle).click();
getIssueDetailsModal().within(() => {
getInputNumber().should('have.attr', 'placeholder', 'Number');
});
});

it('Should validate time logging functionality (add, delete)', () => {
const timeSpent = 2;
const timeRemaining = 5;
const timeSpentInIssueDetailsModal = timeSpent + 'h logged';
const timeRemainingInIssueDetailsModal = timeRemaining + 'h remaining';
const originalEstimatedTime = 10;
const originalEstimatedTimeWithEstimated =
originalEstimatedTime + 'h estimated';

// Add time spent
getIssueDetailsModal().within(() => {
//Add original estimated time in order to assert it after removing time spent
getInputNumber().click().type(originalEstimatedTime);
getStopwatchIconForTimetracking().should('exist').click();
});
getModalTimetracking()
.should('be.visible')
.within(() => {
getInputNumber().first().click().type(timeSpent);
getInputNumber().last().type(timeRemaining);
cy.contains('button', 'Done').click().should('not.exist');
});
//Assert
cy.contains('No time logged').should('not.exist');
getIssueDetailsModal().should('contain', timeSpentInIssueDetailsModal);
getIssueDetailsModal().should('contain', timeRemainingInIssueDetailsModal);
//Delete added time
getIssueDetailsModal().within(() => {
getStopwatchIconForTimetracking().click();
});
getModalTimetracking().within(() => {
getInputNumber().first().click().clear();
getInputNumber().last().click().clear();
cy.contains('button', 'Done').click().should('not.exist');
});
//Assert
getIssueDetailsModal().should('not.contain', timeSpentInIssueDetailsModal);
getIssueDetailsModal().should(
'not.contain',
timeRemainingInIssueDetailsModal
);
getIssueDetailsModal().within(() => {
getInputNumber().should('have.value', originalEstimatedTime);
getStopwatchIconForTimetracking()
.next()
.should('contain', originalEstimatedTimeWithEstimated);
});
});