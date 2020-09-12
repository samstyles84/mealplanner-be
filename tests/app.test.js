const request = require("supertest");
const app = require("../app");
const knex = require("../connection");

describe("app", () => {
  beforeEach(() => {
    return knex.seed.run();
  });

  afterAll(() => {
    return knex.destroy();
  });

  test("ALL: 404 - non existent path", () => {
    return request(app)
      .get("/not-a-route")
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe("Path not found! :-(");
      });
  });

  describe("/api", () => {
    test("GET: 200 - responds with a JSON object describing all available endpoints", () => {
      return request(app)
        .get("/api")
        .expect(200)
        .then(({ body }) => {
          expect(body).toEqual(
            expect.objectContaining({
              "GET /api": expect.any(Object),
              "GET /api/meals": expect.any(Object),
              "POST /api/meals": expect.any(Object),
              "GET /api/meals/:meal_id": expect.any(Object),
              "PATCH /api/meals/:meal_id": expect.any(Object),
              "DELETE /api/meals/:meal_id": expect.any(Object),
              "GET /api/ingredients": expect.any(Object),
              "POST /api/ingredients": expect.any(Object),
              "GET /api/ingredients/:ingredient_id": expect.any(Object),
              "PATCH /api/ingredients/:ingredient_id": expect.any(Object),
              "DELETE /api/ingredients/:ingredient_id": expect.any(Object),
              "GET /api/ingredients/meal/:meal_id": expect.any(Object),
              "GET /api/ingredients/shoppinglist": expect.any(Object),
            })
          );
        });
    });
    test("INVALID METHODS: 405 error", () => {
      const invalidMethods = ["put", "post", "patch", "delete"];
      const endPoint = "/api";

      const promises = invalidMethods.map((method) => {
        return request(app)
          [method](endPoint)
          .expect(405)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("method not allowed!!!");
          });
      });
      return Promise.all(promises);
    });
    describe("/users/:username", () => {
      test("GET: 200 - responds true if user exists", () => {
        const apiString = `/api/users/sam`;
        return request(app)
          .get(apiString)
          .expect(200)
          .then(({ body }) => {
            expect(body).toBe(true);
          });
      });
      test("GET: 200 - responds false if user doesn't exist", () => {
        const apiString = `/api/users/banksy`;
        return request(app)
          .get(apiString)
          .expect(200)
          .then(({ body }) => {
            expect(body).toBe(false);
          });
      });
      test("INVALID METHODS: 405 error", () => {
        const invalidMethods = ["put", "post", "patch", "delete"];
        const endPoint = "/api/users/sam";
        const promises = invalidMethods.map((method) => {
          return request(app)
            [method](endPoint)
            .expect(405)
            .then(({ body: { msg } }) => {
              expect(msg).toBe("method not allowed!!!");
            });
        });
        return Promise.all(promises);
      });
    });
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
                  votes: expect.any(Number),
                  source: expect.any(String),
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
            votes: 0,
            recipe: [
              { ingredient_id: 1, quantity: 1 },
              { ingredient_id: 2, quantity: 2 },
              { ingredient_id: 3, quantity: 3 },
            ],
            source: "Totally made up!",
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
                votes: 0,
                source: "Totally made up!",
              })
            );
          });
      });
      test("POST: 400 - Bad Request status code when `POST` request does not include all the required keys", () => {
        return request(app)
          .post("/api/meals/")
          .send({
            name: "Beef, beans and onion",
            recipe: [
              { ingredient_id: 1, quantity: 1 },
              { ingredient_id: 2, quantity: 2 },
              { ingredient_id: 3, quantity: 3 },
            ],
          })
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("bad request to db!!!");
          });
      });
      test("POST: 400 - Bad Request status code when `POST` request includes incorrect recipe", () => {
        //Prevent this on the front-end by checking data types!
      });
      test("INVALID METHODS: 405 error", () => {
        const invalidMethods = ["put", "patch", "delete"];
        const endPoint = "/api/meals";
        const promises = invalidMethods.map((method) => {
          return request(app)
            [method](endPoint)
            .expect(405)
            .then(({ body: { msg } }) => {
              expect(msg).toBe("method not allowed!!!");
            });
        });
        return Promise.all(promises);
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
        test("GET: 404 - Meal doesn't exist in the database", () => {
          const apiString = `/api/meals/999`;
          return request(app)
            .get(apiString)
            .expect(404)
            .then(({ body: { msg } }) => {
              expect(msg).toBe("meal id not found");
            });
        });
        test("GET: 400 - Badly formed meal_id", () => {
          const apiString = `/api/meals/sam`;
          return request(app)
            .get(apiString)
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).toBe("bad request to db!!!");
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
              votes: 1,
              source: "new source!",
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
                votes: 2,
                source: "new source!",
              });
            });
        });
        test("PATCH: 400 - Badly formed meal_id", () => {
          const apiString = `/api/meals/sam`;
          return request(app)
            .patch(apiString)
            .send({
              name: "Corned beef hash 2",
              portions: 6,
              recipe: [
                { ingredient_id: 1, quantity: 1 },
                { ingredient_id: 2, quantity: 2 },
                { ingredient_id: 3, quantity: 3 },
                { ingredient_id: 10, quantity: 100 },
              ],
            })
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).toBe("bad request to db!!!");
            });
        });
        test("DELETE: 204 - deletes a meal", () => {
          return request(app)
            .delete("/api/meals/1")
            .expect(204)
            .then(() => {
              return request(app).get(`/api/meals`);
            })
            .then(({ body: { meals } }) => {
              expect(meals.every((meal) => meal.meal_id !== 1)).toBe(true);
            });
        });
        test("DELETE: 204 - also removes recipe mapping", () => {
          return request(app)
            .delete("/api/meals/1")
            .expect(204)
            .then(() => {
              return request(app)
                .get(`/api/meals`)
                .then(() => {
                  return request(app)
                    .get(`/api/ingredients/meal/1`)
                    .expect(404)
                    .then(({ body: { msg } }) => {
                      expect(msg).toBe("meal id not found");
                    });
                });
            });
        });
        test("DELETE: 404 - Meal doesn't exist in the database", () => {
          const apiString = `/api/meals/999`;
          return request(app)
            .delete("/api/meals/999")
            .expect(404)
            .then(({ body: { msg } }) => {
              expect(msg).toBe("meal id not found");
            });
        });
        test("INVALID METHODS: 405 error", () => {
          const invalidMethods = ["put", "post"];
          const endPoint = "/api/meals/1";
          const promises = invalidMethods.map((method) => {
            return request(app)
              [method](endPoint)
              .expect(405)
              .then(({ body: { msg } }) => {
                expect(msg).toBe("method not allowed!!!");
              });
          });
          return Promise.all(promises);
        });
      });
      describe("/meals/:meal_id/votes", () => {
        test("PATCH: 201 - updates votes", () => {
          const apiString = `/api/meals/1/votes`;
          return request(app)
            .patch(apiString)
            .send({
              votes: 10,
            })
            .expect(201)
            .then(() => {
              return request(app)
                .get("/api/meals/1")
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
                      votes: 11,
                      source: "Handwritten",
                    })
                  );
                });
            });
        });
        test("PATCH: 400 - Badly formed meal_id", () => {
          const apiString = `/api/meals/sam/votes`;
          return request(app)
            .patch(apiString)
            .send({
              votes: 10,
            })
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).toBe("bad request to db!!!");
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
        test("GET: 404 - Meal doesn't exist in the database", () => {
          const apiString = `/api/ingredients/meal/999`;
          return request(app)
            .get(apiString)
            .expect(404)
            .then(({ body: { msg } }) => {
              expect(msg).toBe("meal id not found");
            });
        });
        test("GET: 400 - Badly formed meal_id", () => {
          const apiString = `/api/ingredients/meal/sam`;
          return request(app)
            .get(apiString)
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).toBe("bad request to db!!!");
            });
        });
        test("INVALID METHODS: 405 error", () => {
          const invalidMethods = ["put", "post", "patch", "delete"];
          const endPoint = "/api/ingredients/meal/1";
          const promises = invalidMethods.map((method) => {
            return request(app)
              [method](endPoint)
              .expect(405)
              .then(({ body: { msg } }) => {
                expect(msg).toBe("method not allowed!!!");
              });
          });
          return Promise.all(promises);
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
        test("POST: 400 - Bad Request status code when `POST` request does not include all the required keys", () => {
          return request(app)
            .post("/api/ingredients")
            .send({
              name: "butter_bridge",
              type: "some type",
            })
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).toBe("bad request to db!!!");
            });
        });
        test("INVALID METHODS: 405 error", () => {
          const invalidMethods = ["put", "patch", "delete"];
          const endPoint = "/api/ingredients/";
          const promises = invalidMethods.map((method) => {
            return request(app)
              [method](endPoint)
              .expect(405)
              .then(({ body: { msg } }) => {
                expect(msg).toBe("method not allowed!!!");
              });
          });
          return Promise.all(promises);
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
          test("GET: 404 - Ingredient doesn't exist in the database", () => {
            const apiString = `/api/ingredients/999`;
            return request(app)
              .get(apiString)
              .expect(404)
              .then(({ body: { msg } }) => {
                expect(msg).toBe("ingredient id not found");
              });
          });
          test("GET: 400 - Badly formed meal_id", () => {
            const apiString = `/api/ingredients/sam`;
            return request(app)
              .get(apiString)
              .expect(400)
              .then(({ body: { msg } }) => {
                expect(msg).toBe("bad request to db!!!");
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
          test("PATCH: 404 - Ingredient doesn't exist in the database", () => {
            const apiString = `/api/ingredients/999`;
            return request(app)
              .patch("/api/ingredients/999")
              .send({
                name: "Corned Beef 2",
                type: "Store cupboard",
                units: "g",
              })
              .expect(404)
              .then(({ body: { msg } }) => {
                expect(msg).toBe("ingredient id not found");
              });
          });
          test("PATCH: 400 - Badly formed meal_id", () => {
            const apiString = `/api/ingredients/sam`;
            return request(app)
              .patch("/api/ingredients/sam")
              .send({
                name: "Corned Beef 2",
                type: "Store cupboard",
                units: "g",
              })
              .expect(400)
              .then(({ body: { msg } }) => {
                expect(msg).toBe("bad request to db!!!");
              });
          });
          test("DELETE: 204 - deletes an unused ingredient", () => {
            return request(app)
              .delete("/api/ingredients/13")
              .expect(204)
              .then(() => {
                return request(app).get(`/api/ingredients/`);
              })
              .then(({ body: { ingredients } }) => {
                expect(
                  ingredients.every(
                    (ingredient) => ingredient.ingredient_id !== 13
                  )
                ).toBe(true);
              });
          });
          test("DELETE: 404 - doesn't delete a used ingredient", () => {
            return request(app)
              .delete("/api/ingredients/1")
              .expect(404)
              .then(() => {
                return request(app).get(`/api/ingredients/`);
              })
              .then(({ body: { ingredients } }) => {
                expect(
                  ingredients.every(
                    (ingredient) => ingredient.ingredient_id !== 1
                  )
                ).toBe(false);
              });
          });
          test("DELETE: 400 - Badly formed meal_id", () => {
            const apiString = `/api/ingredients/sam`;
            return request(app)
              .delete("/api/ingredients/sam")
              .expect(400)
              .then(({ body: { msg } }) => {
                expect(msg).toBe("bad request to db!!!");
              });
          });
          test("DELETE: 404 - Ingredient doesn't exist in the database", () => {
            const apiString = `/api/ingredients/999`;
            return request(app)
              .delete("/api/ingredients/999")
              .expect(404)
              .then(({ body: { msg } }) => {
                expect(msg).toBe("ingredient id not found");
              });
          });
          test("INVALID METHODS: 405 error", () => {
            const invalidMethods = ["put", "post"];
            const endPoint = "/api/ingredients/1";
            const promises = invalidMethods.map((method) => {
              return request(app)
                [method](endPoint)
                .expect(405)
                .then(({ body: { msg } }) => {
                  expect(msg).toBe("method not allowed!!!");
                });
            });
            return Promise.all(promises);
          });
        });
      });
      describe("/ingredients/shoppinglist", () => {
        test("GET: 200 - responds with an array of the correct ingredients when given mutliple meals", () => {
          const apiString = `/api/ingredients/shoppinglist?meals=1,3`;
          return request(app)
            .get(apiString)
            .expect(200)
            .then(({ body: { shoppinglist } }) => {
              expect(shoppinglist).toEqual({
                ingredients: [
                  {
                    ingredient_id: 1,
                    name: "Corned Beef",
                    type: "Store cupboard",
                    units: "cans",
                    quantity: "1",
                  },
                  {
                    ingredient_id: 2,
                    name: "Baked Beans",
                    type: "Store cupboard",
                    units: "cans",
                    quantity: "2",
                  },
                  {
                    ingredient_id: 3,
                    name: "Onion",
                    type: "Veg",
                    units: "no",
                    quantity: "2",
                  },
                  {
                    ingredient_id: 4,
                    name: "Potatoes",
                    type: "Veg",
                    units: "g",
                    quantity: "1000",
                  },
                  {
                    ingredient_id: 8,
                    name: "Carrot",
                    type: "Veg",
                    units: "no",
                    quantity: "1",
                  },
                  {
                    ingredient_id: 9,
                    name: "Chopped tomatoes",
                    type: "Store cupboard",
                    units: "cans",
                    quantity: "1",
                  },
                  {
                    ingredient_id: 10,
                    name: "Stock cubes",
                    type: "Store cupboard",
                    units: "no",
                    quantity: "1",
                  },
                  {
                    ingredient_id: 11,
                    name: "Bacon",
                    type: "Meat",
                    units: "g",
                    quantity: "60",
                  },
                  {
                    ingredient_id: 12,
                    name: "Red lentils",
                    type: "Store cupboard",
                    units: "g",
                    quantity: "50",
                  },
                ],
                portions: 7,
                meal_ids: [1, 3],
                meal_names: ["Corned Beef Hash", "Lentil and tomato soup"],
              });
            });
        });
        test("GET: 400 - Badly formed meal_id", () => {
          const apiString = `/api/ingredients/shoppinglist?meals=1,sam`;
          return request(app)
            .get(apiString)
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).toBe("bad request to db!!!");
            });
        });
        test("INVALID METHODS: 405 error", () => {
          const invalidMethods = ["put", "post", "patch", "delete"];
          const endPoint = "/api/ingredients/shoppinglist";
          const promises = invalidMethods.map((method) => {
            return request(app)
              [method](endPoint)
              .expect(405)
              .then(({ body: { msg } }) => {
                expect(msg).toBe("method not allowed!!!");
              });
          });
          return Promise.all(promises);
        });
      });
      describe("/ingredients/recipes", () => {
        test("GET: 200 - responds with an array of ingredients and how many times they are used in meals", () => {
          const apiString = `/api/ingredients/recipes`;
          return request(app)
            .get(apiString)
            .expect(200)
            .then(({ body: { ingredients } }) => {
              expect(ingredients).toEqual([
                {
                  ingredient_id: 1,
                  name: "Corned Beef",
                  type: "Store cupboard",
                  units: "cans",
                  recipesUsed: "1",
                },
                {
                  ingredient_id: 2,
                  name: "Baked Beans",
                  type: "Store cupboard",
                  units: "cans",
                  recipesUsed: "1",
                },
                {
                  ingredient_id: 3,
                  name: "Onion",
                  type: "Veg",
                  units: "no",
                  recipesUsed: "2",
                },
                {
                  ingredient_id: 4,
                  name: "Potatoes",
                  type: "Veg",
                  units: "g",
                  recipesUsed: "1",
                },
                {
                  ingredient_id: 5,
                  name: "Fishcakes",
                  type: "Meat",
                  units: "no",
                  recipesUsed: "1",
                },
                {
                  ingredient_id: 6,
                  name: "Waffles",
                  type: "Freezer",
                  units: "no",
                  recipesUsed: "1",
                },
                {
                  ingredient_id: 7,
                  name: "Misc green veg",
                  type: "Veg",
                  units: "no",
                  recipesUsed: "1",
                },
                {
                  ingredient_id: 8,
                  name: "Carrot",
                  type: "Veg",
                  units: "no",
                  recipesUsed: "1",
                },
                {
                  ingredient_id: 9,
                  name: "Chopped tomatoes",
                  type: "Store cupboard",
                  units: "cans",
                  recipesUsed: "1",
                },
                {
                  ingredient_id: 10,
                  name: "Stock cubes",
                  type: "Store cupboard",
                  units: "no",
                  recipesUsed: "1",
                },
                {
                  ingredient_id: 11,
                  name: "Bacon",
                  type: "Meat",
                  units: "g",
                  recipesUsed: "1",
                },
                {
                  ingredient_id: 12,
                  name: "Red lentils",
                  type: "Store cupboard",
                  units: "g",
                  recipesUsed: "1",
                },
                {
                  ingredient_id: 13,
                  name: "Unused ingredient",
                  type: "Store cupboard",
                  units: "g",
                  recipesUsed: "0",
                },
              ]);
            });
        });
        test("INVALID METHODS: 405 error", () => {
          const invalidMethods = ["put", "post", "patch", "delete"];
          const endPoint = "/api/ingredients/recipes";
          const promises = invalidMethods.map((method) => {
            return request(app)
              [method](endPoint)
              .expect(405)
              .then(({ body: { msg } }) => {
                expect(msg).toBe("method not allowed!!!");
              });
          });
          return Promise.all(promises);
        });
        describe("/ingredients/recipes/:ingredient_id", () => {
          test("GET: 200 - responds with an array indicating which meals an ingredient is used in", () => {
            const apiString = `/api/ingredients/recipes/3`;
            return request(app)
              .get(apiString)
              .expect(200)
              .then(({ body: { meals } }) => {
                expect(meals).toEqual([
                  { meal_id: 1, name: "Corned Beef Hash" },
                  { meal_id: 3, name: "Lentil and tomato soup" },
                ]);
              });
          });
          test("GET: 200 - responds with an array indicating which meals an ingredient is used in", () => {
            const apiString = `/api/ingredients/recipes/1`;
            return request(app)
              .get(apiString)
              .expect(200)
              .then(({ body: { meals } }) => {
                expect(meals).toEqual([
                  { meal_id: 1, name: "Corned Beef Hash" },
                ]);
              });
          });
          test("GET: 200 - responds with an array indicating which meals an ingredient is used in", () => {
            const apiString = `/api/ingredients/recipes/13`;
            return request(app)
              .get(apiString)
              .expect(200)
              .then(({ body: { meals } }) => {
                expect(meals).toEqual([]);
              });
          });

          test("GET: 400 - Badly formed meal_id", () => {
            const apiString = `/api/ingredients/recipes/sam`;
            return request(app)
              .get(apiString)
              .expect(400)
              .then(({ body: { msg } }) => {
                expect(msg).toBe("bad request to db!!!");
              });
          });
          test("INVALID METHODS: 405 error", () => {
            const invalidMethods = ["put", "post", "patch", "delete"];
            const endPoint = "/api/ingredients/recipes/1";
            const promises = invalidMethods.map((method) => {
              return request(app)
                [method](endPoint)
                .expect(405)
                .then(({ body: { msg } }) => {
                  expect(msg).toBe("method not allowed!!!");
                });
            });
            return Promise.all(promises);
          });
        });
      });
    });
  });
});
