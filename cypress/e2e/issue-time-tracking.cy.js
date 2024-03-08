describe("Issue time tracking", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.url()
      .should("eq", `${Cypress.env("baseUrl")}project/board`)
      .then((url) => {
        cy.visit(url + "/board");
        cy.contains("This is an issue of type: Task.").click();
      });
  });
  const getIssueTrackingModal = () => cy.get('[data-testid="modal:tracking"]');
  const getIssueDetailsModal = () =>
    cy.get('[data-testid="modal:issue-details"]');
  const initialEstimation = "10";
  const updatedEstimation = "20";

  it("Should add, edit and remove time estimation", () => {
    getIssueDetailsModal().within(() => {
      cy.get('input[placeholder="Number"]').clear().type(initialEstimation);
      cy.contains(initialEstimation).should("exist");
      cy.contains(`${initialEstimation}${"h estimated"}`).should("be.visible");

      cy.get('input[placeholder="Number"]').clear().type(updatedEstimation);
      cy.contains(updatedEstimation).should("exist");
      cy.contains(initialEstimation).should("not.exist");
      cy.contains(`${updatedEstimation}${"h estimated"}`).should("be.visible");

      cy.get('input[placeholder="Number"]').clear();

      cy.contains(updatedEstimation).should("not.exist");
      cy.contains(`${updatedEstimation}${"h estimated"}`).should("not.exist");
    });
  });

  const timeSpent = "3";
  const timeRemaining = "4";

  it("Should log and remove logged time", () => {
    cy.get('[data-testid="icon:stopwatch"]').click();
    getIssueTrackingModal().should("be.visible");
    getIssueTrackingModal().within(() => {
      cy.get('input[placeholder="Number"]').first().clear().type(timeSpent);
      cy.get('input[placeholder="Number"]').last().clear().type(timeRemaining);
    });
    getIssueTrackingModal()
      .contains("button", "Done")
      .click()
      .should("not.exist");
    cy.get('[data-testid="modal:issue-details"]').should("be.visible");
    cy.contains("No time logged").should("not.exist");
    cy.contains(`${timeSpent}${"h logged"}`).should("be.visible");
    cy.contains(`${timeRemaining}${"h remaining"}`).should("be.visible");

    cy.get('[data-testid="icon:stopwatch"]').click();
    getIssueTrackingModal()
      .should("be.visible")
      .within(() => {
        cy.get('input[placeholder="Number"]').first().clear();
        cy.get('input[placeholder="Number"]').last().clear();
      });
    getIssueTrackingModal()
      .contains("button", "Done")
      .click()
      .should("not.exist");
    cy.get('[data-testid="modal:issue-details"]').should("be.visible");
    cy.contains("No time logged").should("be.visible");
  });
});
