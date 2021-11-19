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
            res.send(err);
        }
        else{
          res.json({message : "Successfuly Added Recipe"});
        }     
    })
}

export const getAllRecipes = (req,res) => {
    Recipe.find({}, (err, recipe) => {
      if (err) {
        res.send(err)
      }
      else{
        res.json(recipe)
      }     
    })
}

export const getBreakfastRecipes = (req,res) => {
  Recipe.find({category : "Breakfast"}, (err, recipe) => {
    if (err) {
      res.send(err)
    }
    else{
      res.json(recipe)
    }     
  })
}

export const getLunchRecipes = (req,res) => {
  Recipe.find({category : "Lunch"}, (err, recipe) => {
    if (err) {
      res.send(err)
    }
    else{
      res.json(recipe)
    }     
  })
}

export const getDinnerRecipes = (req,res) => {
  Recipe.find({category : "Dinner"}, (err, recipe) => {
    if (err) {
      res.send(err)
    }
    else{
      res.json(recipe)
    }     
  })
}

export const getDessertRecipes = (req,res) => {
  Recipe.find({category : "Dessert"}, (err, recipe) => {
    if (err) {
      res.send(err)
    }
    else{
      res.json(recipe)
    }     
  })
}

export const getUserRecipes = (req,res) => {
  Recipe.find({username : req.params.username}, (err, recipe) => {
    if (err) {
      res.send(err)
    }
    else{
      res.json(recipe)
    }     
  })
}
 
export const getRecipeWithID = (req,res) => {
    Recipe.findById(req.params.recipeID, (err, recipe) => {
      if (err) {
        res.send(err)
      }
      else{
        res.json(recipe)
      }
      })
}

export const updateRecipe = (req,res) => {
  Recipe.findOneAndUpdate({ _id: req.params.recipeID }, req.body, { new: true, useFindAndModify: false }, (err, recipe) => {
    if (err) {
      res.send(err)
    }
    else{
      res.json({message: "Successfuly Updated Recipe"})
    }
    
  })
}

export const deleteRecipe = (req,res) => {
  Recipe.findOneAndDelete({ _id: req.params.recipeID }, (err, recipe) => {
    if (err) {
      res.send(err);      
    }
    else {
      res.json({message: "Successfuly Deleted Recipe"})
    }
    })
}

