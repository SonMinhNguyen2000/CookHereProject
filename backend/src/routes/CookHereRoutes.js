import {
  addNewRecipe,
  getAllRecipes,
  getRecipeWithID,
  updateRecipe,
  deleteRecipe,
} from "../controllers/RecipeController";

const routes = (app) => {
        //create route for donations
        app.route('/recipes')
            //create get request
            .get(getAllRecipes)
            //create post request
            .post(addNewRecipe);
        // create a new route so you can get these donation entries by their ID's
        app.route('/recipes/:recipeID')
            // create get request
            .get(getRecipeWithID)
            //create put request
            .put(updateRecipe)
            //create delete request
            .delete(deleteRecipe);
    }
    // export it!
export default routes;