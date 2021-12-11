const express = require('express');
const controller = require('../controllers/RecipeController');
const verifyToken = require('../helper/verifyToken')

//router initialization
const router = express.Router();

//routes
//public
router.route('/')
      .get(controller.getAllRecipes)
      .post(controller.addNewRecipe);
router.get("/:recipeId", controller.getRecipeWithID);
router.get("/category/:categoryName", controller.getCategoryRecipes);
//auth
router.route("/auth/user/edit/:recipeId")
      .put(verifyToken.auth, controller.updateRecipe)
      .delete(verifyToken.auth, controller.deleteRecipe);
router.get("/auth/user/:username",verifyToken.auth,controller.getUserRecipes);
router.post("/auth/user/addRecipe", verifyToken.auth, controller.addNewRecipe);
//


// const routes = (app) => {
//         app.route('/recipes')
//         //get all recipes
//             .get(controller.getAllRecipes)
//         //add new recipe
//             .post(controller.addNewRecipe);
//         app.route('/recipes/:recipeID')
//             // create get request
//             .get(controller.getRecipeWithID)
//             //create put request
//             .put(controller.updateRecipe)
//             //create delete request
//             .delete(controller.deleteRecipe);
//         //get user recipe route
//         app.route('/recipes/user/:username')
//             .get(controller.getUserRecipes);
//         app.route('/recipe/user/:username/:recipeID')
//             .get(controller.getAUserRecipe);    
//         //get recipe from category routes
//         app.route('/recipes/category/:categoryName')
//             .get(controller.getCategoryRecipes);   
// }
module.exports = router;