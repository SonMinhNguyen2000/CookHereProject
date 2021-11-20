import * as controller from "../controllers/RecipeController";

const routes = (app) => {
        app.route('/recipes')
        //get all recipes
            .get(controller.getAllRecipes)
        //add new recipe
            .post(controller.addNewRecipe);
        app.route('/recipes/:recipeID')
            // create get request
            .get(controller.getRecipeWithID)
            //create put request
            .put(controller.updateRecipe)
            //create delete request
            .delete(controller.deleteRecipe);
        //get user recipe route
        app.route('/recipes/user/:username')
            .get(controller.getUserRecipes);
        //get recipe from category routes
        app.route('/recipes/category/:categoryName')
            .get(controller.getCategoryRecipes);   
}
export default routes;