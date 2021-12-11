const Recipe = require("../models/RecipeModel")
const User = require("../models/UserModel")

const addNewRecipe = (req, res) => {
  try {
    let newRecipe = new Recipe(req.body);
    newRecipe.save((err, recipe) => {
      if (err){
        res.json({success: false, error : err});
      }
      else{
        res.json({success: true, result: recipe, message : "Successfuly Added Recipe"});
      }
    })
  } catch(err) {
    res.json({err: err})
  }

}

const getAllRecipes = (req,res) => {
  Recipe.find({}, (err, recipe) => {
    if (err) {
      res.json({success: false, error : err});
    }
    else{
      res.json({success: true, result: recipe});
    }     
  })
}

const getCategoryRecipes = (req, res) => {
  Recipe.find({ category: req.params.categoryName }, (err, recipe) => {
    if (err) {
      res.json({success: false, error : err});
    } else {
      res.json({success: true, result: recipe});
    }
  })
}

const getUserRecipes = (req,res) => {
  Recipe.find({username : req.params.username}, (err, recipe) => {
    if (err) {
      res.json({success: false, error : err});
    }
    else{
      res.json({success: true, result: recipe});
    }     
  })
}

// const getAUserRecipe = (req,res) => {
//   Recipe.findOne({username : req.params.username, _id:req.params.recipeId }, (err, recipe) => {
//     if (err) {
//       res.json({success: false, error : err});
//     }
//     else{
//       res.json({success: true, result: recipe});
//     }
//   })
// }

const getRecipeWithID = (req,res) => {
  Recipe.findById(req.params.recipeId, (err, recipe) => {
    if (err) {
      res.json({success: false, error : err});
    }
    else{
      res.json({success: true, result: recipe});
    }
  })
}

const updateRecipe = (req,res) => {
  Recipe.findOneAndUpdate({ _id: req.params.recipeId }, req.body, { new: true, useFindAndModify: false }, (err, recipe) => {
    if (err) {
      res.json({success: false, error : err});
    }
    else{
      res.json({success: true, result: recipe, message: "Successfuly Updated Recipe"})
    }   
  })
}

const deleteRecipe = async (req,res) => {
  try{
    const user = await User.find({email: req.user.email})
    const recipe = await Recipe.find({_id: req.params.recipeId})
    if (user.username === recipe.username) {
      try {
        await Recipe.deleteOne({_id: req.params.recipeId})
        res.json({success: true, result: recipe, message: "Successfully Deleted Recipe"})
      } catch(err) {
        res.status(400).json({error: {status: 400, message: "BAD_REQUEST"}})
      }
    } else {
      res.status(400).json({error: {status: 400, message: "ACCESS_DENIED"}})
    }
  } catch(err) {
    res.status(403).json({error: {status: 403, message: "RECIPE_NOT_FOUND"}})
  }

}

module.exports = {
  addNewRecipe,
  getAllRecipes,
  getCategoryRecipes,
  getUserRecipes,
  // getAUserRecipe,
  getRecipeWithID,
  updateRecipe,
  deleteRecipe
};

