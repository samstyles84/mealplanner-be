const request = require("supertest");
const app = require("../app");
const testData = require("../db/data/test-data");
const knex = require("../connection");

describe("app", () => {
  beforeEach(() => {
    return knex.seed.run();
  });

  afterAll(() => {
    return knex.destroy();
  });

  describe("/api", () => {
    describe("/meals", () => {
      test("GET: 200 - responds with an array of all meals", () => {
        return request(app)
          .get("/api/meals")
          .expect(200)
          .then(({ body }) => {
            expect(body.meals).toEqual(
              expect.arrayContaining([
                expect.objectContaining({
                  meal_id: expect.any(Number),
                  name: expect.any(String),
                  portions: expect.any(Number),
                }),
              ])
            );
          });
      });
      test("POST: 201 - posts a new meal (using existing ingredients", () => {
        return request(app)
          .post("/api/meals/")
          .send({
            name: "Beef, beans and onion",
            portions: 2,
            recipe: [
              { ingredient_id: 1, quantity: 1 },
              { ingredient_id: 2, quantity: 2 },
              { ingredient_id: 3, quantity: 3 },
            ],
          })
          .expect(201)
          .then(({ body: { meal } }) => {
            expect(meal).toEqual(
              expect.objectContaining({
                recipe: expect.arrayContaining([
                  expect.objectContaining(
                    {
                      name: "Corned Beef",
                      type: "Store cupboard",
                      ingredient_id: 1,
                      units: "cans",
                      meal_id: expect.any(Number),
                      quantity: 1,
                    },
                    {
                      name: "Baked Beans",
                      type: "Store cupboard",
                      ingredient_id: 2,
                      units: "cans",
                      meal_id: expect.any(Number),
                      quantity: 2,
                    },
                    {
                      name: "Onion",
                      type: "Veg",
                      ingredient_id: 3,
                      units: "no",
                      meal_id: expect.any(Number),
                      quantity: 3,
                    }
                  ),
                ]),
                name: "Beef, beans and onion",
                portions: 2,
                meal_id: expect.any(Number),
              })
            );
          });
      });
      describe("/meals/:meal_id", () => {
        test("GET: 200 - responds with a meal object with correct mealname, ingredients & quantities", () => {
          const apiString = `/api/meals/1`;
          return request(app)
            .get(apiString)
            .expect(200)
            .then(({ body: { meal } }) => {
              expect(meal).toEqual(
                expect.objectContaining({
                  recipe: expect.arrayContaining([
                    expect.objectContaining({
                      name: expect.any(String),
                      type: expect.any(String),
                      ingredient_id: expect.any(Number),
                      units: expect.any(String),
                      meal_id: 1,
                      quantity: expect.any(Number),
                    }),
                  ]),
                  name: "Corned Beef Hash",
                  portions: 4,
                  meal_id: 1,
                })
              );
            });
        });
        test("PATCH: 201 - updates a meal", () => {
          return request(app)
            .patch("/api/meals/1")
            .send({
              name: "Corned beef hash",
              portions: 6,
              recipe: [
                { ingredient_id: 1, quantity: 1 },
                { ingredient_id: 2, quantity: 2 },
                { ingredient_id: 3, quantity: 3 },
                { ingredient_id: 10, quantity: 100 },
              ],
            })
            .expect(201)
            .then(({ body: { meal } }) => {
              expect(meal).toEqual({
                recipe: [
                  {
                    name: "Corned Beef",
                    type: "Store cupboard",
                    ingredient_id: 1,
                    units: "cans",
                    meal_id: 1,
                    quantity: 1,
                  },
                  {
                    name: "Baked Beans",
                    type: "Store cupboard",
                    ingredient_id: 2,
                    units: "cans",
                    meal_id: 1,
                    quantity: 2,
                  },
                  {
                    name: "Onion",
                    type: "Veg",
                    ingredient_id: 3,
                    units: "no",
                    meal_id: 1,
                    quantity: 3,
                  },
                  {
                    name: "Stock cubes",
                    type: "Store cupboard",
                    ingredient_id: 10,
                    units: "no",
                    meal_id: 1,
                    quantity: 100,
                  },
                ],
                name: "Corned beef hash",
                portions: 6,
                meal_id: 1,
              });
            });
        });
      });
    });
    describe("/ingredients", () => {
      describe("/ingredients/meal/:meal_id", () => {
        test("GET: 200 - responds with an array of ingredients for the correct meal ", () => {
          const apiString = `/api/ingredients/meal/1`;
          return request(app)
            .get(apiString)
            .expect(200)
            .then(({ body: { ingredients } }) => {
              expect(ingredients).toEqual(
                expect.arrayContaining([
                  expect.objectContaining({
                    name: expect.any(String),
                    type: expect.any(String),
                    ingredient_id: expect.any(Number),
                    units: expect.any(String),
                    meal_id: 1,
                    quantity: expect.any(Number),
                  }),
                ])
              );
            });
        });
      });
      describe("/ingredients", () => {
        test("GET: 200 - responds with an array of all ingredients", () => {
          const apiString = `/api/ingredients/`;
          return request(app)
            .get(apiString)
            .expect(200)
            .then(({ body: { ingredients } }) => {
              expect(ingredients).toEqual(
                expect.arrayContaining([
                  expect.objectContaining({
                    name: expect.any(String),
                    type: expect.any(String),
                    ingredient_id: expect.any(Number),
                    units: expect.any(String),
                  }),
                ])
              );
            });
        });
        test("POST: 201 - adds an ingredient", () => {
          return request(app)
            .post("/api/ingredients/")
            .send({
              name: "New ingredient",
              type: "Store cupboard",
              units: "cans",
            })
            .expect(201)
            .then(
              ({
                body: {
                  ingredient: { name, type, ingredient_id, units },
                },
              }) => {
                expect(name).toBe("New ingredient");
                expect(type).toBe("Store cupboard");
                expect(typeof ingredient_id).toBe("number");
                expect(units).toBe("cans");
              }
            );
        });
        describe("/ingredients/:ingredient_id", () => {
          test("GET: 200 - gets an ingredient by id", () => {
            const apiString = `/api/ingredients/1`;
            return request(app)
              .get(apiString)
              .expect(200)
              .then(({ body: { ingredients } }) => {
                expect(ingredients).toEqual({
                  name: "Corned Beef",
                  type: "Store cupboard",
                  units: "cans",
                  ingredient_id: 1,
                });
              });
          });
          test("PATCH: 201 - updates an ingredient", () => {
            return request(app)
              .patch("/api/ingredients/1")
              .send({
                name: "Corned Beef",
                type: "Store cupboard",
                units: "g",
              })
              .expect(200)
              .then(
                ({
                  body: {
                    ingredient: { name, type, ingredient_id, units },
                  },
                }) => {
                  expect(name).toBe("Corned Beef");
                  expect(type).toBe("Store cupboard");
                  expect(units).toBe("g");
                  expect(ingredient_id).toBe(1);
                }
              );
          });
          test("DELETE: 204 - deletes an ingredient", () => {
            return request(app).delete("/api/ingredients/1").expect(204);
          });
        });
      });
    });
  });
});
