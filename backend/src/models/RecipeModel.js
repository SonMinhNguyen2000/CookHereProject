import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const RecipeSchema = new Schema({
  title: {
    type: String,
    required: "Enter Title",
  },
  description: {
    type: String,
    required: "Enter Description",
  },
  ingredients: {
    type: String,
    required: "Enter Ingredients",
  },
  instruction: {
    type: String,
    required: "Enter Instructions",
  },
  username: {
    type: String,
    required: true,
  },
  created_date: {
    type: Date,
    default: Date.now,
  },
  category: {
    type: String,
  },
  // TODO
  image: {
    type: String,
  },
  /*
    comment : {
        type : String
    } */
});

module.exports = mongoose.model('Recipes', RecipeSchema);