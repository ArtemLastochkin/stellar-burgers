import ingredientsDataMock from '../../fixtures/burgerIngredients.json';
import { setCookie, deleteCookie } from '../../../src/utils/cookie';

describe('burgerConstructor', function () {
  beforeEach(() => {
    cy.visit('http://localhost:4000/');
    cy.viewport(1920, 1080);
    cy.intercept('GET', '/api/ingredients', {
      statusCode: 200,
      body: ingredientsDataMock
    }).as('getIngredients');
    cy.wait('@getIngredients');
  });

  it('[Page Constructor] : проверка данных на странице', function () {
    cy.get('h3')
      .contains('Булки')
      .next('ul')
      .children('li')
      .should('have.length', 2);
    cy.get('h3')
      .contains('Начинки')
      .next('ul')
      .children('li')
      .should('have.length', 9);
    cy.get('h3')
      .contains('Соусы')
      .next('ul')
      .children('li')
      .should('have.length', 4);
  });

  it('[Burger Constructor] : добавление булки', function () {
    ingredientsDataMock.data.forEach((e) => {
      if (e.type === 'bun') {
        cy.get(`[data-cy=${e._id}] .common_button`).click();
        cy.get(`[data-cy=${e._id}] .counter__num`).should('have.text', '2');
        cy.get(
          '.constructor-element_pos_top .constructor-element__text'
        ).should('have.text', `${e.name} (верх)`);
        cy.get(
          '.constructor-element_pos_bottom .constructor-element__text'
        ).should('have.text', `${e.name} (низ)`);
      }
    });
  });

  it('[Burger Constructor] : добавление, удаление ингредиента конструктора', function () {
    const mainAndSauce = ingredientsDataMock.data.filter(
      (e) => e.type === 'main' || e.type === 'sauce'
    );
    mainAndSauce.forEach((e) => {
      cy.get(`[data-cy=${e._id}] .common_button`).click();
      cy.get(`[data-cy=${e._id}] .counter__num`).should('have.text', '1');
      cy.get(`[data-cy=${e._id}] .constructor-element__text`).should(
        'have.text',
        `${e.name}`
      );
    });

    mainAndSauce.forEach((e) => {
      cy.get(`[data-cy=${e._id}] .constructor-element__action`).click();
      cy.get(`[data-cy=${e._id}] .constructor-element__text`).should(
        'not.exist'
      );
      cy.get(`[data-cy=${e._id}] .counter__num`).should('not.exist');
    });
  });

  it('[Modal ingredient] : открытие, закрытие, подстановка данных', function () {
    ingredientsDataMock.data.forEach((e) => {
      cy.get(`[data-cy=${e._id}] a[href]`).should('exist').click();
      cy.url().should('include', `/ingredients/${e._id}`);
      cy.get('[id="modals"]').should('exist');
      cy.get('[id="modals"] h3.text').contains(`${e.name}`).should('exist');
      cy.get('[id="modals"] li').should('have.length', 4);
      cy.get('[id="modals"] li p')
        .contains('Калории, ккал')
        .next('p')
        .should('have.text', `${e.calories}`);
      cy.get('[id="modals"] li p')
        .contains('Белки, г')
        .next('p')
        .should('have.text', `${e.proteins}`);
      cy.get('[id="modals"] li p')
        .contains('Жиры, г')
        .next('p')
        .should('have.text', `${e.fat}`);
      cy.get('[id="modals"] li p')
        .contains('Углеводы, г')
        .next('p')
        .should('have.text', `${e.carbohydrates}`);
      cy.get('[id="modals"] button').click().should('not.exist');
      cy.get('[id="modals"]').children().should('have.length', 0);
      cy.get(`[data-cy=${e._id}] a[href]`).click();
      cy.get('[id="modals"]').should('exist');
      cy.get('body').click(50, 50);
      cy.get('[id="modals"]').children().should('have.length', 0);
    });
  });

  it('[Feed] : оформить заказ', function () {
    localStorage.setItem(
      'refreshToken',
      ingredientsDataMock.userDataResponse.refreshToken
    );
    setCookie('accessToken', ingredientsDataMock.userDataResponse.accessToken);

    cy.intercept('GET', '/api/auth/user', {
      statusCode: 200,
      body: ingredientsDataMock.userDataResponse
    }).as('getUserData');

    cy.wait('@getUserData');

    cy.intercept('POST', '/api/orders', {
      statusCode: 200,
      body: ingredientsDataMock.orderResponse
    }).as('getOrderResponse');

    const { ingredients } = ingredientsDataMock.orderResponse.order;
    ingredients.forEach((e) => {
      cy.get(`[data-cy=${e._id}] .common_button`).click();
    });
    cy.get(`button`).contains('Оформить заказ').click();

    cy.wait('@getOrderResponse');

    cy.get('[id="modals"]').should('exist');
    cy.get('[id="modals"] h2.text')
      .contains(`${ingredientsDataMock.orderResponse.order.number}`)
      .should('exist');
    cy.get('body').click(50, 50);
    cy.get('[id="modals"]').children().should('have.length', 0);
    cy.get(`section ul`).contains('Выберите начинку').should('exist');
    cy.get(`section ul`).next('div').contains('Выберите булки').should('exist');
    cy.get(`section ul`).prev('div').contains('Выберите булки').should('exist');

    localStorage.clear();
    deleteCookie('accessToken');
  });
});
