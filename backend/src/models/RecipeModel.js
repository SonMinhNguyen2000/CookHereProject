import mongoose from 'mongoose';

const Schema = mongoose.Schema;

export const RecipeSchema = new Schema ({
    title : {
        type : String, 
        required : "Enter Title" 
        },
    description : {
         type : String,
         required : "Enter Description"
    },
    instruction : {
        type : String,
        required : "Enter Instructions"
    },
    username : {
        type : String
    },
    created_date : {
        type: Date,
        default: Date.now
    },
    category : {
        type : String
    },
    // TODO
    image : {
        type : String
    }
    /*
    comment : {
        type : String
    } */
})

