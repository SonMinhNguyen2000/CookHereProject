import mongoose from 'mongoose';
import { RecipeSchema, UserSchema } from '../models/RecipeModel';


// title : 'Creme Brulee',
//         description : 'also known as burned cream',
//         instruction : 'add sugar...',
//         username : 'user123',
//         category : 'Dessert'
const Recipe  = mongoose.model('Recipes', RecipeSchema);

export const addNewRecipe = (req, res) => {   
  let newRecipe = new Recipe(req.body);
  newRecipe.save((err, recipe) => {
    if (err){
      res.json({success: false, error : err});
    }
    else{
      res.json({success: true, result: recipe, message : "Successfuly Added Recipe"});
    }     
  })
}

export const getAllRecipes = (req,res) => {
  Recipe.find({}, (err, recipe) => {
    if (err) {
      res.json({success: false, error : err});
    }
    else{
      res.json({success: true, result: recipe});
    }     
  })
}

export const getCategoryRecipes = (req, res) => {
  Recipe.find({ category: req.params.categoryName }, (err, recipe) => {
    if (err) {
      res.json({success: false, error : err});
    } else {
      res.json({success: true, result: recipe});
    }
  })
}

export const getUserRecipes = (req,res) => {
  Recipe.find({username : req.params.username}, (err, recipe) => {
    if (err) {
      res.json({success: false, error : err});
    }
    else{
      res.json({success: true, result: recipe});
    }     
  })
}

export const getAUserRecipe = (req,res) => {
  Recipe.findOne({username : req.params.username, _id:req.params.recipeID }, (err, recipe) => {
    if (err) {
      res.json({success: false, error : err});
    }
    else{
      res.json({success: true, result: recipe});
    }     
  })
}
 
export const getRecipeWithID = (req,res) => {
  Recipe.findById(req.params.recipeID, (err, recipe) => {
    if (err) {
      res.json({success: false, error : err});
    }
    else{
      res.json({success: true, result: recipe});
    }
  })
}

export const updateRecipe = (req,res) => {
  Recipe.findOneAndUpdate({ _id: req.params.recipeID }, req.body, { new: true, useFindAndModify: false }, (err, recipe) => {
    if (err) {
      res.json({success: false, error : err});
    }
    else{
      res.json({sucess: true, result: recipe, message: "Successfuly Updated Recipe"})
    }   
  })
}

export const deleteRecipe = (req,res) => {
  Recipe.findOneAndDelete({ _id: req.params.recipeID }, (err, recipe) => {
    if (err) {
      res.json({success: false, error : err});      
    }
    else {
      res.json({success: true, message: "Successfuly Deleted Recipe"})
    }
  })
}



