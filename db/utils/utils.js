exports.formatMeals = (mealsData) => {
  const formattedArray = mealsData.map(({ ...meals }) => {
    delete meals.ingredients;
    delete meals.quantities;
    return meals;
  });

  return formattedArray;
};

exports.getRecipes = (mealsData, mealRows, ingredientsRows) => {
  const recipesArray = [];

  const formattedArray = mealsData.map(({ ...meals }) => {
    meals.ingredient_ids = [];
    meals.meal_id = findMealIDs(meals.name, mealRows);

    meals.ingredients.forEach((ingredient) => {
      const matchedIngredient = findIngredientIDs(ingredient, ingredientsRows);
      meals.ingredient_ids.push(matchedIngredient);
    });
    delete meals.name;
    delete meals.portions;
    delete meals.ingredients;
    return meals;
  });

  formattedArray.forEach((meal) => {
    meal.ingredient_ids.forEach((ingredient_id, index) => {
      recipesArray.push({
        meal_id: meal.meal_id,
        ingredient_id: ingredient_id,
        quantity: meal.quantities[index],
      });
    });
  });

  return recipesArray;
};

function findIngredientIDs(ingredient, ingredientsRows) {
  const matchedIngredient = ingredientsRows.filter((el) => {
    return el.name === ingredient;
  });
  return matchedIngredient[0].ingredient_id;
}

function findMealIDs(name, mealRows) {
  const matchedMeal = mealRows.filter((el) => {
    return el.name === name;
  });
  return matchedMeal[0].meal_id;
}
