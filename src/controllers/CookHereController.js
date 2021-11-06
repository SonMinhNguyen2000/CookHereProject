import mongoose from 'mongoose';
import { RecipeSchema } from '../models/CookHereModel';

const Recipe  = mongoose.model('Recipes', RecipeSchema);

export const addNewRecipe = (req, res) => {
    let newRecipe = new Recipe({
        title : 'Creme Brulee',
        description : 'also known as burned cream',
        instruction : 'add sugar...',
        username : 'user123',
        category : 'Dessert'
    });
    newRecipe.save((err, recipe) => {
        if (err){
            res.send(err);
            console.log("Error");
        }
        console.log("Success");
        res.json(recipe);
    })
}

export const getRecipes = (req,res) => {
    Recipe.find({}, (err, recipe) => {
      if (err) {
        res.send(err)
      }
      res.json(recipe)
    })
}
 
export const getRecipeWithID = (req,res) => {
    Recipe.findById(req.params.recipeID, (err, recipe) => {
      if (err) {
        res.send(err)
        console.log('asdaasdsa')
      }
      res.json(recipe)
    })
}

export const updateRecipe = (req,res) => {
  Recipe.findOneAndUpdate({ _id: req.params.recipeID }, req.body, { new: true, useFindAndModify: false }, (err, recipe) => {
    if (err) {
      res.send(err)
    }
    res.json(recipe)
  })
}

export const deleteRecipe = (req,res) => {
  Recipe.findOneAndDelete({ _id: req.params.recipeID }, (err, recipe) => {
    if (err) {
      res.send(err);
      console.log("asdsa");
    }
    res.json({message: "deleted recipe"})
    })
}