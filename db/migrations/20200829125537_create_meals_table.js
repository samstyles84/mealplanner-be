exports.up = function (knex) {
  console.log("creating meals table");
  return knex.schema.createTable("meals", (mealsTable) => {
    mealsTable.increments("meal_id");
    mealsTable.string("name").unique().notNullable();
    mealsTable.integer("portions").notNullable();
  });
};

exports.down = function (knex) {
  console.log("dropping meals table");
  return knex.schema.dropTable("meals");
};

/* 
      
*/
