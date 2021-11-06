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